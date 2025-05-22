import { Pool } from 'pg';
import { loadConfig } from '../config/config.js';

const config = await loadConfig();
const pool = new Pool({
  host: config.PGHOST,
  port: Number(config.PGPORT) || 5432,
  user: config.PGUSER,
  password: config.PGPASSWORD,
  database: config.PGDATABASE,
});

export default pool;