export interface User {
  id: string;
  name: string;
}

export interface Message {
  id: string;
  sender: User;
  content: string;
  timestamp: number;
}

export interface CallUser {
  id: string;
  name: string;
  signal: any;
}

export interface PeerConnection {
  peerId: string;
  peer: any;
  userName: string;
}