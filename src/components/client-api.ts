export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public field?: string,
  ) {
    super(message);
  }
}
export async function api<T>(
  url: string,
  method = "GET",
  data?: unknown,
): Promise<T> {
  const controller = new AbortController();
  // Uploads need a longer window than the small JSON requests in the check.
  const timeout = setTimeout(
    () => controller.abort(),
    data instanceof FormData ? 120_000 : 15_000,
  );
  try {
    const res = await fetch(url, {
      method,
      headers:
        data instanceof FormData ? {} : { "Content-Type": "application/json" },
      body:
        data === undefined
          ? undefined
          : data instanceof FormData
            ? data
            : JSON.stringify(data),
      cache: "no-store",
      signal: controller.signal,
    });
    if (res.status === 204) return undefined as T;
    const text = await res.text();
    let body: unknown;
    try {
      body = JSON.parse(text);
    } catch {
      throw new ApiError(
        res.ok
          ? "Die Serverantwort konnte nicht gelesen werden. Bitte laden Sie den aktuellen Stand erneut."
          : `Der Server ist momentan nicht erreichbar (HTTP ${res.status}). Ihre Eingaben bleiben erhalten. Bitte erneut versuchen.`,
        res.status,
      );
    }
    if (!res.ok) {
      const detail =
        body !== null && typeof body === "object"
          ? (body as { error?: unknown; field?: unknown })
          : {};
      throw new ApiError(
        typeof detail.error === "string"
          ? detail.error
          : "Der Vorgang ist fehlgeschlagen. Bitte erneut versuchen.",
        res.status,
        typeof detail.field === "string" ? detail.field : undefined,
      );
    }
    return body as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (controller.signal.aborted)
      throw new ApiError(
        "Die Antwort dauert zu lange. Ihre Eingaben bleiben erhalten. Ob der Vorgang gespeichert wurde, ist noch unklar; bitte prüfen Sie den aktuellen Stand.",
        0,
      );
    throw new ApiError(
      "Verbindung unterbrochen. Ihre Eingaben bleiben erhalten. Bitte erneut versuchen.",
      0,
    );
  } finally {
    clearTimeout(timeout);
  }
}
