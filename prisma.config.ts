import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Neon: use DIRECT_URL for CLI (migrate, studio); app uses DATABASE_URL (pooled) at runtime
    url: env("DIRECT_URL"),
  },
});
