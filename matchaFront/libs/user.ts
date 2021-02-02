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
  pictures: {
    id: string;
    url: string;
  }[];
}

export interface Tags {
  id: string;
  name: string;
}
