export interface User {
  id: string;
  username: string;
  avatarUrl?: string;
}

export interface Room {
  id: string;
  name: string;
  isDirect: boolean;
  members: User[];
}

export interface Message {
  id: string;
  roomId: string;
  author: User;
  content: string;
  createdAt: string;
} 