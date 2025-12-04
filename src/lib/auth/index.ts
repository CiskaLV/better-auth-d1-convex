import { betterAuth } from "better-auth";
// import { oidc } from "~/lib/auth/plugins/oidc";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { openAPI, oidcProvider, jwt, genericOAuth } from "better-auth/plugins";
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

  jwt: {
    enabled: true,
    issuer: process.env.BETTER_AUTH_URL,
    audience: "better-auth",
    expiresIn: 60 * 60 * 24 * 7,

    customize: (user: any) => {
      return {
        sub: user.id, // User ID in subject claim (what Convex reads)
        // Optional: Add other useful claims
        email: user.email,
        email_verified: user.emailVerified,
        // Don't add sensitive data like passwords or tokens!
      };
    },
  },

  plugins: [
    openAPI(),
    tanstackStartCookies(),
    jwt({
      // JWT plugin configuration - nested under 'jwt' property
      jwt: {
        issuer: process.env.BETTER_AUTH_URL,
        audience: "better-auth", // Must match applicationID in convex/auth.config.ts
        expirationTime: "7d", // 7 days to match session expiration
        // Custom JWT payload claims
        definePayload: ({ user }: any) => ({
          email: user.email,
          email_verified: user.emailVerified,
        }),
      },
      // JWKS key configuration - Convex only supports RS256 and ES256
      jwks: {
        keyPairConfig: {
          alg: "ES256",
        },
        jwksPath: `/.well-known/jwks.json`,
      },
    }),
    // jwt({
    //   jwt: {
    //     audience: "convex",
    //   },
    //   jwks: {
    //     jwksPath: "/.well-known/jwks.json",
    //     keyPairConfig: {
    //       alg: "RS256",
    //     },
    //   },
    //   disableSettingJwtHeader: true,
    // }),
    // oidcProvider({
    //   useJWTPlugin: true,
    //   loginPage: "/login",
    //   trustedClients: [
    //     {
    //       clientId: "convex",
    //       clientSecret: "convex",
    //       name: "Convex App kind of cool",
    //       type: "web",
    //       redirectUrls: [
    //         "https://openidconnect.net/callback",
    //         "https://psteniusubi.github.io/oidc-tester/authorization-code-flow.html",
    //         "https://oidcdebugger.com/debug",
    //       ],
    //       disabled: false,
    //       skipConsent: true,
    //       metadata: {},
    //     },
    //   ],
    //   metadata: {
    //     jwks_uri: `${process.env.BETTER_AUTH_URL}/api/auth/.well-known/jwks.json`,
    //   },
    // }),
  ],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});
