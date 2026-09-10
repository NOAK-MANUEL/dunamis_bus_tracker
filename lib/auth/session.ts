import "server-only";

import { cookies } from "next/headers";

const SESSION_COOKIE = "dunamis_admin_session";

export async function setAdminSession(accessToken: string) {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
  });
}

export async function getAdminSession() {
  const cookieStore = await cookies()

  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}

export async function clearAdminSession() {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE);
}