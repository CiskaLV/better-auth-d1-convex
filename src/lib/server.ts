import { createServerFn } from "@tanstack/solid-start";
import { getCookie, getRequestHeaders } from "@tanstack/solid-start/server";
import { auth } from "~/lib/auth";

// Get auth information for SSR using available cookies
export const fetchAuth = createServerFn({ method: "GET" }).handler(async () => {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });
  const token = getCookie("better-auth.convex_jwt");
  // const { token } = await auth.api.getToken({
  //   headers,
  //   returnHeaders: false,
  // });

  console.log(token);

  return {
    session,
    token,
  };
});
