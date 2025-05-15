import { NumberLike } from "hashids/cjs/util";

interface Tub {
  id: number;
  encoded_id: string;
  name: string;
  date_created: string;
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

export interface TubPostRequestBody {
  name: string;
}


export type FrontFacingTub = Omit<Tub, 'id'>