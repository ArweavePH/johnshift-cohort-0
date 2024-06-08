export interface Chat {
  id: string;
  roomId: string;
  owner: string;
  message: string;
  timestamp: number;
  file: {
    src: string;
    type: string;
  } | null;
}

export interface Room {
  id: string;
  admin: string[];
  name: string;
  timestamp: number;
  online: string[];
}
