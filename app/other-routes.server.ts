import type { EntryContext } from 'remix'
import { getSitemapXml } from './utils/sitemap.server'

type Handler = (
  request: Request,
  remixContext: EntryContext,
) => Promise<Response | null> | null

export const pathedRoutes: Record<string, Handler> = {
  '/sitemap.xml': async (request, remixContext) => {
    const sitemap = await getSitemapXml(request, remixContext)
    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  },
}

export const routes: Array<Handler> = [
  ...Object.entries(pathedRoutes).map(([path, handler]) => {
    return (request: Request, remixContext: EntryContext) => {
      if (new URL(request.url).pathname !== path) return null

      return handler(request, remixContext)
    }
  }),
]
