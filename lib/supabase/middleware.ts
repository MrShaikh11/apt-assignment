import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // No authentication or session logic; just pass the request through
  return NextResponse.next({ request });
}
