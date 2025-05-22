interface Tub {
  id: number;
  encoded_id: string;
  name: string;
  date_created: string;
}

export type DeletedRequestRow = {
  body_id: string;
};

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


export type FrontFacingTub = Omit<Tub, 'id'>;

export type Config = {
  PGUSER: string;
  PGPASSWORD: string;
  PGHOST: string;
  PGPORT: string;
  PGDATABASE: string;
  MONGO_USERNAME: string;
  MONGO_PASSWORD: string;
  MONGO_URI: string;
  MONGO_DB: string;
};
