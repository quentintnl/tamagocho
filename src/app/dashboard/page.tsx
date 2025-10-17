import { getMonsters } from '@/actions/monsters.actions'
import DashboardContent from '@/components/dashboard/dashboard-content'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

async function DashboardPage (): Promise<React.ReactNode> {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  const monsters = await getMonsters()

  if (session === null || session === undefined) {
    redirect('/sign-in')
  }

  return (
    <DashboardContent session={session} monsters={monsters} />
  )
}

export default DashboardPage
