export interface PossConv {
  id: string;
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  userName: string;
  birthDate: Date;
  gender: number;
  showMe: number;
  bio: string;
  score: string;
  city: string;
  latitude: string;
  longitude: string;
  emailVerify: boolean;
  profileComplete: boolean;
  link: string;
  pictures: {
    id: string;
    url: string;
  }[];
}

export interface ActiveConv {
  id: string;
  user_id1: string;
  user_id2: string;
  active: number;
  other_id: string;
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
