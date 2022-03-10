import { createCookieSessionStorage } from 'remix'
import { getSecret } from '~/utils/misc'
import { Theme, isTheme } from '~/utils/theme-provider'

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: 'theme',
    secure: true,
    sameSite: 'lax',
    secrets: [getSecret('SESSION_SECRET')],
    path: '/',
    expires: new Date('2030-01-01'), // expires in 2030
    httpOnly: true,
  },
})

export const getThemeSession = async (request: Request) => {
  const session = await themeStorage.getSession(request.headers.get('Cookie'))

  return {
    getTheme: () => {
      const themeValue = session.get('theme')
      return isTheme(themeValue) ? themeValue : Theme.DARK
    },
    setTheme: (theme: Theme) => session.set('theme', theme),
    commit: () => themeStorage.commitSession(session),
  }
}
