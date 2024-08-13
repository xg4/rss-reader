'use client'

import { tz } from '@/utils/time'
import dayjs from 'dayjs'

export default function Time({ dateTime, className }: { dateTime: dayjs.ConfigType; className?: string }) {
  const date = tz(dateTime)
  return (
    <time className={className} dateTime={date.toISOString()}>
      {date.format('YYYY-MM-DD HH:mm:ss')}
    </time>
  )
}
