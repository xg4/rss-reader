import Link from 'next/link'

export default async function Page() {
  const routes = [
    {
      name: 'BNS',
      url: '/bns',
    },
  ]
  return (
    <main>
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
