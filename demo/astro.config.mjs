import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { plainTextPlugin } from "@barnabask/astro-minisearch";
import sitemap from '@astrojs/sitemap';

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [mdx(), sitemap()],
  markdown: {
    rehypePlugins: [plainTextPlugin()]
  },
  output: "server",
  adapter: node({
    mode: "standalone"
  })
});