import { useLayoutEffect } from 'react'

export const isBrowser = () => typeof window !== 'undefined'

export const useSSRLayoutEffect = isBrowser() ? useLayoutEffect : () => {}

export const typedBoolean = <T>(
  value: T,
): value is Exclude<T, '' | 0 | false | null | undefined> => Boolean(value)

export const getDomainUrl = (request: Request) => {
  const host =
    request.headers.get('X-Forwarded-Host') ?? request.headers.get('host')

  if (!host) throw new Error('Could not determine domain URL.')

  const protocol = host.includes('localhost') ? 'http' : 'https'
  return `${protocol}://${host}`
}

export const removeTrailingSlash = (s: string) =>
  s.endsWith('/') ? s.slice(0, -1) : s

export const getSecret = (secret: keyof GlobalSecrets) => {
  return (globalThis as GS)[secret]
}
