import Link from 'next/link'

export default async function Page() {
  const routes = [
    {
      name: 'BNS',
      url: '/bns',
    },
  ]
  return (
    <main className="prose prose-slate mx-auto dark:prose-invert">
      <ul>
        {routes.map(i => (
          <li key={i.name}>
            <Link href={i.url}>{i.name}</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
