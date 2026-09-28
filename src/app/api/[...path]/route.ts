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
  downloadDocumentStream,
  safeProject,
  locations,
} from "@/server/services";
import { appMode } from "@/server/config";
import { DomainError, readableError } from "@/domain/rules";
import { categories } from "@/domain/model";
import {
  boundedRequestBytes,
  cancelUploadTransfer,
  finishUploadTransfer,
  putUploadChunk,
  startUploadTransfer,
  UPLOAD_CHUNK_BYTES,
} from "@/server/upload-transfer";

async function jsonBody(req: NextRequest) {
  const bytes = await boundedRequestBytes(req, 100_000);
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new DomainError("Ungültige Anfrage.", 422);
  }
}

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
        .parse(await jsonBody(req));
      const current = await auth.resolve(
        req.cookies.get(
          role === "PARTNER" ? "gateway_partner" : "gateway_owner",
        )?.value,
      );
      if (current?.role === role) return NextResponse.json({ role });
      const { token } = await auth.create(role);
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
    const actor = await auth.resolve(
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
        .parse(await jsonBody(req));
      return NextResponse.json(
        await createDraft(actor, v.address, v.projectIntent),
      );
    }
    if (
      partner &&
      path[1] === "projects" &&
      path.length === 2 &&
      method === "GET"
    )
      return NextResponse.json(
        (await partnerProjects.list(actor)).map((p) => safeProject(p, actor)),
      );
    const id = partner ? path[2] : path[1];
    if (!id) throw new DomainError("Route nicht gefunden.", 404);
    const operation = partner ? path[3] : path[2];
    if (method === "GET" && !operation)
      return NextResponse.json(safeProject(await drafts.get(id, actor), actor));
    if (operation === "documents" && method === "GET") {
      const docId = partner ? path[4] : path[3];
      const result = await downloadDocumentStream(id, docId, actor);
      return new NextResponse(result.stream, {
        headers: {
          "Content-Type": result.document.mime,
          "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(result.document.name)}`,
          "Cache-Control": "private, no-store",
        },
      });
    }
    if (operation === "documents" && method === "POST") {
      // Small multipart requests remain supported for existing integrations.
      // Larger files use the authenticated transfer protocol below.
      const bytes = await boundedRequestBytes(
        req,
        UPLOAD_CHUNK_BYTES + 100_000,
      );
      const form = await new Response(bytes, {
        headers: { "Content-Type": req.headers.get("content-type") ?? "" },
      }).formData();
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
    if (operation === "transfers" && !partner && path[0] === "projects") {
      if (method === "POST" && path.length === 3)
        return NextResponse.json(
          await startUploadTransfer(id, actor, await jsonBody(req)),
        );
      const transferId = path[3];
      if (method === "PUT" && path.length === 5 && /^\d+$/.test(path[4])) {
        const bytes = await boundedRequestBytes(req, UPLOAD_CHUNK_BYTES);
        return NextResponse.json(
          await putUploadChunk(id, transferId, actor, Number(path[4]), bytes),
        );
      }
      if (method === "POST" && path.length === 5 && path[4] === "complete")
        return NextResponse.json(
          safeProject(await finishUploadTransfer(id, transferId, actor), actor),
        );
      if (method === "DELETE" && path.length === 4)
        return NextResponse.json(
          await cancelUploadTransfer(id, transferId, actor),
        );
      throw new DomainError("Route nicht gefunden.", 404);
    }
    const body = await jsonBody(req);
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
        safeProject(
          await updateDocument(id, v.documentId, actor, v.revision, v.category),
          actor,
        ),
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
        await drafts.save(
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
      return NextResponse.json(await submissions.submit(id, actor, body));
    if (operation === "actions" && method === "POST")
      return NextResponse.json(
        safeProject(await partnerActions.execute(id, actor, body), actor),
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
export const PUT = handle;
export const DELETE = handle;
