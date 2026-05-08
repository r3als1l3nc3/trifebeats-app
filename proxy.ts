import { NextRequest } from "next/server";

export function proxys(req: NextRequest) {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    return new Response("Admin password is not set.", { status: 500 });
  }

  const authHeader = req.headers.get("authorization");

  if (authHeader) {
    const basicAuth = authHeader.split(" ")[1];
    const [user, pass] = atob(basicAuth).split(":");

    if (user === username && pass === password) {
      return;
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
}