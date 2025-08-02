import type { User, Room, Message } from '../types/api';

export async function login(username: string, password: string): Promise<void> {
  // Здесь должен быть реальный запрос к серверу
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === "user" && password === "pass") {
        localStorage.setItem('discord-lite-token', 'mock-token');
        resolve();
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 500);
  });
}

export async function register(username: string, password: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username && password) {
        resolve();
      } else {
        reject(new Error("Invalid data"));
      }
    }, 500);
  });
}

export async function getMe(): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: '1', username: 'user', avatarUrl: undefined });
    }, 300);
  });
}

export async function getRooms(): Promise<Room[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: '1', name: 'Общий', isDirect: false, members: [] },
        { id: '2', name: 'Личка', isDirect: true, members: [] },
      ]);
    }, 300);
  });
}

export async function getRoom(id: string): Promise<Room> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: id === '1' ? 'Общий' : 'Личка', isDirect: id !== '1', members: [] });
    }, 300);
  });
}

export async function getRoomMessages(roomId: string): Promise<Message[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'm1', roomId, author: { id: '1', username: 'user' }, content: 'Привет!', createdAt: new Date().toISOString() },
      ]);
    }, 300);
  });
}

export async function sendMessage(roomId: string, content: string): Promise<Message> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: Math.random().toString(), roomId, author: { id: '1', username: 'user' }, content, createdAt: new Date().toISOString() });
    }, 200);
  });
}

export async function updateMessage(id: string, content: string): Promise<Message> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, roomId: '1', author: { id: '1', username: 'user' }, content, createdAt: new Date().toISOString() });
    }, 200);
  });
}

export async function deleteMessage(id: string): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 200);
  });
}

export async function logout(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.removeItem('discord-lite-token');
      resolve();
    }, 200);
  });
}
