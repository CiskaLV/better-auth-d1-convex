import { betterAuth } from "better-auth";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { openAPI, jwt } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "~/lib/db";
import * as schema from "~/lib/db/auth-schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  disabledPaths: [
    "/sign-up/email",
    "/sign-in/email",
    "/verify-email",
    "/send-verification-email",
    "/change-email",
    "/change-password",
    "/request-password-reset",
  ],
  emailAndPassword: {
    enabled: false,
  },
  advanced: {
    ipAddress: {
      ipAddressHeaders: ["cf-connecting-ip"],
    },
  },

  plugins: [
    openAPI(),
    tanstackStartCookies(),
    jwt({
      jwt: {
        issuer: process.env.BETTER_AUTH_URL,
        audience: "better-auth", // Must match applicationID in convex/auth.config.ts
        expirationTime: "7d",
        //Can set what you want to be included in the JWT payload (will be used by Convex)
        definePayload: ({ user }: any) => ({
          // email: user.email,
        }),
      },
      // JWKS key configuration - Convex only supports RS256 and ES256
      jwks: {
        keyPairConfig: {
          alg: "ES256",
        },
        jwksPath: `/.well-known/jwks.json`, //Not really needed to be defined just fits the standard, Must match jwks in convex/auth.config.ts
      },
    }),
  ],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});
