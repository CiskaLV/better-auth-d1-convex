import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      type: "customJwt",
      issuer: `${process.env.BETTER_AUTH_URL}`,
      applicationID: "better-auth",
      jwks: `${process.env.BETTER_AUTH_URL}/api/auth/.well-known/jwks.json`,
      algorithm: "ES256",
    },
  ],
} satisfies AuthConfig;
