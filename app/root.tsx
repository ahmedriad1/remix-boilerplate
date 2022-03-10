import {
  json,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from 'remix'
import type { MetaFunction, LinksFunction, LoaderFunction } from 'remix'
import Nav from './components/Nav'
import { getThemeSession } from './cookies/theme.server'
import {
  Theme,
  ThemeProvider,
  useTheme,
  NonFlashOfWrongThemeEls,
} from './utils/theme-provider'
import clsx from 'clsx'
import { ErrorPage } from './components/Error'
import { getSocialMetas } from './utils/seo'

import tailwindStyles from './styles/tailwind.css'
import fontStyles from './styles/fonts.css'
import globalStyles from './styles/global.css'
import { Handle } from './types'

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: globalStyles,
    },
    {
      rel: 'stylesheet',
      href: fontStyles,
    },
    {
      rel: 'stylesheet',
      href: tailwindStyles,
    },
    // {
    //   rel: 'apple-touch-icon',
    //   sizes: '180x180',
    //   href: '/icons/apple-touch-icon.png',
    // },
    // {
    //   rel: 'icon',
    //   type: 'image/png',
    //   sizes: '32x32',
    //   href: '/icons/favicon-32x32.png',
    // },
    // {
    //   rel: 'icon',
    //   type: 'image/png',
    //   sizes: '16x16',
    //   href: '/icons/favicon-16x16.png',
    // },
    { rel: 'manifest', href: '/site.webmanifest' },
  ]
}

export const meta: MetaFunction = () => {
  return {
    viewport: 'width=device-width,initial-scale=1,viewport-fit=cover',
    'theme-color': '#000000',
    ...getSocialMetas(),
  }
}

export const handle: Handle = {
  id: 'root',
}

type LoaderData = {
  theme: Theme | null
}

export const loader: LoaderFunction = async ({ request }) => {
  const themeSession = await getThemeSession(request)

  return json<LoaderData>({
    theme: themeSession.getTheme(),
  })
}

function App() {
  const data = useLoaderData<LoaderData>()
  const [theme] = useTheme()

  return (
    <html lang='en' className={clsx(theme)}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <NonFlashOfWrongThemeEls ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body className='w-full min-h-screen bg-white dark:bg-black text-inverse font-montserrat'>
        <Nav />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export default function AppWithProviders() {
  const data = useLoaderData<LoaderData>()

  return (
    <ThemeProvider specifiedTheme={data.theme}>
        <App />
    </ThemeProvider>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ErrorPage message='An unexpected error occured, sorry.' error={error} />
  )
}

export function CatchBoundary() {
  const error = useCatch()

  return <ErrorPage message={`${error.status}, ${error.data}`} />
}
