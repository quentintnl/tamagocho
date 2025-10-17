import { MongoClient, ServerApiVersion } from 'mongodb'

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME as string}:${process.env.MONGODB_PASSWORD as string}
@${process.env.MONGODB_HOST as string}/${process.env.MONGODB_PARAMS}&appName=${process.env.MONGODB_APP_NAME as string}`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

async function connectToDatabase (): Promise<void> {
  try {
    await client.connect()
  } catch (e) {
    console.error('Failed to connect to the database', e)
  }
}

export { client, connectToDatabase }
