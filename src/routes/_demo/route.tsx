import { createFileRoute, Outlet } from "@tanstack/solid-router";
import { ConvexProvider, setupConvex } from "convex-solidjs";
import { authClient } from "~/lib/auth/client";
import { authMiddleware } from "~/lib/auth/middleware";

export const Route = createFileRoute("/_demo")({
  component: RouteComponent,
  server: {
    middleware: [authMiddleware],
  },
});

function RouteComponent() {
  const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;

  if (!CONVEX_URL) {
    console.error("missing envar CONVEX_URL");
  }

  // Set up Convex client with auth
  const convexClient = setupConvex(CONVEX_URL);

  convexClient.setAuth(async () => {
    const { data } = await authClient.token();
    return data?.token || null;
  });

  return (
    <ConvexProvider client={convexClient}>
      <Outlet />
    </ConvexProvider>
  );
}
