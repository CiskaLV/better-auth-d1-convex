import type { BetterAuthClientPlugin } from "better-auth/client";
import type { oidc } from "./index.js";

export const oidcClient = () => {
  return {
    id: "oidc",
    $InferServerPlugin: {} as ReturnType<typeof oidc>,
  } satisfies BetterAuthClientPlugin;
};
