'use client'

import { Feed } from '@/types'
import { fromNow, tz } from '@/utils/time'
import { AnimatePresence, motion } from 'framer-motion'
import { groupBy } from 'lodash-es'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Time from './Time'

export default function List({ feed, selectedId }: { feed: Feed; selectedId?: string }) {
  const current = feed.items.find(i => i.guid === selectedId)
  const grouped = groupBy(feed.items, item => tz(item.date).format('MM-DD'))
  const pathname = usePathname()

  return (
    <>
      {!current ? (
        <>
          <h1>{feed.title}</h1>
          <Time className="text-xs" dateTime={feed.lastBuildDate}></Time>
          <ul className="space-y-6 p-0">
            {Object.entries(grouped).map(([key, items]) => (
              <li key={key} className="space-y-2">
                <strong>{key}</strong>
                {items.map(item => (
                  <motion.div layoutId={item.url} key={item.url} className="flex items-center space-x-4">
                    {item.image ? <img className="h-24 w-24 object-cover" src={item.image} alt="" /> : null}
                    <motion.div className="flex flex-1 flex-col space-y-2 overflow-hidden">
                      <motion.h2 className="my-0 line-clamp-1 text-base">
                        <Link
                          prefetch
                          href={{
                            pathname,
                            query: {
                              q: item.guid,
                            },
                          }}
                        >
                          {item.title}
                        </Link>
                      </motion.h2>
                      <motion.time className="text-xs" dateTime={item.date.toUTCString()}>
                        {fromNow(item.date)}
                      </motion.time>
                      <motion.div className="line-clamp-3 text-sm">{item.textContent}</motion.div>
                    </motion.div>
                  </motion.div>
                ))}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <AnimatePresence>
          <motion.article
            layoutId={current.url}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <motion.h1>{current.title}</motion.h1>
            {current.htmlContent ? (
              <motion.section
                dangerouslySetInnerHTML={{
                  __html: current.htmlContent,
                }}
              ></motion.section>
            ) : null}
          </motion.article>
        </AnimatePresence>
      )}
    </>
  )
}
