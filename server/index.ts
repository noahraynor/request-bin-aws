import express from 'express';
import pool from './src/db'
import { db } from './src/mongo';

const app = express();
app.use(express.json());


const PORT = 3000;

//Test mongo db
app.get('/api/mongo-test', async (req, res) => {
  try {
    const collection = db.collection('test_items');
    const items = await collection.find().toArray();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'MongoDB error' });
  }
});

//Test PSQL
app.get('/api/tubs2', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tubs');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

//Test PSQL
app.get('/api/requests2', async (req, res) => {
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

// Get all tubs
app.get('/api/tubs', (req, res) => {
  console.log('GET /api/tubs: getting all tubs')
  const tubs =  [
      {
        "encoded_id": "a8f3jd92"
      },
      {
        "encoded_id": "k2djw93l"
      },
      {
        "encoded_id": "z7x1op5n"
      }
    ]
  res.json(tubs)
});

// Creates a new tub
app.post('/api/tubs', (req, res) => {
  console.log('creating a new tub')
});

// Get all requests in a specific tub
app.get('/api/tubs/:id', (req, res) => {
  let publicId = req.params.id 
  console.log(`getting all request for tub ${publicId}`)
  res.send(`All requests from tub ${publicId}`)
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
