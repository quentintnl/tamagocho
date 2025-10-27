import {DBMonster} from "@/types/monster";
import Link from "next/link";

function MonstersList({monsters}: { monsters: DBMonster[] }): React.ReactNode {
    if (monsters === null || monsters === undefined || monsters.length === 0) {
        return <p>No monsters found.</p>
    }

    return (
        <div>
            <h2>Your Monsters</h2>
            <ul>
                {monsters.map((monster) => (
                    <><Link key={monster._id} href={`/creature/${monster._id}`}>
                        <li key={monster._id}>{monster.name}</li>
                    </Link>
                    </>
                ))}
            </ul>
        </div>
    )
}

export default MonstersList
