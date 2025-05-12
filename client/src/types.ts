export interface TubWithRequests {
  id: Number,
  encoded_id: String,
  requests: Request[]
}

export type Tub = Pick<TubWithRequests, 'encoded_id'>;

export interface Request {
  id: Number,
  method: String,
  headers: String,
  Timestamp: String,
  request_body: String
}