import axios, { AxiosInstance } from 'axios';
import { io, Socket } from 'socket.io-client';

// Типы данных
export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  last_seen_at?: string;
  created_at?: string;
}

export interface Room {
  id: string;
  name: string;
  type: 'direct' | 'group';
  max_members: number;
  created_by: string;
  created_at: string;
  members: User[];
}

export interface Message {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  type: string;
  created_at: string;
  edited_at?: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
}

// Класс API
class ApiService {
  private api: AxiosInstance;
  private socket: Socket | null = null;
  private token: string | null = null;

  constructor() {
    const baseURL = 'http://localhost:8080';
    
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Интерцептор для добавления токена
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Интерцептор для обработки ошибок
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Токен истек или невалидный
          this.clearToken();
          window.location.href = '/auth';
        }
        return Promise.reject(error);
      }
    );
  }

  // Управление токеном
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('discord-lite-token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('discord-lite-token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('discord-lite-token');
    this.disconnectSocket();
  }

  // Auth методы
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.api.post('/auth/login', data);
    this.setToken(response.data.token);
    await this.connectSocket();
    return response.data;
  }

  async register(data: RegisterRequest): Promise<void> {
    await this.api.post('/auth/register', data);
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
    } finally {
      this.clearToken();
    }
  }

  // User методы
  async getMe(): Promise<User> {
    const response = await this.api.get('/api/v1/users/me');
    return response.data;
  }

  async updateMe(data: Partial<User>): Promise<User> {
    const response = await this.api.put('/api/v1/users/me', data);
    return response.data;
  }

  async getUser(id: string): Promise<User> {
    const response = await this.api.get(`/api/v1/users/${id}`);
    return response.data;
  }

  async searchUsers(query: string): Promise<User[]> {
    const response = await this.api.get('/api/v1/users/search', {
      params: { q: query }
    });
    return response.data.users;
  }

  // Room методы
  async createRoom(data: {
    name: string;
    type: 'group' | 'direct';
    member_ids?: string[];
    max_members?: number;
  }): Promise<Room> {
    const response = await this.api.post('/api/v1/rooms', data);
    return response.data;
  }

  async createDirectRoom(userId: string): Promise<Room> {
    const response = await this.api.post('/api/v1/rooms/direct', {
      user_id: userId
    });
    return response.data;
  }

  async getMyRooms(): Promise<Room[]> {
    const response = await this.api.get('/api/v1/rooms');
    return response.data.rooms || [];
  }

  async getRoom(id: string): Promise<Room> {
    const response = await this.api.get(`/api/v1/rooms/${id}`);
    return response.data;
  }

  async updateRoom(id: string, data: Partial<Room>): Promise<Room> {
    const response = await this.api.put(`/api/v1/rooms/${id}`, data);
    return response.data;
  }

  async deleteRoom(id: string): Promise<void> {
    await this.api.delete(`/api/v1/rooms/${id}`);
  }

  async joinRoom(id: string): Promise<void> {
    await this.api.post(`/api/v1/rooms/${id}/join`);
  }

  async leaveRoom(id: string): Promise<void> {
    await this.api.post(`/api/v1/rooms/${id}/leave`);
  }

  async getRoomMembers(id: string): Promise<User[]> {
    const response = await this.api.get(`/api/v1/rooms/${id}/members`);
    return response.data.members;
  }

  // Message методы
  async getRoomMessages(
    roomId: string,
    limit: number = 50,
    beforeId?: string
  ): Promise<{ messages: Message[]; has_more: boolean }> {
    const response = await this.api.get(`/api/v1/rooms/${roomId}/messages`, {
      params: { limit, before: beforeId }
    });
    return {
      messages: response.data.messages || [],
      has_more: response.data.has_more || false
    };
  }

  async sendMessage(roomId: string, content: string, type: string = 'text'): Promise<Message> {
    const response = await this.api.post(`/api/v1/rooms/${roomId}/messages`, {
      content,
      type
    });
    return response.data;
  }

  async updateMessage(id: string, content: string): Promise<Message> {
    const response = await this.api.put(`/api/v1/messages/${id}`, { content });
    return response.data;
  }

  async deleteMessage(id: string): Promise<void> {
    await this.api.delete(`/api/v1/messages/${id}`);
  }

  // WebSocket методы
  async connectSocket(): Promise<void> {
    const token = this.getToken();
    if (!token || this.socket?.connected) return;

    const wsUrl = 'ws://localhost:8080';
    
    this.socket = io(wsUrl, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  disconnectSocket() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  // Подписка на события сокета
  onSocketEvent(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  offSocketEvent(event: string, callback?: (data: any) => void) {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        this.socket.off(event);
      }
    }
  }

  // Отправка сообщений через сокет
  emitSocketEvent(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }
}

// Экспортируем singleton
export const api = new ApiService();