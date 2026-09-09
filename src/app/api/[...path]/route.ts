import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  auth,
  createDraft,
  projectIntentSchema,
  drafts,
  qualification,
  submissions,
  partnerProjects,
  partnerActions,
  uploads,
  updateDocument,
  downloadDocument,
  safeProject,
  locations,
} from "@/server/services";
import { appMode } from "@/server/config";
import { DomainError, readableError } from "@/domain/rules";
import { categories } from "@/domain/model";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
async function handle(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  try {
    const path = (await ctx.params).path;
    const method = req.method;
    if (method !== "GET") {
      const origin = req.headers.get("origin");
      if (
        origin &&
        origin !== req.nextUrl.origin &&
        new URL(origin).host !== req.headers.get("host")
      )
        throw new DomainError("Unzulässiger Anfrageursprung.", 403);
      if (req.headers.get("sec-fetch-site") === "cross-site")
        throw new DomainError("Unzulässiger Anfrageursprung.", 403);
    }
    if (path[0] === "session" && method === "POST") {
      const { role } = z
        .object({ role: z.enum(["OWNER", "PARTNER"]) })
        .strict()
        .parse(await req.json());
      const current = auth.resolve(
        req.cookies.get(
          role === "PARTNER" ? "gateway_partner" : "gateway_owner",
        )?.value,
      );
      if (current?.role === role) return NextResponse.json({ role });
      const { token } = auth.create(role);
      const res = NextResponse.json({ role, mode: appMode() });
      res.cookies.set(
        role === "PARTNER" ? "gateway_partner" : "gateway_owner",
        token,
        {
          httpOnly: true,
          secure: req.nextUrl.protocol === "https:",
          sameSite: "lax",
          path: "/",
          maxAge: 604800,
        },
      );
      return res;
    }
    if (path[0] === "locations" && method === "GET")
      return NextResponse.json(
        await locations.search(
          (req.nextUrl.searchParams.get("q") ?? "").slice(0, 240),
        ),
      );
    const partner = path[0] === "partner";
    const actor = auth.resolve(
      req.cookies.get(partner ? "gateway_partner" : "gateway_owner")?.value,
    );
    if (!actor)
      throw new DomainError("Sitzung abgelaufen. Bitte erneut öffnen.", 401);
    if (path[0] === "drafts" && path.length === 1 && method === "POST") {
      const v = z
        .object({
          address: z.string().trim().min(3).max(240),
          projectIntent: projectIntentSchema.optional(),
        })
        .strict()
        .parse(await req.json());
      return NextResponse.json(createDraft(actor, v.address, v.projectIntent));
    }
    if (
      partner &&
      path[1] === "projects" &&
      path.length === 2 &&
      method === "GET"
    )
      return NextResponse.json(
        partnerProjects.list(actor).map((p) => safeProject(p, actor)),
      );
    const id = partner ? path[2] : path[1];
    if (!id) throw new DomainError("Route nicht gefunden.", 404);
    const operation = partner ? path[3] : path[2];
    if (method === "GET" && !operation)
      return NextResponse.json(safeProject(drafts.get(id, actor), actor));
    if (operation === "documents" && method === "GET") {
      const docId = partner ? path[4] : path[3];
      const result = downloadDocument(id, docId, actor);
      return new NextResponse(new Uint8Array(result.bytes), {
        headers: {
          "Content-Type": result.document.mime,
          "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(result.document.name)}`,
          "Cache-Control": "private, no-store",
        },
      });
    }
    if (operation === "documents" && method === "POST") {
      if (Number(req.headers.get("content-length") ?? 0) > 20_100_000)
        throw new DomainError("Maximal 20 MB pro Datei.", 413);
      const form = await req.formData();
      const file = form.get("file");
      if (!(file instanceof File)) throw new DomainError("Datei fehlt.");
      const category = z.enum(categories).parse(form.get("category"));
      return NextResponse.json(
        safeProject(
          await uploads.upload(
            id,
            actor,
            file,
            category,
            Number(form.get("revision")),
          ),
          actor,
        ),
      );
    }
    if (Number(req.headers.get("content-length") ?? 0) > 100_000)
      throw new DomainError("Anfrage zu groß.", 413);
    const body = await req.json();
    if (operation === "documents" && method === "PATCH") {
      const v = z
        .object({
          revision: z.number().int(),
          documentId: z.string(),
          category: z.enum(categories).nullable(),
        })
        .strict()
        .parse(body);
      return NextResponse.json(
        updateDocument(id, v.documentId, actor, v.revision, v.category),
      );
    }
    if (path[0] === "drafts" && method === "PATCH") {
      const v = z
        .object({
          revision: z.number().int().positive(),
          step: z.number().int().min(1).max(10),
          answers: z.unknown(),
          completeStep: z.boolean().default(true),
        })
        .strict()
        .parse(body);
      return NextResponse.json(
        drafts.save(
          id,
          actor,
          v.revision,
          v.answers as never,
          v.step,
          v.completeStep,
        ),
      );
    }
    if (operation === "qualify" && method === "POST") {
      const v = z
        .object({ revision: z.number().int().positive() })
        .strict()
        .parse(body);
      return NextResponse.json(
        safeProject(await qualification.qualify(id, actor, v.revision), actor),
      );
    }
    if (operation === "submit" && method === "POST")
      return NextResponse.json(submissions.submit(id, actor, body));
    if (operation === "actions" && method === "POST")
      return NextResponse.json(
        safeProject(partnerActions.execute(id, actor, body), actor),
      );
    throw new DomainError("Route nicht gefunden.", 404);
  } catch (e) {
    return NextResponse.json(
      {
        error: readableError(e),
        field: e instanceof DomainError ? e.field : undefined,
      },
      {
        status:
          e instanceof DomainError
            ? e.status
            : e instanceof z.ZodError
              ? 422
              : 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
export const GET = handle;
export const POST = handle;
export const PATCH = handle;
