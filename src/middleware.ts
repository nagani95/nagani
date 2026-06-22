// src/middleware.ts

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PLAYER_HOSTS = ["naganishweohh.com", "www.naganishweohh.com"];
const ADMIN_HOST = "admin.naganishweohh.com";
const AGENT_HOST = "agent.naganishweohh.com";

const PROTECTED_PLAYER_ROUTES = ["/profile", "/cashier", "/six-animal"];

function isProtectedPlayerRoute(pathname: string) {
  return PROTECTED_PLAYER_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function getCleanHost(request: NextRequest) {
  return (request.headers.get("host") ?? "")
    .toLowerCase()
    .replace(/:\d+$/, "");
}

function isProductionNaganiHost(host: string) {
  return (
    PLAYER_HOSTS.includes(host) ||
    host === ADMIN_HOST ||
    host === AGENT_HOST
  );
}

function isAdminRoute(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isAgentRoute(pathname: string) {
  return pathname === "/agent" || pathname.startsWith("/agent/");
}

function redirectToHost(
  request: NextRequest,
  host: string,
  pathname: string,
) {
  const redirectUrl = request.nextUrl.clone();

  redirectUrl.protocol = "https:";
  redirectUrl.host = host;
  redirectUrl.pathname = pathname;

  return NextResponse.redirect(redirectUrl);
}

function redirectSamePathToHost(request: NextRequest, host: string) {
  const redirectUrl = request.nextUrl.clone();

  redirectUrl.protocol = "https:";
  redirectUrl.host = host;

  return NextResponse.redirect(redirectUrl);
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const host = getCleanHost(request);

  if (isProductionNaganiHost(host)) {
    if (host === ADMIN_HOST) {
      if (pathname === "/") {
        return redirectToHost(request, ADMIN_HOST, "/admin/login");
      }

      if (!isAdminRoute(pathname)) {
        return redirectToHost(request, ADMIN_HOST, "/admin/login");
      }
    }

    if (host === AGENT_HOST) {
      if (pathname === "/") {
        return redirectToHost(request, AGENT_HOST, "/agent/login");
      }

      if (!isAgentRoute(pathname)) {
        return redirectToHost(request, AGENT_HOST, "/agent/login");
      }
    }

    if (PLAYER_HOSTS.includes(host)) {
      if (isAdminRoute(pathname)) {
        return redirectSamePathToHost(request, ADMIN_HOST);
      }

      if (isAgentRoute(pathname)) {
        return redirectSamePathToHost(request, AGENT_HOST);
      }
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nagani-pathname", pathname);

  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isProtectedPlayerRoute(pathname) && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|mp4|ico)$).*)",
  ],
};