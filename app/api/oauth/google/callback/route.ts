import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/User";
import { setSessionCookie } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.redirect(new URL("/login", req.url));

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID as string;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET as string;
  const redirectUri = `${req.nextUrl.origin}/api/oauth/google/callback`;

  // Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }).toString(),
  });
  if (!tokenRes.ok) {
    const txt = await tokenRes.text().catch(() => "");
    console.error("Google token exchange failed", tokenRes.status, txt);
    return NextResponse.redirect(new URL("/login?error=token_exchange_failed", req.url));
  }
  const tokenJson = await tokenRes.json();

  // Get userinfo
  const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokenJson.access_token}` },
  });
  if (!userRes.ok) {
    const txt = await userRes.text().catch(() => "");
    console.error("Google userinfo failed", userRes.status, txt);
    return NextResponse.redirect(new URL("/login?error=userinfo_failed", req.url));
  }
  const info = await userRes.json();

  // Upsert user
  await connectToDatabase();
  const email = info.email as string;
  const name = info.name as string;
  const picture = info.picture as string | undefined;
  const user = await User.findOneAndUpdate(
    { email },
    { $setOnInsert: { name, passwordHash: "oauth", role: "resident" } },
    { new: true, upsert: true }
  ).lean();

  // Set session cookie with role
  setSessionCookie({ id: String(user._id), email: user.email, role: user.role, name: user.name, picture });

  return NextResponse.redirect(new URL("/home", req.url));
}


