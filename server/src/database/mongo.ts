// server/src/db/mongo.ts
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Construct full connection URI with TLS and retryWrites disabled
const uri = `${process.env.MONGO_URI}/${process.env.MONGO_DB}?tls=true&retryWrites=false`;

// Load Amazon DocumentDB's TLS CA bundle
const caFilePath = path.resolve('/home/ssm-user/global-bundle.pem');

const client = new MongoClient(uri, {
  tls: true,
  tlsCAFile: caFilePath,
});

const db = client.db(process.env.MONGO_DB);

export { client, db };
