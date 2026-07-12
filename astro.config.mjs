// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  // Update this to your real domain once the site is live on Netlify.
  site: 'https://jimmiszaniec.netlify.app',
  integrations: [mdx()],
  markdown: {
    // The code blocks on this site are AI system prompts, not source code —
    // plain styling from global.css fits them better than syntax colors.
    syntaxHighlight: false,
  },
});
