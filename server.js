import {
  createRequestHandler,
  handleAsset,
} from '@remix-run/cloudflare-workers'
import * as build from '@remix-run/dev/server-build'

const handleRequest = createRequestHandler({
  build,
  // eslint-disable-next-line
  mode: process.env.NODE_ENV,
})

const handler = async event => {
  const asset = await handleAsset(event, build)
  if (asset) return asset

  return handleRequest(event)
}

addEventListener('fetch', event => {
  event.respondWith(handler(event))
})
