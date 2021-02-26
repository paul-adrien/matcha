import { User } from "./user";
export interface PossConv {
  user: User;
  convId: number;
}

export interface ActiveConv {
  id: string;
  user_id1: string;
  user_id2: string;
  active: number;
  otherUser: User;
  lastMsg: string;
}

export interface Messages {
  id: number;
  conv_id: string;
  msg: string;
  sender_id: string;
  sendingDate: string;
  see: number;
}

export interface MessageSend {
  msg: string;
}
