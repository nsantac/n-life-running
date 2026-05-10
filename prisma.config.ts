import { config } from "dotenv"
import { defineConfig } from "prisma/config"

// Load .env.local so Prisma CLI picks up the same vars as Next.js
config({ path: ".env.local", override: true })

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use the direct postgres:// URL for migrations (not the Accelerate URL)
    url: process.env["DATABASE_DIRECT_URL"],
  },
})
