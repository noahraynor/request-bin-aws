import express from 'express';
import axios from 'axios';
import ngrok from 'ngrok'
import pool from './src/db'
import { db } from './src/mongo';

const app = express();
app.use(express.json());


const PORT = 3000;

//Test mongo db
app.get('/api/mongo-test', async (req, res) => {
  try {
    // collection variable is assigned to a MongoDB cursor
    const collection = db.collection('bodies');
    // converts the cursor to an array of MongoDB documents (as javascript objects)
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
    const result = await pool.query('SELECT encoded_id FROM tubs');
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

// Endpoint for all webhooks requests.
app.all('/receive/', (req, res) => {
  console.log(`Request method ${JSON.stringify(req.method)}. Body: ${JSON.stringify(req.body)}`)
  res.send('request received')
});

interface Tunnel {
  name: string;
  public_url: string;
  proto: string;
}

interface NgrokApiResponse {
  tunnels: Tunnel[];
}

// Endpoint to get current ngrok public URL
app.get('/api/ngrok-url', async (req, res) => {
  try {
    const response = await axios.get<NgrokApiResponse>('http://127.0.0.1:4040/api/tunnels');
    const httpsTunnel = response.data.tunnels.find(t => t.proto === 'https');
    const publicUrl = httpsTunnel?.public_url || null;

    if (publicUrl) {
      res.json({ publicUrl });
    } else {
      res.status(404).json({ error: 'No HTTPS tunnel found' });
    }
  } catch (err) {
    console.error('Error fetching ngrok URL:', (err as Error).message);
    res.status(500).json({ error: 'Failed to retrieve ngrok URL' });
  }
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  const url = await ngrok.connect({ addr: 3000 });
  console.log(`Ngrok tunnel available at: ${url}`);
});
