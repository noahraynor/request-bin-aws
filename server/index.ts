import express from 'express';
import axios from 'axios';
import ngrok from 'ngrok'
import pool from './src/db'
import { db } from './src/mongo';
import Hashids from 'hashids';
import { ObjectId } from 'mongodb';

const app = express();
app.use(express.json());


const PORT = 3000;
const hashids = new Hashids('tubs-secret-salt-val', 6)

//Test mongo db
app.get('/api/mongo-test', async (req, res) => {
  try {
    // collection variable is assigned to a MongoDB cursor
    // for some reason this is synchronous, not executing yet
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
app.get('/api/tubs', async (req, res) => {
  try {
    const result = await pool.query('SELECT encoded_id FROM tubs');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Returns an array of all requests for a specific tub with encoded_id: id
app.get('/api/tubs/:id/requests', async (req, res) => {
  try {
    const encoded_id = req.params.id;
    //const decoded_id = hashids.decode(encoded_id)[0];
    const decoded_id = 1;
    const result = await pool.query(`SELECT * FROM requests WHERE tub_id=$1`, [decoded_id]);
    const sqlRequests = result.rows;
    console.log(sqlRequests);
    
    const requests = await Promise.all(
      sqlRequests.map(async (request) => {

        //let body_id = request.body_id;
        let body_id = '682272e2f5dd2b9ccb6b140d';

        if (!ObjectId.isValid(body_id)) {
          console.warn(`Invalid ObjectId: ${body_id}`);
          return null;
        }

        let bodyMongoID = new ObjectId(body_id);

        const collection = db.collection('bodies');
        const document = await collection.findOne({ _id: bodyMongoID });

        return {
          id: request.id,
          method: request.method,
          headers: request.headers,
          timestamp: new Date(request.received_at),
          body: document!.body,
        };
      })
    );

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Example request type:
interface Request {
  id: number;
  method: string;
  headers: { [key: string]: string };
  timestamp: Date;
  body: { [key: string]: string };
}

// Creates a new tub
app.post('/api/tubs', async (req, res) => {
  console.log('creating a new tub')
  try {
    const idResult = await pool.query("SELECT nextval('tubs_id_seq')");
    const internalId = idResult.rows[0].nextval

    const encoded_id = hashids.encode(internalId)
    await pool.query(
      `INSERT INTO tubs (id, encoded_id)
       VALUES ($1, $2)`, [internalId, encoded_id])
    
    console.log('New tub created with id: ', encoded_id)
    res.json({encoded_id: encoded_id})
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database failed to create new tub" });
  }
  
});

// Endpoint for all webhooks requests.
app.all('/receive/:id', (req, res) => {
  console.log("Request method:", req.method)
  console.log("Body: ", req.body)
  console.log("Tub Id: ", req.params.id)
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
