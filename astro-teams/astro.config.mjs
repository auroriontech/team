// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import db from '@astrojs/db';

// https://astro.build/config
export default defineConfig({
  output: 'server', // Enable server-side rendering for API routes
  integrations: [
    mdx(),
    icon(),
    db({
      studio: false // Use local database instead of Astro Studio
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 4000,
    allowedHosts: ['team.homedevenv.com', 'astro-dev']
  },
  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 1000
      }
    }
  }
});

// Temporary: Removed astro-icon integration to test if it's causing the page loading issues