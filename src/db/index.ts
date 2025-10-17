import {MongoClient, ServerApiVersion} from 'mongodb'
import mongoose from "mongoose";

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


async function connectMongooseToDatabase(): Promise<void> {
    try {
        await mongoose.connect(uri)
        console.log('Mongoose connected to MongoDB database')
    } catch (error) {
        console.error('Error connecting to the database:', error)
    }
}

async function connectToDatabase(): Promise<void> {
    try {
        await client.connect()
        console.log('Connected to MongoDB database')
    } catch (error) {
        console.error('Error connecting to the database:', error)
    }
}

export {client, connectToDatabase, connectMongooseToDatabase}
