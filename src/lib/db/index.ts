import { drizzle } from "drizzle-orm/d1";
import { env } from "cloudflare:workers";
import * as schema from "./auth-schema";

export const db = env ? drizzle(env.DB, { schema, logger: true }) : ({} as any);
