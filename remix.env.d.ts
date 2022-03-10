/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/cloudflare-workers/globals" />
/// <reference types="@cloudflare/workers-types" />

declare global {
  interface GlobalSecrets {
    SESSION_SECRET: string
    ENVIRONMENT: 'dev' | 'production'
  }

  // secrets
  type GS = typeof globalThis & GlobalSecrets

  // kv namespaces
  // const EXAMPLE: KVNamespace
}

export {}
