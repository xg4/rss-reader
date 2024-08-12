import { decodeBase64, md5 } from "@/utils/crypto";
import { getFeed } from "@/utils/request";

export interface Feed {
  items: Item[];
  feedUrl: string;
  title: string;
  description: string;
  webMaster: string;
  generator: string;
  link: string;
  language: string;
  lastBuildDate: string;
  ttl: string;
}

export interface Item {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  contentSnippet: string;
  guid: string;
  isoDate: Date;
}

export default async function Page({
  params: { id, url },
}: {
  params: { id: string; url: string };
}) {
  const feed = await getFeed(decodeBase64(url));

  const current = feed.items.find((item) => md5(item.link!) === id);

  if (!current) {
    return null;
  }

  return (
    <article className="prose prose-slate dark:prose-invert mx-auto p-5">
      <h1>{current.title}</h1>
      <section dangerouslySetInnerHTML={{ __html: current.content! }}></section>
    </article>
  );
}
