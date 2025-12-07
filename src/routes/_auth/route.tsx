import { createFileRoute, Outlet, redirect } from "@tanstack/solid-router";
import { createMiddleware } from "@tanstack/solid-start";
import { auth } from "~/lib/auth";

export const Route = createFileRoute("/_auth")({
  component: () => <Outlet />,
  server: {
    middleware: [
      createMiddleware().server(async ({ next, request }) => {
        const session = await auth.api.getSession({ headers: request.headers });

        if (session) {
          throw redirect({ to: "/" });
        }

        return await next();
      }),
    ],
  },
});
