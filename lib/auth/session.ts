import "server-only";

import { cookies } from "next/headers";

const SESSION_ADMIN = "dunamis_admin_session";
const SESSION_DRIVER = "dunamis_driver_session";


export async function setAdminSession(accessToken: string) {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_ADMIN, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
  });
}

export async function getAdminSession() {
  const cookieStore = await cookies()

  return cookieStore.get(SESSION_ADMIN)?.value ?? null;
}

export async function clearAdminSession() {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_ADMIN);
}


export async function setDriverSession(accessToken: string) {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_DRIVER, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path:"/driver/track",
    maxAge: 60 * 60 * 8,
  });
}

export async function getDriverSession() {
  const cookieStore = await cookies()

  return cookieStore.get(SESSION_DRIVER)?.value ?? null;
}

export async function clearDriverSession() {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_DRIVER);
}


export async function setDefaultSession(name: string,accessToken: string) {
  const cookieStore = await cookies();

  cookieStore.set(name, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
  });
}

export async function getDefaultSession(name: string) {
  const cookieStore = await cookies()

  return cookieStore.get(name)?.value ?? null;
}

export async function clearDefaultSession(name:string) {
  const cookieStore = await cookies();

  cookieStore.delete(name);
}