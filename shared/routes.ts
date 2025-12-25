import { z } from 'zod';

// ============================================
// API CONTRACT
// Since this is a Frontend-Only app, we don't have many real backend routes.
// However, we define the structure here for consistency if we were to expand.
// ============================================

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  // These are placeholders as the actual data fetching happens 
  // directly from the frontend to GitHub API
  github: {
    search: {
      method: 'GET' as const,
      path: '/api/github/search', 
      responses: {
        200: z.object({ items: z.array(z.any()) }), 
      },
    },
  },
};

// Helper for URL building (standard requirement)
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
