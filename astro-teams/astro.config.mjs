// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  integrations: [
    mdx(),
    icon(),
  ],
  server: {
    host: '0.0.0.0',
    port: 4321,
    allowedHosts: ['team.homedevenv.com', 'localhost', 'astro-dev']
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