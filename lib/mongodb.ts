import { MongoClient, type Db, type Collection } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local as MONGODB_URI")
}

const uri = process.env.MONGODB_URI
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise

// Database helper functions
export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  try {
    const client = await clientPromise
    const db = client.db("drivelearn")
    return { client, db }
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error)
    throw new Error("Database connection failed")
  }
}

// Collection helpers
export async function getCollection(collectionName: string): Promise<Collection> {
  const { db } = await connectToDatabase()
  return db.collection(collectionName)
}

// Generic CRUD operations
export class DatabaseService {
  static async create(collectionName: string, data: any) {
    try {
      const collection = await getCollection(collectionName)
      const result = await collection.insertOne({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      return { success: true, insertedId: result.insertedId }
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error)
      return { success: false, error: error.message }
    }
  }

  static async findById(collectionName: string, id: string) {
    try {
      const collection = await getCollection(collectionName)
      const { ObjectId } = await import("mongodb")
      const document = await collection.findOne({ _id: new ObjectId(id) })
      return { success: true, data: document }
    } catch (error) {
      console.error(`Error finding document in ${collectionName}:`, error)
      return { success: false, error: error.message }
    }
  }

  static async findMany(collectionName: string, query = {}, options = {}) {
    try {
      const collection = await getCollection(collectionName)
      const documents = await collection.find(query, options).toArray()
      return { success: true, data: documents }
    } catch (error) {
      console.error(`Error finding documents in ${collectionName}:`, error)
      return { success: false, error: error.message }
    }
  }

  static async updateById(collectionName: string, id: string, updateData: any) {
    try {
      const collection = await getCollection(collectionName)
      const { ObjectId } = await import("mongodb")
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            ...updateData,
            updatedAt: new Date(),
          },
        },
      )
      return { success: true, modifiedCount: result.modifiedCount }
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error)
      return { success: false, error: error.message }
    }
  }

  static async deleteById(collectionName: string, id: string) {
    try {
      const collection = await getCollection(collectionName)
      const { ObjectId } = await import("mongodb")
      const result = await collection.deleteOne({ _id: new ObjectId(id) })
      return { success: true, deletedCount: result.deletedCount }
    } catch (error) {
      console.error(`Error deleting document in ${collectionName}:`, error)
      return { success: false, error: error.message }
    }
  }

  static async count(collectionName: string, query = {}) {
    try {
      const collection = await getCollection(collectionName)
      const count = await collection.countDocuments(query)
      return { success: true, count }
    } catch (error) {
      console.error(`Error counting documents in ${collectionName}:`, error)
      return { success: false, error: error.message }
    }
  }
}
