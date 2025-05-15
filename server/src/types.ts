import { NumberLike } from "hashids/cjs/util";

interface Tub {
  id: number
  encoded_id: string
}

// Example request type:
export interface FrontFacingTubRequest {
  id: number;
  method: string;
  headers: { [key: string]: string };
  timestamp: Date;
  body: { [key: string]: string };
}

export interface SQLTubRequest {
  id: number;
  tub_id: number;
  method: string;
  headers: any;
  body_id: string;
  received_at: string;
}

export type FrontFacingTub = Pick<Tub, 'encoded_id'>