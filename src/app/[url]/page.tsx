import { decodeBase64, md5 } from "@/utils/crypto";
import { getFeed } from "@/utils/request";
import dynamic from "next/dynamic";
import Link from "next/link";

export const revalidate = 0;

const Time = dynamic(() => import("../../components/Time"), { ssr: false });

export default async function Page({
  params: { url },
}: {
  params: { url: string };
}) {
  const feed = await getFeed(decodeBase64(url));

  return (
    <div className="prose prose-slate dark:prose-invert mx-auto p-5">
      <h1>{feed.title}</h1>
      <Time className="text-xs" dateTime={feed.lastBuildDate}></Time>
      <ul className="space-y-4 p-0">
        {feed.items.map((item) => (
          <li key={item.link} className="flex flex-col">
            <Link href={`/${url}/${md5(item.link!)}`}>{item.title}</Link>
            <Time className="text-xs" dateTime={item.pubDate!}></Time>
          </li>
        ))}
      </ul>
    </div>
  );
}
