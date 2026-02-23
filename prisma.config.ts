import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
  url: "postgresql://neondb_owner:npg_wle6BNGUo7ZA@ep-silent-heart-ai91gvu8-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  },
});