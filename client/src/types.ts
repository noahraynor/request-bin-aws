export type Tub = {encoded_id: string, name: string, date_created: string}

export interface Request {
  id: number,
  method: string,
  headers: string,
  timestamp: Date,
  body: string
}

export type ButtonClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => void

export interface NewTubProps {
  onClick: ButtonClickHandler
}

export interface MyTubsProps {
  tubs: Tub[];
  newestFirst: boolean;
  onToggleSort: () => void;
  onDelete: (tubId: string) => void;
}

export interface RequestProps {
  request: Request;
  onDelete?: (id: number) => void
}

export interface ToggleInfoProps {
  title: string;
  children: React.ReactNode;
}

export interface RequestHeaderProps {
  encoded_id: string;
  requestsLength: number;
}

export interface ModalProps {
  onClose: () => void;
  newTubId: number;
}