import mongoose from "mongoose";

type CachedMongoose = { connection: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const globalForMongoose = global as typeof globalThis & { mongooseCache?: CachedMongoose };
const cache = globalForMongoose.mongooseCache || { connection: null, promise: null };
globalForMongoose.mongooseCache = cache;

export async function connectDatabase() {
  if (cache.connection) return cache.connection;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI must be configured for server-side data storage.");
  cache.promise ||= mongoose.connect(uri, { bufferCommands: false });
  cache.connection = await cache.promise;
  return cache.connection;
}
