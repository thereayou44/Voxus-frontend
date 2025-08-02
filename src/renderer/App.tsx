import { useState, useEffect } from 'react';
import AuthPage from './pages/AuthPage';
import MainPage from './pages/MainPage';
import TitleBar from './components/layout/TitleBar';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверяем токен при загрузке
    const token = localStorage.getItem('discord-lite-token');
    if (token) {
      // Здесь можно добавить проверку валидности токена
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('discord-lite-token');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-background-primary flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background-primary text-text-primary">
      <TitleBar />
      <div className="flex-1 overflow-hidden">
        {isAuthenticated ? (
          <MainPage onLogout={handleLogout} />
        ) : (
          <AuthPage onLogin={handleLogin} />
        )}
      </div>
    </div>
  );
}