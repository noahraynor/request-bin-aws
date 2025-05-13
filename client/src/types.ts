export type Tub = {encoded_id: string}

export interface Request {
  id: number,
  method: string,
  headers: string,
  Timestamp: string,
  body: string
}