import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useFetcher } from 'remix'

enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
}

const themes: Array<Theme> = Object.values(Theme)

type ThemeContextType = [
  Theme | null,
  React.Dispatch<React.SetStateAction<Theme | null>>,
]

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
ThemeContext.displayName = 'ThemeContext'

const prefersLightMQ = '(prefers-color-scheme: light)'
const getPreferredTheme = () =>
  window.matchMedia(prefersLightMQ).matches ? Theme.LIGHT : Theme.DARK

function ThemeProvider({
  children,
  specifiedTheme,
}: {
  children: React.ReactNode
  specifiedTheme: Theme | null
}) {
  const [theme, setTheme] = useState<Theme | null>(() => {
    if (specifiedTheme) {
      if (themes.includes(specifiedTheme)) return specifiedTheme
      else return null
    }

    if (typeof window !== 'object') return null

    return getPreferredTheme()
  })

  const persistTheme = useFetcher()
  // TODO: remove this when persistTheme is memoized properly
  const persistThemeRef = useRef(persistTheme)
  useEffect(() => {
    persistThemeRef.current = persistTheme
  }, [persistTheme])

  const mountRun = useRef(false)

  useEffect(() => {
    if (!mountRun.current) {
      mountRun.current = true
      return
    }
    if (!theme) return

    persistThemeRef.current.submit(
      { theme },
      { action: 'action/set-theme', method: 'post' },
    )
  }, [theme])

  useEffect(() => {
    const mediaQuery = window.matchMedia(prefersLightMQ)
    const handleChange = () => {
      setTheme(mediaQuery.matches ? Theme.LIGHT : Theme.DARK)
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  )
}

const clientThemeCode = `
;(() => {
  const theme = window.matchMedia(${JSON.stringify(prefersLightMQ)}).matches
    ? 'light'
    : 'dark';
  
  const cl = document.documentElement.classList;
  
  const themeAlreadyApplied = cl.contains('light') || cl.contains('dark');
  if (!themeAlreadyApplied) cl.add(theme);
  
  
  const meta = document.querySelector('meta[name=color-scheme]');
  if (meta) {
    if (theme === 'dark')  meta.content = 'dark light';
    else if (theme === 'light') meta.content = 'light dark';
  }
})();
`

function handleDarkAndLightModeEls() {
  const theme = getPreferredTheme()
  const darkEls = document.querySelectorAll('dark-mode')
  const lightEls = document.querySelectorAll('light-mode')
  for (const darkEl of darkEls) {
    if (theme === 'dark') {
      for (const child of darkEl.childNodes) {
        darkEl.parentElement?.append(child as any)
      }
    }
    darkEl.remove()
  }
  for (const lightEl of lightEls) {
    if (theme === 'light') {
      for (const child of lightEl.childNodes) {
        lightEl.parentElement?.append(child as any)
      }
    }
    lightEl.remove()
  }
}

function NonFlashOfWrongThemeEls({ ssrTheme }: { ssrTheme: boolean }) {
  const [theme] = useTheme()
  return (
    <>
      <meta
        name='color-scheme'
        content={theme === 'light' ? 'light dark' : 'dark light'}
      />

      {ssrTheme ? null : (
        <script dangerouslySetInnerHTML={{ __html: clientThemeCode }} />
      )}
    </>
  )
}

function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}

function Themed({
  dark,
  light,
  initialOnly = false,
}: {
  dark: React.ReactNode | string
  light: React.ReactNode | string
  initialOnly?: boolean
}) {
  const [theme] = useTheme()
  const [initialTheme] = useState(theme)
  const themeToReference = initialOnly ? initialTheme : theme
  const serverRenderWithUnknownTheme = !theme && typeof window !== 'object'
  if (serverRenderWithUnknownTheme) {
    // stick them both in and our little script will update the DOM to match
    // what we'll render in the client during hydration.
    return (
      <>
        {createElement('dark-mode', null, dark)}
        {createElement('light-mode', null, light)}
      </>
    )
  } else {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{themeToReference === 'light' ? light : dark}</>
  }
}

function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && themes.includes(value as Theme)
}

export {
  handleDarkAndLightModeEls,
  ThemeProvider,
  useTheme,
  themes,
  Theme,
  isTheme,
  Themed,
  NonFlashOfWrongThemeEls,
}
