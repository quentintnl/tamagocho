import DashboardContent from '@/components/dashboard/dashboard-content'
import {auth} from '@/lib/auth'
import {headers} from 'next/headers'
import {redirect} from 'next/navigation'

async function DashboardPage(): Promise<React.ReactNode> {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (session === null || session === undefined) {
        redirect('/sign-in')
    }

    return (
        <DashboardContent session={session}/>
    )
}

export default DashboardPage
