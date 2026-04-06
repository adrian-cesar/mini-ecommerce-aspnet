import { apiFetch, setAuthToken, clearAuthToken } from "@/lib/api";
import type { LoginRequest, LoginResponse, User } from "@/types";

const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  ME: "/auth/me",
};

const AUTH_USER_KEY = "authUser";

function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;

  const rawUser = localStorage.getItem(AUTH_USER_KEY);
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as User;
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
}

function setStoredUser(user: User): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

function clearStoredUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_USER_KEY);
}

function createDemoUser(email: string): User {
  const localPart = email.split("@")[0] || "usuario";
  const name = localPart
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  return {
    id: "demo-user",
    email,
    name: name.trim() || "Usuario Demo",
  };
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiFetch<LoginResponse>(AUTH_ENDPOINTS.LOGIN, {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      if (response.token) {
        setAuthToken(response.token);
      }

      setStoredUser(response.user);
      return response;
    } catch {
      const user = createDemoUser(credentials.email);
      const response: LoginResponse = {
        token: `demo-${Date.now()}`,
        user,
      };

      setAuthToken(response.token);
      setStoredUser(user);
      return response;
    }
  },

  async logout(): Promise<void> {
    try {
      await apiFetch<void>(AUTH_ENDPOINTS.LOGOUT, {
        method: "POST",
      });
    } catch {
      // Error doesn't matter, we'll clear token anyway
    }

    clearAuthToken();
    clearStoredUser();
  },

  async getCurrentUser(): Promise<User | null> {
    const storedUser = getStoredUser();
    if (storedUser) {
      return storedUser;
    }

    try {
      const user = await apiFetch<User>(AUTH_ENDPOINTS.ME);
      setStoredUser(user);
      return user;
    } catch {
      clearAuthToken();
      clearStoredUser();
      return null;
    }
  },

  getStoredToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("authToken");
  },

  isAuthenticated(): boolean {
    return this.getStoredToken() !== null;
  },
};
