import { config as dotenv } from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv();

const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const dbHost = process.env.DB_HOST;
const authMechanism = 'DEFAULT';
const qString = `retryWrites=true&w=majority&authMechanism=${authMechanism}`;

const uri = `mongodb://${username}:${password}@${dbHost}/?${qString}`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const getCollection = async (collectionName) => {
  const connection = await client.connect();
  const db = connection.db(process.env.DB_NAME);
  return db.collection(collectionName);
};
