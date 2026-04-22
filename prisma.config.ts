import { defineConfig, env } from "prisma/config";
import { config } from "dotenv";

// Explicitly load the environment variables from your local file
config({ path: ".env.local" }); 

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // The CLI requires the direct connection to push schema changes to Supabase
    url: env("DIRECT_URL"),
  },
});