import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const skills = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/skills' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    download: z.string().optional(),
  }),
});

const vibe = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/vibe' }),
  schema: z.object({
    title: z.string(),
    day: z.number(),
    date: z.coerce.date(),
    cover: z.string(),
    liveUrl: z.string().optional(),
    repoUrl: z.string().optional(),
    tools: z.array(z.string()).default([]),
    oneLiner: z.string(),
  }),
});

export const collections = { skills, vibe };
