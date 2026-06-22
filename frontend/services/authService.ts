import { apiFetch, setAuthToken, clearAuthToken } from "@/lib/api";
import type { LoginRequest, LoginResponse, RegisterRequest, User } from "@/types";

const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
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

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiFetch<LoginResponse>(AUTH_ENDPOINTS.LOGIN, {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.token) {
      setAuthToken(response.token);
    }

    setStoredUser(response.user);
    return response;
  },

  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await apiFetch<LoginResponse>(AUTH_ENDPOINTS.REGISTER, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.token) {
      setAuthToken(response.token);
    }

    setStoredUser(response.user);
    return response;
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
