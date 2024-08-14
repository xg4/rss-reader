import MD5 from 'crypto-js/md5'

export function md5(message: string) {
  return MD5(message).toString()
}
