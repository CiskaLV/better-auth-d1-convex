import { createFileRoute } from "@tanstack/solid-router";
import { authClient } from "~/lib/auth/client";

export const Route = createFileRoute("/_auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <button onClick={() => authClient.signIn.social({ provider: "github" })}>
      Login With GitHub
    </button>
  );
}
