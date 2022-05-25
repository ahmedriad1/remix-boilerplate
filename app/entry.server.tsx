import { renderToString } from 'react-dom/server'
import { RemixServer } from 'remix'
import type { EntryContext } from 'remix'
import { routes as otherRoutes } from './other-routes.server'

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  for (const handler of otherRoutes) {
    // eslint-disable-next-line no-await-in-loop
    const otherRouteResponse = await handler(request, remixContext)
    if (otherRouteResponse) return otherRouteResponse
  }

  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />,
  )
  const html = `<!DOCTYPE html>${markup}`

  responseHeaders.set('Content-Type', 'text/html')

  return new Response(html, {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}
