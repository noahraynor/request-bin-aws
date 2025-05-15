import { Request, Response } from "express";
import pool from './database/db';
import { QueryResult } from 'pg';
import { db } from './database/mongo';
import Hashids = require('hashids');
import { ObjectId } from 'mongodb';
import { FrontFacingTub, SQLTubRequest, FrontFacingTubRequest } from "./types";
import { DeleteResult } from 'mongodb';


const express = require('express');
const router = express.Router();

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

// Returns and array of tub objects
router.get('/api/tubs', async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query<FrontFacingTub>('SELECT encoded_id FROM tubs');
    console.log(result);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Returns an array of all requests for a specific tub with encoded_id: id
router.get('/api/tubs/:id/requests', async (req: Request, res: Response) => {
  const encoded_id = req.params.id;
  const decoded_id = decodeEncodedId(encoded_id);

  if (!decoded_id) { // It is possible to differentiate between prod and dev to add more clarity
    res.status(400).json({ error: 'Invalid tub id' });
    return;
  }

  try {
    const result = await pool.query<SQLTubRequest>(
      `SELECT * FROM requests WHERE tub_id=$1`, [decoded_id]);
    const sqlRequests = result.rows;
    console.log(sqlRequests);

    // [AH] Revisit this typing on requests ------------------------------------------------
    const requests: (FrontFacingTubRequest | null)[] = await Promise.all( 
      sqlRequests.map(async (request) => {

        const body_id = request.body_id;

        if (!ObjectId.isValid(body_id)) {
          console.warn(`Invalid ObjectId: ${body_id}`);
          return null;
        }

        const bodyMongoID = new ObjectId(body_id);

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

type DeletedRequestRow = {
  body_id: string;
};

// Delete a request by request_id
// This should match primary key in requests database SQL
router.delete('/api/requests/:request_id', async (req: Request, res: Response): Promise<Response> => {
  try {
    const request_id: string = req.params.request_id;

    // Delete request from SQL
    // ALSO save body_id
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
    const collection = db.collection('bodies');
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

// Creates a new tub
router.post('/api/tubs', async (_req: Request, res: Response) => {
  console.log('creating a new tub')
  try {
    const idResult: QueryResult<{ nextval: string }> = await pool.query("SELECT nextval('tubs_id_seq')");
    const internalId = idResult.rows[0].nextval

    const encoded_id = encodeInternalId(internalId);
    await pool.query(
      `INSERT INTO tubs (id, encoded_id)
       VALUES ($1, $2)`, [internalId, encoded_id])

    console.log('New tub created with id: ', encoded_id);
    res.json({ encoded_id: encoded_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database failed to create new tub" });
  }

});

// Endpoint for all webhooks requests.
router.all('/receive/:id', async (req: Request, res: Response) => {
  const encoded_id = req.params.id;
  const decoded_id = decodeEncodedId(encoded_id);

  if (!decoded_id) { // It is possible to differentiate between prod and dev to add more clarity
    res.status(400).json({ error: 'Invalid tub id' });
    return;
  }

  try {
    // Insert body to mongo
    const collection = db.collection('bodies');
    const mongoResult = await collection.insertOne({ body: req.body });
    const mongoBodyId = mongoResult.insertedId.toString();

    // Insert new request into sql
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

export default router