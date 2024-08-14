'use client'

import { Item } from '@/types'
import { fromNow, tz } from '@/utils/time'
import { AnimatePresence, motion } from 'framer-motion'
import { groupBy } from 'lodash-es'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useScrollLock } from 'usehooks-ts'

export default function List({ list, selectedId }: { list: Item[]; selectedId?: string }) {
  const current = list.find(i => i.guid === selectedId)
  const grouped = groupBy(list, item => tz(item.date).format('MM-DD'))
  useScrollLock({
    autoLock: !!current,
  })
  const pathname = usePathname()

  return (
    <>
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
                      scroll={false}
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
                  <time className="text-xs" dateTime={item.date.toUTCString()}>
                    {fromNow(item.date)}
                  </time>
                  <motion.div className="line-clamp-3 text-sm">{item.textContent}</motion.div>
                </motion.div>
              </motion.div>
            ))}
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {current && (
          <motion.article
            className="prose prose-slate fixed inset-0 mx-auto overflow-scroll bg-white p-5 dark:prose-invert dark:bg-slate-900"
            layoutId={current.url}
          >
            <motion.h2>{current.title}</motion.h2>
            {current.htmlContent ? (
              <motion.section
                dangerouslySetInnerHTML={{
                  __html: current.htmlContent,
                }}
              ></motion.section>
            ) : null}
          </motion.article>
        )}
      </AnimatePresence>
    </>
  )
}
