import {defineCollection, z} from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    lang: z.enum(['fr', 'en']),
    baseSlug: z.string(),
    title: z.string(),
    shortDesc: z.array(z.string()),
    tech: z.array(z.string()),
    category: z.enum(['personal', 'professional']).default('personal'),
    featured: z.boolean().default(false),
    order: z.number().default(999),
    company: z.string().optional(), // Pour les projets professionnels
    links: z.object({
      github: z.string().url().optional(),
      demo: z.string().url().optional(),
      npm: z.string().url().optional(),
    }).strict().optional(),
  }),
});

const experiencesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    lang: z.enum(['fr', 'en']),
    baseSlug: z.string(),
    company: z.string(),
    role: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    location: z.string(),
    description: z.string(),
    achievements: z.array(z.string()),
    skills: z.array(z.string()),
    order: z.number(),
    relatedProjects: z.array(z.string()).optional(), // slugs des projets associés
  }).strict(),
});

const educationCollection = defineCollection({
  type: 'content',
  schema: z.object({
    lang: z.enum(['fr', 'en']),
    baseSlug: z.string(),
    school: z.string(),
    degree: z.string(),
    field: z.string().optional(),
    startDate: z.string(),
    endDate: z.string().optional(),
    location: z.string(),
    highlights: z.array(z.string()).optional(),
    order: z.number(),
  }).strict(),
});

export const collections = {
  projects: projectsCollection,
  experiences: experiencesCollection,
  education: educationCollection,
};
