import { SunIcon, MoonIcon } from '@heroicons/react/outline'
import { Link } from 'remix'
import { Theme, useTheme } from '~/utils/theme-provider'
import Container from './Container'

const Nav = () => {
  const [theme, setTheme] = useTheme()

  return (
    <nav className='w-full h-24'>
      <Container className='w-full h-full flex justify-between items-center'>
        <Link to='/'>
          <h1 className='text-4xl font-bold'>AR1</h1>
        </Link>
        <div className='flex items-center space-x-5'>
        
          <button
            onClick={() =>
              setTheme(theme === Theme.DARK ? Theme.LIGHT : Theme.DARK)
            }
            name='theme'
          >
            {theme === Theme.DARK ? (
              <SunIcon className='w-6 h-6' />
            ) : (
              <MoonIcon className='w-6 h-6' />
            )}
          </button>
        </div>
      </Container>
    </nav>
  )
}

export default Nav
