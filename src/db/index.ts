import { MongoClient, ServerApiVersion } from 'mongodb'
import mongoose from 'mongoose'

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME as string}:${process.env.MONGODB_PASSWORD as string}@${process.env.MONGODB_HOST as string}/${process.env.MONGODB_DATABASE_NAME as string}${process.env.MONGODB_PARAMS as string}&appName=${process.env.MONGODB_APP_NAME as string}`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

/**
 * Connexion Mongoose avec mise en cache
 *
 * Single Responsibility: Gère une connexion unique et réutilisable à MongoDB via Mongoose
 *
 * Optimisation:
 * - En développement : utilise une variable globale pour persister entre HMR
 * - En production : réutilise la connexion existante
 * - Évite les multiples reconnexions qui ralentissent l'application
 *
 * États de connexion Mongoose :
 * - 0 = disconnected
 * - 1 = connected
 * - 2 = connecting
 * - 3 = disconnecting
 */
let mongoosePromise: Promise<typeof mongoose> | null = null

async function connectMongooseToDatabase (): Promise<void> {
  // Si déjà connecté, ne rien faire
  if (mongoose.connection.readyState === mongoose.ConnectionStates.connected) {
    return
  }

  // Si une connexion est en cours, attendre qu'elle se termine
  if (mongoose.connection.readyState === mongoose.ConnectionStates.connecting) {
    await mongoose.connection.asPromise()
    return
  }

  // Utiliser le cache de connexion
  if (process.env.NODE_ENV === 'development') {
    const globalWithMongoose = global as typeof globalThis & {
      _mongoosePromise?: Promise<typeof mongoose>
    }

    if (globalWithMongoose._mongoosePromise == null) {
      globalWithMongoose._mongoosePromise = mongoose.connect(uri)
    }
    mongoosePromise = globalWithMongoose._mongoosePromise
  } else {
    if (mongoosePromise == null) {
      mongoosePromise = mongoose.connect(uri)
    }
  }

  try {
    await mongoosePromise
    // Log uniquement lors de la première connexion
    console.log('Mongoose connected to MongoDB database')
  } catch (error) {
    console.error('Error connecting to the database:', error)
    mongoosePromise = null
    throw error
  }
}

async function connectToDatabase (): Promise<void> {
  try {
    await client.connect()
    console.log('Connected to MongoDB database')
  } catch (error) {
    console.error('Error connecting to the database:', error)
  }
}

// Promise globale pour réutiliser la connexion
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // En dev, utiliser une variable globale pour préserver la connexion entre HMR
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (globalWithMongo._mongoClientPromise == null) {
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // En production, créer une nouvelle connexion
  clientPromise = client.connect()
}

export { client, connectToDatabase, connectMongooseToDatabase }
export default clientPromise
