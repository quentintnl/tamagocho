import {DBMonster} from "@/types/monster";

function MonstersList({monsters}: { monsters: DBMonster[] }): React.ReactNode {
    if (monsters === null || monsters === undefined || monsters.length === 0) {
        return <p>No monsters found.</p>
    }

    return (
        <div>
            <h2>Your Monsters</h2>
            <ul>
                {monsters.map((monster) => (
                    <li key={monster._id}>{monster.name}</li>
                ))}
            </ul>
        </div>
    )
}

export default MonstersList
