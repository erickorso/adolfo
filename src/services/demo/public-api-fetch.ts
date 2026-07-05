const DEFAULT_TIMEOUT_MS = 8_000;

export async function fetchPublicJson<T>(
  url: string,
  init?: RequestInit & { timeoutMs?: number },
): Promise<T> {
  const timeoutMs = init?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...init?.headers,
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(`Upstream responded ${response.status} for ${url}`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export async function postPublicJson<T>(
  url: string,
  body: unknown,
  init?: { timeoutMs?: number },
): Promise<T> {
  return fetchPublicJson<T>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    timeoutMs: init?.timeoutMs,
  });
}
