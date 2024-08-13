import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.locale('zh-cn')
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)

export function tz(time: dayjs.ConfigType, tz = 'Asia/Shanghai') {
  return dayjs.tz(time, tz)
}

export function fromNow(time: dayjs.ConfigType) {
  return dayjs(time).fromNow()
}
