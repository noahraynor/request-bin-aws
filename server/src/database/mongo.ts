import { MongoClient, Db } from 'mongodb';
import path from 'path';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import {
  SSMClient,
  GetParametersByPathCommand,
} from '@aws-sdk/client-ssm';

const secretsClient = new SecretsManagerClient({});
const ssmClient = new SSMClient({});
const caFilePath = path.resolve('/home/ssm-user/global-bundle.pem');

let cachedDb: Promise<Db> | null = null;

async function connectToMongo(): Promise<Db> {
  // 1. Get secrets
  const secretRes = await secretsClient.send(
    new GetSecretValueCommand({ SecretId: 'request-tubs/db-credentials' })
  );
  const secrets = JSON.parse(secretRes.SecretString!);
  const username = secrets.MONGO_USERNAME;
  const password = secrets.MONGO_PASSWORD;

  // 2. Get SSM params
  const paramRes = await ssmClient.send(
    new GetParametersByPathCommand({
      Path: '/request-tubs',
      WithDecryption: true,
    })
  );

  const paramMap = Object.fromEntries(
    paramRes.Parameters!.map(p => [p.Name!.split('/').pop()!, p.Value])
  );

  const uri = `${paramMap.MONGO_URI}/${paramMap.MONGO_DB}?tls=true&retryWrites=false`;

  const client = new MongoClient(uri, {
    auth: { username, password },
    authMechanism: 'SCRAM-SHA-1',
    tls: true,
    tlsCAFile: caFilePath,
  });

  await client.connect();
  return client.db(paramMap.MONGO_DB);
}


export const db: Promise<Db> = (async () => {
  if (!cachedDb) {
    cachedDb = connectToMongo();
  }
  return cachedDb;
})();
