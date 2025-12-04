import { createAuthClient } from "better-auth/solid";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [jwtClient()],
});

export const getToken = authClient.token;
