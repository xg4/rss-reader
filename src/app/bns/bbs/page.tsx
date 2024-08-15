import { JSDOM } from 'jsdom'
import { Metadata } from 'next'
import Link from 'next/link'

async function getFeed(page = 1) {
  const baseUrl = 'https://bbs.bns.qq.com'
  const currentUrl = new URL('/forum.php?mod=forumdisplay&fid=79', baseUrl)
  currentUrl.searchParams.set('page', page + '')
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

  return { title: document.title, items }
}

export async function generateMetadata(): Promise<Metadata> {
  const { title } = await getFeed()

  return {
    title,
  }
}

export default async function Page() {
  const [post, post2] = await Promise.all([getFeed(1), getFeed(2)])
  return (
    <main>
      <ul>
        {[...post.items, ...post2.items].map(i => (
          <li key={i.guid}>
            <Link href={`/bns/bbs/${i.guid}`}>{i.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
