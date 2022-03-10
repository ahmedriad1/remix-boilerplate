import {
  Link,
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
} from 'remix'
import errorStack from 'error-stack-parser'
import { Theme } from '~/utils/theme-provider'
import { useState } from 'react'
import clsx from 'clsx'
import { getSecret } from '~/utils/misc'

interface RedBoxProps {
  error: Error
}

export const RedBox = ({ error }: RedBoxProps) => {
  const [isVisible, setIsVisible] = useState(true)
  const frames = errorStack.parse(error)

  return (
    <div
      className={clsx(
        'fixed z-[99999999] inset-0 flex items-center justify-center transition',
        !isVisible && 'opacity-0 pointer-events-none',
      )}
    >
      <button
        className='absolute inset-0 block w-full h-full bg-black opacity-75'
        onClick={() => setIsVisible(false)}
      />
      <div className='border-lg text-primary relative mx-5vw my-16 p-12 max-h-[75vh] bg-red-500 rounded-lg overflow-y-auto'>
        <h2 className='text-4xl font-bold'>{error.message}</h2>
        <div>
          {frames.map(frame => (
            <div
              key={[frame.fileName, frame.lineNumber, frame.columnNumber].join(
                '-',
              )}
              className='pt-4'
            >
              <div className='pt-2 text-xl'>{frame.functionName}</div>
              <div className='font-mono opacity-75'>
                {frame.fileName}:{frame.lineNumber}:{frame.columnNumber}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface ErrorLayoutProps {
  children: React.ReactNode
}

const ErrorLayout = ({ children }: ErrorLayoutProps) => {
  return (
    <html lang='en' className={Theme.DARK}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body className='w-full min-h-screen bg-white dark:bg-black text-inverse font-montserrat'>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

interface ErrorPageProps {
  message: string
  error?: Error
}

export function ErrorPage({ message, error }: ErrorPageProps) {
  const dev =
    'process' in global
      ? process.env.NODE_ENV === 'development'
      : 'ENVIRONMENT' in global
      ? getSecret('ENVIRONMENT') === 'dev'
      : true

  return (
    <ErrorLayout>
      {error && dev ? <RedBox error={error} /> : null}
      <div className='w-full h-screen flex justify-center items-center text-center'>
        <div>
          <h1 className='text-4xl font-bold'>{message}</h1>
          <Link
            to='/'
            className='mt-10 px-8 py-3 text-xl bg-inverse rounded-full text-black font-medium inline-block'
          >
            Go home
          </Link>
        </div>
      </div>
    </ErrorLayout>
  )
}
