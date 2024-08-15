import { fromNow, tz } from '@/utils/time'
import { JSDOM } from 'jsdom'
import { head } from 'lodash-es'
import { Metadata } from 'next'

async function getPost(id: string) {
  const baseUrl = 'https://bbs.bns.qq.com'

  const currentUrl = new URL('/forum.php?mod=viewthread&tid=146010&extra=page%3D1#nv_diy', baseUrl)
  currentUrl.searchParams.set('tid', id)
  const response = await fetch(currentUrl, { next: { revalidate: 60 } })
  const date = response.headers.get('date')
  const buf = await response.arrayBuffer()

  const {
    window: { document },
  } = new JSDOM(buf)

  const list = Array.from(document.querySelector('#postlist')?.querySelectorAll('.item') || [])

  const items = list.map(i => {
    const id = i.parentElement?.getAttribute('id')
    const avatar = i.querySelector('.author_info .avatar img')
    const username = i.querySelector('.author_info > a')

    const content = i.querySelector('.cont_info')
    const createdAt = content?.querySelector('.created_date span')?.getAttribute('title')

    content?.querySelectorAll('.cont_text table td img').forEach(i => {
      i.getAttribute('zoomfile')
      i.getAttribute('file')
      const attrs = ['file', 'zoomfile'].map(k => i.getAttribute(k)).filter(Boolean)
      if (attrs.length) {
        i.setAttribute('src', head(attrs)!)
        return
      }
      const url = i.getAttribute('src')
      if (url && !/^(https?:\/\/|\/\/)/.test(url)) {
        i.setAttribute('src', new URL(url, baseUrl).toString())
      }
    })
    const text = content?.querySelector('.cont_text table td')?.innerHTML

    return {
      id,
      avatar: avatar?.getAttribute('src'),
      username: username?.textContent,
      createdAt: tz(createdAt),
      content: text || '',
    }
  })
  return { title: document.title, items }
}

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params: { id } }: Props): Promise<Metadata> {
  const { title } = await getPost(id)

  return {
    title,
  }
}

export default async function Page({ params: { id } }: Props) {
  const { items } = await getPost(id)
  return (
    <main>
      <ul className="m-0 space-y-4 p-0">
        {items.map((i, index) => (
          <li key={i.id} className="flex space-x-4 border-b-2 pb-4">
            <figure className="m-0 flex max-w-10 flex-col items-center space-y-2">
              <span className="text-xs">#{index + 1}</span>
              {i.avatar ? <img className="m-0 h-10 w-10 object-contain" src={i.avatar} alt="" /> : null}
              <figcaption className="flex-1 overflow-hidden">
                <span className="line-clamp-1 text-xs">{i.username}</span>
              </figcaption>
            </figure>
            <div className="flex flex-1 flex-col justify-between space-y-4">
              <div className="outside" dangerouslySetInnerHTML={{ __html: i.content }}></div>
              <time className="text-xs" dateTime={i.createdAt.toISOString()}>
                {fromNow(i.createdAt)}
              </time>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
