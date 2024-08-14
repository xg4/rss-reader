import Link from 'next/link'

export default async function Page() {
  const routes = [
    {
      name: 'BNS',
      url: '/bns',
    },
  ]
  return (
    <main className="prose prose-slate dark:prose-invert">
      <ul>
        {routes.map(i => (
          <li key={i.name}>
            <Link prefetch href={i.url}>
              {i.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
