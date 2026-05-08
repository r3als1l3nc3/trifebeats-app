import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const auth = request.headers.get("authorization");

  if (auth) {
    const [, encoded] = auth.split(" ");
    const decoded = atob(encoded);
    const [user, pass] = decoded.split(":");

    if (
      user === process.env.ADMIN_USERNAME &&
      pass === process.env.ADMIN_PASSWORD
    ) {
      return NextResponse.next();
    }
  }

  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="TrifeBeats Admin"',
    },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};