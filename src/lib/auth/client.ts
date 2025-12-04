import { createAuthClient } from "better-auth/solid";
import { oidcClient } from "~/lib/auth/plugins/oidc/client";

export const authClient = createAuthClient({
  plugins: [oidcClient()],
});
