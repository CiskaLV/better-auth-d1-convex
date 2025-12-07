# Better Auth + D1 + Convex

## Introduction
This is a proof of concept of how to use Better Auth with a D1 database and have that auth in Convex with jwt tokens

## Why
I understand that you can store your auth in convex but i don't need it to be reactive and i thing this way lets me be more flexible.

## Implementation
### All we do is setup convex to use custom provider for auth

```ts
// convex/auth.config.ts
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
```

### And then tell Better auth to provide a token
```ts
jwt({
  jwt: {
    issuer: process.env.BETTER_AUTH_URL,
    audience: "better-auth", // Must match applicationID in convex/auth.config.ts
    expirationTime: "7d",
    //Can set what you want to be included in the JWT payload (will be used by Convex)
    definePayload: ({ user }: any) => ({
      email: user.email,
    }),
  },
  jwks: {
    keyPairConfig: {
      alg: "ES256",
    },
    jwksPath: `/.well-known/jwks.json`, //Not really needed to be defined just fits the standard, Must match jwks in convex/auth.config.ts
  },
})
```

### That we then pass to your convex client
```ts
convexClient.setAuth(async () => {
  const { data } = await authClient.token();
  return data?.token || null;
});
```

## How to use
1. Install the dependencies
```bash
bun install
```

2. Setup Environment Variables
```bash
cp .env.example .env
```

3. Setup Convex Instance (If you don't use local you have to use some thing like ngrok so that convex can access your local machine)
```bash
bun x convex dev --local
```

4. Setup Database
Change the wrangler.jsonc to have your own D1 database
```bash
bun x wrangler d1 create <DATABASE_NAME>
```
Run migrations to have the required tables
```bash
bun run db:migrate
```

5. Start the application
```bash
bun run dev
```

## I would like to also add a SSR example as in theory it also should work with SSR
