function MonstersList ({ monsters }: { monsters: Monster[] }): React.ReactNode {
  if (monsters === null || monsters === undefined || monsters.length === 0) {
    return <p>No monsters found.</p>
  }

  return (
    <div>
      <h2>Your Monsters</h2>
      <ul>
        {monsters.map((monster) => (
          <li key={monster.id}>{monster.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default MonstersList
