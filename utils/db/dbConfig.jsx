// import { neon } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-http";
// import * as schema from "./schema";

// const sql = neon(process.env.DATABASE_URL);

// export const db = drizzle(sql, { schema });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
const sql = neon(
  "postgresql://zero-to-hero_owner:V5kpwt8yBbqE@ep-noisy-resonance-a1wzf294.ap-southeast-1.aws.neon.tech/zero-to-hero?sslmode=require"
);

export const db = drizzle(sql, { schema });
