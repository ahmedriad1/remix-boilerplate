import { json, useLoaderData } from 'remix'
import type { LoaderFunction, MetaFunction } from 'remix'
import { getSocialMetas } from '~/utils/seo'
import type { Handle } from '~/types'
import Container from '~/components/Container'

export const handle: Handle = {
  id: 'chapter',
  getSitemapEntries: async () => {
    const all = ['1', '2', '3']

    return all.map(item => {
      return { route: `/${item}`, priority: 0.7 }
    })
  },
}

export type LoaderData = {
  id: string
}

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params

  if (!id) throw new Response('Not found', { status: 404 })

  return json<LoaderData>({
    id,
  })
}

export const meta: MetaFunction = ({ data }) => {
  const { id } = data as LoaderData

  return getSocialMetas({ title: id })
}

export default function IdPage() {
  const data = useLoaderData<LoaderData>()

  return (
    <div className='w-full h-full'>
      <Container className='flex justify-center items-center h-full'>
        {data.id}
      </Container>
    </div>
  )
}
