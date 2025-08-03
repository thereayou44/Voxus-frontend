import { useState, useEffect } from 'react';
import { Minus, Square, X, Sparkles } from 'lucide-react';

// Интерфейс для IPC коммуникации с Electron
declare global {
  interface Window {
    electron: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
      isMaximized: () => Promise<boolean>;
    }
  }
}

export default function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    // Проверяем начальное состояние окна
    const checkMaximized = async () => {
      if (window.electron?.isMaximized) {
        const maximized = await window.electron.isMaximized();
        setIsMaximized(maximized);
      }
    };
    
    checkMaximized();

    // Слушаем изменения состояния окна
    const handleResize = () => {
      checkMaximized();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMinimize = () => {
    if (window.electron?.minimize) {
      window.electron.minimize();
    }
  };

  const handleMaximize = () => {
    if (window.electron?.maximize) {
      window.electron.maximize();
      setIsMaximized(!isMaximized);
    }
  };

  const handleClose = () => {
    if (window.electron?.close) {
      window.electron.close();
    }
  };

  return (
    <div className="h-8 bg-background-secondary border-b border-border flex items-center justify-between px-2 drag-region">
      {/* Левая часть - логотип и название */}
      <div className="flex items-center space-x-2 no-drag">
        <div className="w-5 h-5 rounded bg-gradient-to-br from-accent-pastel-purple to-accent-pastel-blue flex items-center justify-center">
          <Sparkles className="w-3 h-3 text-white" />
        </div>
        <span className="text-xs font-medium text-text-secondary">Discord Lite</span>
      </div>

      {/* Правая часть - кнопки управления окном */}
      <div className="flex items-center space-x-1 no-drag">
        {/* Minimize */}
        <button
          onClick={handleMinimize}
          className="w-7 h-7 rounded hover:bg-background-hover transition-colors duration-150 flex items-center justify-center group"
          aria-label="Свернуть"
        >
          <Minus className="w-3.5 h-3.5 text-text-muted group-hover:text-text-primary" />
        </button>

        {/* Maximize/Restore */}
        <button
          onClick={handleMaximize}
          className="w-7 h-7 rounded hover:bg-background-hover transition-colors duration-150 flex items-center justify-center group"
          aria-label={isMaximized ? "Восстановить" : "Развернуть"}
        >
          <Square className="w-3 h-3 text-text-muted group-hover:text-text-primary" />
        </button>

        {/* Close */}
        <button
          onClick={handleClose}
          className="w-7 h-7 rounded hover:bg-red-500 hover:text-white transition-colors duration-150 flex items-center justify-center group"
          aria-label="Закрыть"
        >
          <X className="w-3.5 h-3.5 text-text-muted group-hover:text-white" />
        </button>
      </div>
    </div>
  );
}