import { getMonsterById } from '@/actions/monsters.actions'
import ErrorClient from '@/components/error-client'

async function CreaturePage ({ params }: { params: { id: string } }): Promise<React.ReactNode> {
  const { id } = await params
  const monster = await getMonsterById(id)

  if (monster === null || monster === undefined) {
    return <ErrorClient error='Creature not found.' redirectTo='dashboard' />
  }

  return (
    <div>
      <h1>Creature Page</h1>
      <p>Creature ID: {id}</p>
    </div>
  )
}

export default CreaturePage
