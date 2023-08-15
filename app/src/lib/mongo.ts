import {MongoClient} from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (!MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable inside .env.local');
}

// @ts-ignore
let cached = global.mongo;
if (!cached) {
// @ts-ignore
  cached = global.mongo = {};
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const conn = {};
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

// @ts-ignore
    cached.promise = MongoClient.connect(MONGODB_URI, opts)
                                .then((client) => {
// @ts-ignore
                                  conn.client = client;
                                  return client.db(MONGODB_DB);
                                })
                                .then((db) => {
// @ts-ignore
                                  conn.db = db;
                                  cached.conn = conn;
                                });
  }

  await cached.promise;
  return cached.conn;
}
