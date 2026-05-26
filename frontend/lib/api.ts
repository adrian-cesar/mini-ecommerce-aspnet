const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5250";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("authToken", token);
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("authToken");
}

export async function apiFetch<T>(
  endpoint: string,
  init?: RequestInit,
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...init,
      headers,
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      "Nao foi possivel conectar ao servidor da API. Verifique se o backend ASP.NET esta em execucao.",
      0,
    );
  }

  if (!response.ok) {
    let message = "Failed to complete request.";

    try {
      const payload = (await response.json()) as { message?: string; title?: string };
      message = payload.message ?? payload.title ?? message;
    } catch {
      // Keep fallback message when API does not return JSON
    }

    // If unauthorized, clear stored token and retry once without Authorization
    if (response.status === 401) {
      clearAuthToken();

      // Retry once without Authorization header
      const retryHeaders = { ...headers };
      delete retryHeaders.Authorization;

      const retryResp = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...init,
        headers: retryHeaders,
        cache: "no-store",
      }).catch(() => null);

      if (retryResp && retryResp.ok) return (await retryResp.json()) as T;
    }

    throw new ApiError(message, response.status);
  }

  return (await response.json()) as T;
}
