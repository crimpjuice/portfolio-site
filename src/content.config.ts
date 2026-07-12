import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Projects — one file per case study in src/content/projects/.
 * The frontmatter here is validated at build time: if a field is missing
 * or misspelled, `npm run build` tells you exactly which file and why.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    category: z.enum([
      'Tutoring',
      'Curriculum Design',
      'Assessment',
      'Feedback Automation',
      'Teacher Tools',
    ]),
    // One or two sentences shown on the project card and at the top of the page.
    summary: z.string(),
    // The headline result, shown in the "Outcome" callout on the case study page.
    outcomes: z.string(),
    tools: z.array(z.string()).default([]),
    // featured: true puts the project on the home page (keep it to ~3).
    featured: z.boolean().default(false),
    // Lower numbers appear first in the projects gallery.
    order: z.number().default(99),
    // Live demo links, rendered as buttons under the title.
    demos: z
      .array(z.object({ label: z.string(), url: z.string().url() }))
      .default([]),
  }),
});

/**
 * Pages — long-form pages (About, Teaching Philosophy, The Human Classroom,
 * For Colleagues) in src/content/pages/. Edit the .mdx file to update the page.
 */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // Small mono label above the title, e.g. "Design philosophy".
      eyebrow: z.string().optional(),
      // Italic serif line under the title.
      lede: z.string().optional(),
      // 'rail' numbers every h2 in the left margin (used by Teaching Philosophy).
      variant: z.enum(['default', 'rail']).default('default'),
      // Page description for search engines and link previews.
      description: z.string().optional(),
      // Optional portrait shown beside the page header (used by About).
      // Path is relative to the .mdx file, e.g. ../../assets/headshot.jpg
      portrait: image().optional(),
      portraitAlt: z.string().optional(),
    }),
});

export const collections = { projects, pages };
