import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("AccessToken");

  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
