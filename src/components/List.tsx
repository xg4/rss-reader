'use client'

import { Item } from '@/types'
import { fromNow, tz } from '@/utils/time'
import { AnimatePresence, motion } from 'framer-motion'
import { groupBy } from 'lodash-es'
import { useState } from 'react'
import { useScrollLock } from 'usehooks-ts'

export default function List({ list }: { list: Item[] }) {
  const [selectedId, setSelectedId] = useState<Item | null>(null)
  const grouped = groupBy(list, item => tz(item.date).format('MM-DD'))
  useScrollLock({
    autoLock: !!selectedId,
  })
  return (
    <>
      <ul className="space-y-6 p-0">
        {Object.entries(grouped).map(([key, items]) => (
          <li key={key} className="space-y-2">
            <strong>{key}</strong>
            {items.map(item => (
              <motion.div
                key={item.url}
                className="flex items-center space-x-4"
                layoutId={item.url}
                onClick={() => setSelectedId(item)}
              >
                {item.image ? <img className="h-24 w-24 object-cover" src={item.image} alt="" /> : null}
                <motion.div className="flex flex-1 flex-col space-y-2 overflow-hidden">
                  <motion.h2 className="my-0 line-clamp-1 text-base">{item.title}</motion.h2>
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
        {selectedId && (
          <motion.article
            className="prose prose-slate fixed inset-0 mx-auto overflow-scroll bg-white p-5 dark:prose-invert dark:bg-slate-900"
            layoutId={selectedId.url}
          >
            <motion.h2>{selectedId.title}</motion.h2>
            {selectedId.htmlContent ? (
              <motion.section
                dangerouslySetInnerHTML={{
                  __html: selectedId.htmlContent,
                }}
              ></motion.section>
            ) : null}
            <motion.button
              className="fixed right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-black/30 text-gray-700 dark:bg-white/30 dark:text-gray-300"
              onClick={() => setSelectedId(null)}
            >
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path
                  d="M15 5L5 15M5 5l5.03 5.03L15 15"
                  fill="transparent"
                  strokeWidth="2"
                  stroke="currentColor"
                  strokeLinecap="round"
                ></path>
              </svg>
            </motion.button>
          </motion.article>
        )}
      </AnimatePresence>
    </>
  )
}
