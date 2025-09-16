import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE = "scc_session";

function getSecret(): string {
  const s = process.env.APP_SECRET || process.env.NEXTAUTH_SECRET || "dev-secret";
  return s;
}

export function createSignedSession(payload: Record<string, any>): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const hmac = crypto.createHmac("sha256", getSecret()).update(data).digest("base64url");
  return `${data}.${hmac}`;
}

export function setSessionCookie(payload: Record<string, any>) {
  const value = createSignedSession(payload);
  cookies().set(SESSION_COOKIE, value, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
}


