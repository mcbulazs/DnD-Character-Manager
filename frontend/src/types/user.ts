export default interface AuthUser {
  email: string;
  password: string;
}

export type UserData = {
  id: number;
  email: string;
  friends: UserData[];
  friendRequests: {
    id: number;
    sender: UserData;
  }[];
};
