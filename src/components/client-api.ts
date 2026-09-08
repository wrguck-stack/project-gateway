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
  let res: Response;
  try {
    res = await fetch(url, {
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
    });
  } catch {
    throw new ApiError(
      "Verbindung unterbrochen. Ihre Eingaben bleiben erhalten. Bitte erneut versuchen.",
      0,
    );
  }
  const body = await res.json();
  if (!res.ok)
    throw new ApiError(
      body.error ?? "Der Vorgang ist fehlgeschlagen.",
      res.status,
      body.field,
    );
  return body as T;
}
