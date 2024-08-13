export interface Feed {
  title: string
  lastBuildDate: Date
  items: Item[]
}

export interface Post {
  title: string
  lastBuildDate: Date
  urls: string[]
}

export interface Item {
  title: string
  url: string
  date: Date
  htmlContent?: string | null
  textContent?: string | null
  image?: string | null
}
