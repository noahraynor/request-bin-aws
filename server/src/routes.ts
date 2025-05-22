import { Request, Response } from "express";
import pool from './database/sql.js';
import { QueryResult } from 'pg';
import { db } from './database/mongo.js';
import Hashids from 'hashids';
import { ObjectId } from 'mongodb';
import { FrontFacingTub, SQLTubRequest, FrontFacingTubRequest, DeletedRequestRow } from "./types.js";
import { DeleteResult } from 'mongodb';

const express = require('express');
const router = express.Router();

// Set up hashing
const SALT_VALUE = 'tubs-secret-salt-val'; // DO NOT CHANGE!!!
const HASH_LENGTH = 6;                     // DO NOT CHANGE!!!
const hashids = new Hashids(SALT_VALUE, HASH_LENGTH);

function encodeInternalId(internalId: string): string {
  return hashids.encode(internalId);
}

function decodeEncodedId(encodedId: string): string | null {
  const decoded = hashids.decode(encodedId);
  const value = decoded[0];

  if (typeof value === 'number' || typeof value === 'bigint') {
    return value.toString();
  }

  return null;
}

// Returns an array of tub objects (no requsts inside)
// Encoded id and date created
router.get('/api/tubs', async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query<FrontFacingTub>('SELECT encoded_id, name, date_created FROM tubs');
    console.log(result);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Returns an array of all requests for a specific tub of specific encoded ID
// Pulls method, headers, and timestamp from postgreSQL
// Pulls body from mongoDB
router.get('/api/tubs/:id/requests', async (req: Request, res: Response) => {
  const encoded_id = req.params.id;
  // Decode the id
  const decoded_id = decodeEncodedId(encoded_id);
  if (!decoded_id) { 
    res.status(400).json({ error: 'Invalid tub id' });
    return;
  }
  try {
    // 
    const result = await pool.query<SQLTubRequest>(
      `SELECT * FROM requests WHERE tub_id=$1`, [decoded_id]);
    const sqlRequests = result.rows;
    console.log(sqlRequests);

    const requests: (FrontFacingTubRequest | null)[] = await Promise.all( 
      sqlRequests.map(async (request) => {

        const body_id = request.body_id;

        if (!ObjectId.isValid(body_id)) {
          console.warn(`Invalid ObjectId: ${body_id}`);
          return null;
        }

        const bodyMongoID = new ObjectId(body_id);

        const collection = (await db).collection('bodies');
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



// Delete a request by request_id
router.delete('/api/requests/:request_id', async (req: Request, res: Response): Promise<Response> => {
  try {
    const request_id: string = req.params.request_id;

    // Delete request from SQL
    // ALSO save body_id (used to delete from Mongo)
    const result = await pool.query<DeletedRequestRow>(`DELETE FROM requests WHERE id=$1 RETURNING body_id`, [request_id]);
    if (!result.rowCount || result.rowCount < 1) {
      console.log('No matching request found. Nothing deleted.');
      return res.status(404).json({ error: 'Request not found' });
    }

    // Delete body from Mongo
    const body_id = result.rows[0].body_id;
    if (!ObjectId.isValid(body_id)) {
      console.warn(`Invalid ObjectId: ${body_id}`);
      return res.status(400).json({ error: 'Invalid body_id' });
    }
    const collection = (await db).collection('bodies');
    const result2: DeleteResult = await collection.deleteOne({ _id: new ObjectId(body_id) });
    if (result2.deletedCount < 1) {
      console.log('No matching body found. Nothing deleted.');
      return res.status(404).json({ error: 'Body not found' });
    }

    // Success from Mongo and SQL!
    console.log('Delete successful!');
    return res.sendStatus(204); // No Content
    
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unexpected error, maybe db connection issue" });
  }
});

// Delete a tub
router.delete('/api/tubs/:id', async (req: Request, res: Response): Promise<void> => {
  const tubId = req.params.id;
  const internalTubId = decodeEncodedId(tubId)

  try {
    const resultTubs = await pool.query(`DELETE FROM tubs WHERE id=$1`, [internalTubId]);

    if (resultTubs.rowCount === 0) {
      res.status(404).json({ error: "Tub not found." });
      return;
    }

    console.log("Successful deletion")
    res.sendStatus(204)
  } catch (error) {
    console.error("Error deleting tub:", error);
    res.status(500).json({ error: "Error deleting tub from db." })
  }
});

// Creates a new tub
router.post('/api/tubs', async (req: Request, res: Response) => {
  console.log('creating a new tub')

  try {
    const idResult: QueryResult<{ nextval: string }> = await pool.query("SELECT nextval('tubs_id_seq')");
    const internalId = idResult.rows[0].nextval
    const encoded_id = encodeInternalId(internalId);

    let tubName = encoded_id

    if (req.body && typeof req.body.name === "string" &&  req.body.name !== '') {
      tubName = req.body.name
    }

    const result = await pool.query<FrontFacingTub>(
      `INSERT INTO tubs (id, encoded_id, name)
       VALUES ($1, $2, $3)
       RETURNING encoded_id, name, date_created`, [internalId, encoded_id, tubName])

    if (result.rows.length === 0) {
      res.status(500).json({ error: "Failed to create tub." });
      return
    }
    console.log('New tub created with id: ', encoded_id);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database failed to create new tub" });
  }

});

// Endpoint for all webhooks requests.
router.all('/receive/:id', async (req: Request, res: Response) => {
  const encoded_id = req.params.id;
  const decoded_id = decodeEncodedId(encoded_id);

  if (!decoded_id) { 
    res.status(400).json({ error: 'Invalid tub id' });
    return;
  }

  try {
    // Insert body to MongoDB
    const collection = (await db).collection('bodies');
    const mongoResult = await collection.insertOne( { body: req.body } );
    const mongoBodyId = mongoResult.insertedId.toString();

    // Insert new request into SQL
    await pool.query(
      `INSERT INTO requests (tub_id, method, headers, body_id)
      VALUES ($1, $2, $3, $4)`,
      [decoded_id, req.method, req.headers, mongoBodyId]);
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database failed to create a new request" });
  }
});

router.get('/health/db', async (_req: Request, res: Response) => {
  try {
    const mongoPing = await (await db).command({ ping: 1 });
    const pgResult = await pool.query('SELECT NOW()');

    res.json({
      mongo: mongoPing.ok === 1 ? 'connected' : 'error',
      postgres: pgResult.rows.length ? 'connected' : 'error',
    });
  } catch (err) {
    console.error('DB health check error:', err);
    res.status(500).json({ error: 'One or both databases failed', details: err });
  }
});

export default router;