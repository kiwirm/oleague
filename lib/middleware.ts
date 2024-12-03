import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const credentialsBuffer = Buffer.from(
  `${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`
).toString("base64");

export function middleware(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    const [scheme, credentials] = authHeader.split(" ");
    if (scheme === "Basic" && credentials === credentialsBuffer) {
      return NextResponse.next();
    }
  }
  const response = new NextResponse("Unauthorized", { status: 401 });
  response.headers.set("WWW-Authenticate", 'Basic realm="Secure Area"');
  return response;
}

// Apply the middleware to /admin/* routes
export const config = {
  matcher: ["/admin/:path*"],
};
