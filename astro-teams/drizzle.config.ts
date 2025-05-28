import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    databaseId: process.env.DATABASE_ID || 'main_database',
    token: process.env.CLOUDFLARE_D1_TOKEN || '',
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID || '',
  },
} satisfies Config;