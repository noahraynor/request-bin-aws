import express from 'express';
import pool from './src/db'

const app = express();
app.use(express.json());


const PORT = 3000;

app.get('/api/tubs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tubs');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/requests', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM requests');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
