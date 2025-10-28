import { mongoose } from 'mongoose'
import dotenv from 'dotenv'
dotenv.config({ path: '../.env.local' })

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE_NAME}${process.env.MONGODB_PARAMS}&appName=${process.env.MONGODB_APP_NAME}`

const MONSTER_STATES = ['sad', 'angry', 'hungry', 'sleepy']

async function connectToDatabase () {
  try {
    console.log(uri)
    await mongoose.connect(uri)
    console.log('Mongoose connected to MongoDB database')
  } catch (error) {
    console.error('Error connecting to the database:', error)
  }
}

async function updateMonstersStates () {
  try {
    // Ne mettre à jour que les monstres qui sont "happy"
    const monsters = await mongoose.connection.db.collection('monsters').find({ state: 'happy' }).toArray()
    for (const monster of monsters) {
      // Choisir un état mauvais aléatoire uniquement pour les monstres happy
      const newState = MONSTER_STATES[Math.floor(Math.random() * MONSTER_STATES.length)]
      await mongoose.connection.db.collection('monsters').updateOne(
        { _id: monster._id },
        { $set: { state: newState } }
      )

      console.log(`Updated monster ${monster._id} state from happy to ${newState}`)
    }
  } catch (error) {
    console.error('Error updating monsters states:', error)
  }
}

export {
  connectToDatabase,
  updateMonstersStates
}
