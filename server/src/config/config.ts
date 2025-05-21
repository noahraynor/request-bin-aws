import {
  SecretsManagerClient,
  GetSecretValueCommand
} from '@aws-sdk/client-secrets-manager';
import {
  SSMClient,
  GetParametersByPathCommand
} from '@aws-sdk/client-ssm';

const secretsClient = new SecretsManagerClient({});
const ssmClient = new SSMClient({});

export async function loadConfig() {
  // Load secrets
  const secretRes = await secretsClient.send(
    new GetSecretValueCommand({ SecretId: 'request-tubs/db-credentials' })
  );
  const secrets = JSON.parse(secretRes.SecretString!);

  // Load SSM parameters
  const paramRes = await ssmClient.send(
    new GetParametersByPathCommand({
      Path: '/request-tubs',
      WithDecryption: true
    })
  );

  const params = Object.fromEntries(
    paramRes.Parameters!.map(p => [p.Name!.split('/').pop()!, p.Value])
  );

  return {
    PGUSER: secrets.PGUSER,
    PGPASSWORD: secrets.PGPASSWORD,
    MONGO_USERNAME: secrets.MONGO_USERNAME,
    MONGO_PASSWORD: secrets.MONGO_PASSWORD,
    ...params // PGHOST, PGPORT, PGDATABASE, MONGO_URI, MONGO_DB, etc.
  };
}

export type AppConfig = Awaited<ReturnType<typeof loadConfig>>;
