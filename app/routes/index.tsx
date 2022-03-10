import Container from '~/components/Container'

import { HeartIcon } from '@heroicons/react/outline'
import { Handle } from 'types'

export const handle: Handle = {
  id: 'chapters',
  getSitemapEntries: () => [{ route: `/`, priority: 0.7 }],
}

export default function Index() {
  return (
    <Container className='flex justify-center items-center flex-col'>
      <div className='w-full py-14'>
        <h1 className='text-4xl font-bold'>Hello world</h1>
      </div>
      <div className='w-full py-10 flex items-center justify-center'>
        Made with <HeartIcon className='w-6 h-6 mx-2 text-indigo-600' /> by{' '}
        <a
          href='https://ar1.dev'
          target='_blank'
          rel='noreferrer'
          className='ml-2 text-indigo-600 hover:text-indigo-700 font-semibold'
        >
          Ahmed Riad
        </a>
      </div>
    </Container>
  )
}
