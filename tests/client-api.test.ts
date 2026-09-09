import { afterEach, describe, expect, it, vi } from "vitest";
import { api, ApiError } from "@/components/client-api";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("Readable and bounded API requests", () => {
  it("preserves validation and conflict metadata returned by the server", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(
            JSON.stringify({
              error: "Bitte prüfen Sie die Adresse.",
              field: "address",
            }),
            { status: 409 },
          ),
        ),
    );
    await expect(
      api("/api/drafts", "POST", { address: "Halle" }),
    ).rejects.toMatchObject({
      message: "Bitte prüfen Sie die Adresse.",
      status: 409,
      field: "address",
    });
  });

  it("turns an HTML gateway error into a useful message instead of a JSON parse failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response("<html><h1>Bad Gateway</h1></html>", { status: 502 }),
        ),
    );
    const error = await api("/api/drafts", "POST", { address: "Halle" }).catch(
      (e) => e,
    );
    expect(error).toBeInstanceOf(ApiError);
    if (!(error instanceof ApiError)) throw error;
    expect(error.status).toBe(502);
    expect(error.message).toContain("HTTP 502");
    expect(error.message).toContain("Eingaben bleiben erhalten");
    expect(error.message).not.toContain("<html>");
  });

  it("does not treat an invalid success response as successfully saved", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("not-json", { status: 200 })),
    );
    await expect(api("/api/drafts", "PATCH", {})).rejects.toMatchObject({
      status: 200,
      message: expect.stringContaining("nicht gelesen"),
    });
  });

  it("bounds a stalled request and leaves its save result explicitly unconfirmed", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn(
      (_url: string, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          init.signal!.addEventListener("abort", () =>
            reject(new DOMException("Aborted", "AbortError")),
          );
        }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const result = expect(
      api("/api/drafts", "POST", { address: "Halle" }),
    ).rejects.toMatchObject({
      status: 0,
      message: expect.stringContaining("noch unklar"),
    });
    await vi.advanceTimersByTimeAsync(15_000);
    await result;
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("also bounds a response that stalls while its body is being read", async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "fetch",
      vi.fn((_url: string, init: RequestInit) =>
        Promise.resolve({
          status: 200,
          ok: true,
          text: () =>
            new Promise((_resolve, reject) => {
              init.signal!.addEventListener("abort", () =>
                reject(new DOMException("Aborted", "AbortError")),
              );
            }),
        }),
      ),
    );
    const result = expect(api("/api/projects/test")).rejects.toMatchObject({
      status: 0,
      message: expect.stringContaining("dauert zu lange"),
    });
    await vi.advanceTimersByTimeAsync(15_000);
    await result;
  });

  it("gives uploads time to finish and clears the timeout after success", async () => {
    vi.useFakeTimers();
    let resolveFetch!: (response: Response) => void;
    const fetchMock = vi.fn(
      () =>
        new Promise<Response>((resolve) => {
          resolveFetch = resolve;
        }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const data = new FormData();
    data.append("category", "Fotos");
    const pending = api("/api/projects/test/documents", "POST", data);
    await vi.advanceTimersByTimeAsync(20_000);
    const init = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(init[1].signal?.aborted).toBe(false);
    expect(init[1].headers).toEqual({});
    resolveFetch(new Response(JSON.stringify({ ready: true })));
    await expect(pending).resolves.toEqual({ ready: true });
    expect(vi.getTimerCount()).toBe(0);
  });
});
