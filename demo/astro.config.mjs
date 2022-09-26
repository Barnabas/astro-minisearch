import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import react from "@astrojs/react";
import { plainTextPlugin } from "@barnabask/astro-minisearch";

// https://astro.build/config
export default defineConfig({
  integrations: [
    // Enable Preact to support Preact JSX components.
    preact(),
    // Enable React for the Algolia search component.
    react(),
  ],
  site: `http://astro.build`,
  markdown: {
    rehypePlugins: [plainTextPlugin()],
    extendDefaultPlugins: true,
  },
});
