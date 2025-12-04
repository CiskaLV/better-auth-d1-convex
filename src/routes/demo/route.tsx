import { createFileRoute, Outlet } from "@tanstack/solid-router";
import { ConvexProvider, setupConvex } from "convex-solidjs";
import { authClient } from "~/lib/auth/client";

export const Route = createFileRoute("/demo")({
  ssr: false,
  component: RouteComponent,
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
    console.log("Token In setAuth", data?.token);
    return data?.token || null;
  });

  return (
    <ConvexProvider client={convexClient}>
      <Outlet />
    </ConvexProvider>
  );
}
