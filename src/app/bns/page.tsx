import List from '@/components/List'
import Time from '@/components/Time'
import { Feed, Item, Post } from '@/types'
import { tz } from '@/utils/time'
import dayjs from 'dayjs'
import { JSDOM } from 'jsdom'
import { orderBy } from 'lodash-es'

export const revalidate = 0

async function getPosts(url: string, baseUrl: string): Promise<Post[]> {
  const currentUrl = new URL(url, baseUrl).toString()

  const response = await fetch(currentUrl)
  const date = response.headers.get('date')
  const buf = await response.arrayBuffer()

  const {
    window: { document },
  } = new JSDOM(buf)

  const urls = Array.from(document.querySelectorAll<HTMLAnchorElement>('.pg1_box2 ul li a')).map(item =>
    new URL(item.getAttribute('href') || '/', baseUrl).toString(),
  )

  const cur = [{ title: document.title, lastBuildDate: date ? dayjs(date).toDate() : new Date(), urls }]
  const nextPage = document.querySelector('.pg1_btnbox2 a:nth-child(3)')?.getAttribute('href')
  if (nextPage) {
    const prev = await getPosts(nextPage, baseUrl)
    return [...cur, ...prev]
  }

  return cur
}

async function getPost(url: string): Promise<Item> {
  const detailResponse = await fetch(url)
  const buf = await detailResponse.arrayBuffer()

  const {
    window: { document },
  } = new JSDOM(buf)

  const contentEl = document.querySelector('#news_list')

  const time = contentEl?.querySelector('.pg2_txt2')?.textContent
  const date = time ? tz(time).toDate() : new Date()

  return {
    url,
    title: contentEl?.querySelector('.pg2_txt1')?.textContent || '',
    date,
    htmlContent: contentEl?.innerHTML,
    textContent: contentEl?.querySelector('.pg2_box1ct1:nth-child(2)')?.textContent,
    image: contentEl?.querySelector('img')?.getAttribute('src'),
  }
}

async function getFeed(): Promise<Feed> {
  const baseUrl = 'https://bns.qq.com'

  const posts = await getPosts('/webplat/info/news_version3/1298/61649/m22759/list_1.shtml', baseUrl)

  const items = await Promise.all(posts.flatMap(i => i.urls).map(getPost))

  return {
    title: posts[0].title,
    lastBuildDate: posts[0].lastBuildDate,
    items: orderBy(items, ['date'], ['desc']),
  }
}

export default async function Page() {
  const feed = await getFeed()

  return (
    <div className="prose prose-slate mx-auto break-all p-5 dark:prose-invert">
      <h1>{feed.title}</h1>
      <Time className="text-xs" dateTime={feed.lastBuildDate}></Time>
      <List list={feed.items} />
    </div>
  )
}
