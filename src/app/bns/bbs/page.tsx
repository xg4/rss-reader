import { JSDOM } from 'jsdom'
import { Metadata } from 'next'
import Link from 'next/link'

async function getFeed({ searchParams }: Props) {
  const baseUrl = 'https://bbs.bns.qq.com'
  const currentUrl = new URL('/forum.php?mod=forumdisplay&fid=79', baseUrl)
  Object.entries(searchParams).forEach(([key, value]) => currentUrl.searchParams.set(key, value))
  const response = await fetch(currentUrl, { next: { revalidate: 60 } })
  const date = response.headers.get('date')
  const buf = await response.arrayBuffer()

  const {
    window: { document },
  } = new JSDOM(buf)

  const list = Array.from(document.querySelector('#threadlisttableid')?.querySelectorAll('tbody') || [])

  const items = list.map(i => {
    const [type, title] = Array.from(i.querySelectorAll<HTMLAnchorElement>('.title a'))
    const _url = new URL(title.getAttribute('href') || '/', baseUrl)

    return {
      type: type.textContent?.slice(1, -1),
      guid: _url.searchParams.get('tid'),
      title: title.textContent,
      url: _url.toString(),
    }
  })

  return { title: document.title, items, date }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { title, date } = await getFeed(props)

  return {
    title,
    description: [title, date].join(' - '),
  }
}

type Props = {
  searchParams: { [key: string]: string }
}

export default async function Page(props: Props) {
  const { items } = await getFeed(props)
  return (
    <main>
      <ul>
        {items.map(i => (
          <li key={i.guid}>
            <Link href={`/bns/bbs/${i.guid}`}>{i.title}</Link>
            <span className="text-xs"> ~ {i.type}</span>
          </li>
        ))}
      </ul>
    </main>
  )
}
