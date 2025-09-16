import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID as string;
  const redirectUri = `${req.nextUrl.origin}/api/oauth/google/callback`;
  const scope = encodeURIComponent("openid email profile");
  const state = ""; // optionally add CSRF token
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${scope}&state=${state}&prompt=select_account`;
  return NextResponse.redirect(url);
}


