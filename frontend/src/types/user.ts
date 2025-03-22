import type { CharacterBase } from "./characterBase";

export default interface AuthUser {
  email: string;
  password: string;
}

export type UserData = {
  id: number;
  email: string;
  friends: UserData[];
  friendRequests: FriendRequest[];
  characters: CharacterBase[];
};

export type FriendRequest = {
  id: number;
  sender: UserData;
};
