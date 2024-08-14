import List from '@/components/List'
import { Feed, Item } from '@/types'
import { md5 } from '@/utils/crypto'
import { tz } from '@/utils/time'
import dayjs from 'dayjs'
import { JSDOM } from 'jsdom'
import { orderBy } from 'lodash-es'
import type { Metadata } from 'next'

export const revalidate = 60

async function getPost(url: string): Promise<Item> {
  const detailResponse = await fetch(url, { next: { revalidate: 60 * 60 } })
  const buf = await detailResponse.arrayBuffer()

  const {
    window: { document },
  } = new JSDOM(buf)

  const contentEl = document.querySelector('#news_list')

  const time = contentEl?.querySelector('.pg2_txt2')?.textContent
  const date = time ? tz(time).toDate() : new Date()

  return {
    url,
    guid: md5(url),
    title: contentEl?.querySelector('.pg2_txt1')?.textContent || '',
    date,
    htmlContent: contentEl?.innerHTML,
    textContent: contentEl?.querySelector('.pg2_box1ct1:nth-child(2)')?.textContent,
    image: contentEl?.querySelector('img')?.getAttribute('src'),
  }
}

async function getFeed(): Promise<Feed> {
  const baseUrl = 'https://bns.qq.com'

  const currentUrl = new URL('/webplat/info/news_version3/1298/61649/m22759/list_1.shtml', baseUrl).toString()

  const response = await fetch(currentUrl, { next: { revalidate: 60 } })
  const date = response.headers.get('date')
  const buf = await response.arrayBuffer()

  const {
    window: { document },
  } = new JSDOM(buf)

  const urls = Array.from(document.querySelectorAll<HTMLAnchorElement>('.pg1_box2 ul li a')).map(item =>
    new URL(item.getAttribute('href') || '/', baseUrl).toString(),
  )

  const items = await Promise.all(urls.map(getPost))

  return {
    title: document.title,
    lastBuildDate: date ? dayjs(date).toDate() : new Date(),
    items: orderBy(items, ['date'], ['desc']),
  }
}

type Props = {
  searchParams: { q?: string }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const q = searchParams.q

  const feed = await getFeed()

  const current = feed.items.find(i => i.guid === q)

  return {
    title: current ? current.title : feed.title,
  }
}

export default async function Page({ searchParams }: Props) {
  const feed = await getFeed()

  return (
    <main className="prose prose-slate mx-auto break-all p-5 dark:prose-invert">
      <List feed={feed} selectedId={searchParams.q} />
    </main>
  )
}
