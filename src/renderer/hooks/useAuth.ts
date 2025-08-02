import { useState } from 'react';

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('discord-lite-token'));
  const [user, setUser] = useState<any>(null);

  const login = (newToken: string, userInfo: any) => {
    setToken(newToken);
    setUser(userInfo);
    localStorage.setItem('discord-lite-token', newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('discord-lite-token');
  };

  return { token, user, login, logout };
} 