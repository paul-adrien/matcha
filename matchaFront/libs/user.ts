export interface User {
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
  currentPosition: boolean;
  lastConnection: Date;
  pictures: {
    id: string;
    url: string;
  }[];
}

export interface Tags {
  id: string;
  name: string;
}

export interface Filtre {
  age: number[];
  score: number;
  local: number;
  tags: number;
  sortBy: string;
}

export interface Notif {
  userId: string;
  sender_id: string;
  type: string;
  date: string;
  see: number;
  otherUserName: string;
}

export interface History {
  user: User;
  date: Date;
  type: "like" | "view";
}

export function mapUserBackToUserFront(user: any): User {
  return {
    userName: user["userName"],
    firstName: user["firstName"],
    lastName: user["lastName"],
    birthDate: user["birthDate"],
    password: user["password"],
    email: user["email"],
    id: user["id"],
    gender: user["gender"],
    showMe: user["showMe"],
    bio: user["bio"],
    score: user["score"],
    city: user["city"],
    latitude: user["latitude"],
    longitude: user["longitude"],
    emailVerify: user["emailVerify"] === "0" || !user["emailVerify"] ? false : true,
    profileComplete: user["profileComplete"] === "0" || !user["profileComplete"] ? false : true,
    link: user["link"],
    currentPosition: user["currentPosition"] === "0" ? false : true,
    lastConnection: new Date(user["lastConnection"]),
    pictures: [
      { id: "picture1", url: user["picture1"] as string },
      { id: "picture2", url: user["picture2"] as string },
      { id: "picture3", url: user["picture3"] as string },
      { id: "picture4", url: user["picture4"] as string },
      { id: "picture5", url: user["picture5"] as string },
    ],
  };
}
