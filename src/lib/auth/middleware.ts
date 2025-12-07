import { redirect } from "@tanstack/solid-router";
import { createMiddleware } from "@tanstack/solid-start";
import { auth } from "~/lib/auth";

export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      throw redirect({ to: "/login" });
    }

    return await next();
  },
);
