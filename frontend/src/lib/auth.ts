import * as React from "react";
import type { NavigateFunction } from "react-router-dom";

import { ApiError, apiFetch, clearSessionToken, setSessionToken } from "@/lib/api";

export type User = { id: number; email: string; timezone: string };
type AuthResponse = { token: string; user: User };

const timezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

async function authenticate(path: string, email: string, password: string): Promise<User> {
  const res = await apiFetch<AuthResponse>(path, {
    method: "POST",
    body: JSON.stringify({ email, password, timezone: timezone() }),
  });
  setSessionToken(res.token);
  return res.user;
}

export const signUp = (email: string, password: string) =>
  authenticate("/auth/signup", email, password);
export const signIn = (email: string, password: string) =>
  authenticate("/auth/signin", email, password);

export async function signOut(navigate: NavigateFunction): Promise<void> {
  try {
    await apiFetch<void>("/auth/signout", { method: "POST" });
  } catch {
    // Ignored: the local session is dropped regardless.
  }
  clearSessionToken();
  navigate("/sign-in", { replace: true });
}

export function useCurrentUser(): User | null {
  const [user, setUser] = React.useState<User | null>(null);
  React.useEffect(() => {
    let live = true;
    apiFetch<User>("/auth/me")
      .then((u) => live && setUser(u))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  return user;
}

// Maps a failed auth call to field errors (422) and/or a form-level message.
export function authErrors(err: unknown): {
  fields: { email?: string; password?: string };
  form?: string;
} {
  const fields: { email?: string; password?: string } = {};
  if (err instanceof ApiError) {
    const detail = (err.body as { detail?: unknown } | null)?.detail;
    if (err.status === 422 && Array.isArray(detail)) {
      for (const d of detail as Array<{ loc?: unknown[]; msg?: string }>) {
        const f = d.loc?.[1];
        if (f === "email" || f === "password") fields[f] = d.msg ?? "Invalid value.";
      }
      if (fields.email || fields.password) return { fields };
    }
    if (typeof detail === "string") return { fields, form: detail };
  }
  return { fields, form: "Something went wrong. Please try again." };
}
