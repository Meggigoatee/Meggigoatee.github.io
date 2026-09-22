import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    projects: defineCollection({
      type: 'page',
      source: 'projects/*.md',
      schema: z.object({
        title: z.string(),
        slug: z.string(),
        order: z.number().int(),
        category: z.string(),
        status: z.string(),
        featured: z.boolean(),
        summary: z.string(),
        period: z.string().nullable(),
        role: z.string().nullable(),
        team: z.string().nullable(),
        techStack: z.array(z.string()),
        links: z.array(z.object({
          label: z.string(),
          url: z.string(),
          description: z.string().optional()
        })).optional(),
        cover: z.string().nullable(),
        gallery: z.array(z.string()),
        video: z.string().nullable(),
        diagram: z.object({
          kind: z.string(),
          title: z.string(),
          description: z.string(),
          ariaLabel: z.string(),
          steps: z.array(z.object({
            id: z.string(),
            label: z.string(),
            detail: z.string()
          })).optional(),
          nodes: z.array(z.object({
            id: z.string(),
            label: z.string(),
            detail: z.string()
          })).optional(),
          edges: z.array(z.object({
            from: z.string(),
            to: z.string(),
            label: z.string()
          })).optional()
        }).optional(),
        useCaseDiagram: z.object({
          kind: z.literal('use-case'),
          title: z.string(),
          description: z.string(),
          ariaLabel: z.string(),
          systemLabel: z.string(),
          actors: z.array(z.object({
            id: z.string(),
            label: z.string(),
            detail: z.string(),
            side: z.enum(['left', 'right'])
          })),
          useCases: z.array(z.object({
            id: z.string(),
            label: z.string(),
            detail: z.string()
          })),
          relations: z.array(z.object({
            from: z.string(),
            to: z.string()
          }))
        }).optional()
      })
    })
  }
})
