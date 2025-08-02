/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
      './src/renderer/index.html',
      './src/renderer/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          // Основные цвета
          background: {
            primary: '#0a0a0b',     // Почти черный
            secondary: '#141416',   // Темно-серый
            tertiary: '#1e1e21',    // Средне-серый
            hover: '#252529',       // Серый при наведении
          },
          // Пастельные акценты
          accent: {
            pastel: {
              purple: '#b794f4',    // Пастельный фиолетовый
              blue: '#90cdf4',      // Пастельный голубой
              pink: '#fbb6ce',      // Пастельный розовый
              green: '#9ae6b4',     // Пастельный зеленый
              yellow: '#faf089',    // Пастельный желтый
            },
            primary: '#7c3aed',     // Основной акцент (фиолетовый)
            secondary: '#3b82f6',   // Второй акцент (синий)
          },
          // Текст
          text: {
            primary: '#ffffff',     // Белый
            secondary: '#a1a1aa',   // Светло-серый
            muted: '#71717a',       // Приглушенный серый
          },
          // Границы
          border: {
            DEFAULT: '#27272a',     // Темная граница
            light: '#3f3f46',       // Светлая граница
          },
          // Статусы
          status: {
            online: '#10b981',      // Зеленый
            idle: '#f59e0b',        // Желтый
            dnd: '#ef4444',         // Красный
            offline: '#6b7280',     // Серый
          },
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
          mono: ['JetBrains Mono', 'monospace'],
        },
        animation: {
          'slide-in': 'slideIn 0.2s ease-out',
          'fade-in': 'fadeIn 0.2s ease-out',
          'scale-in': 'scaleIn 0.2s ease-out',
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
        keyframes: {
          slideIn: {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(0)' },
          },
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          scaleIn: {
            '0%': { transform: 'scale(0.95)', opacity: '0' },
            '100%': { transform: 'scale(1)', opacity: '1' },
          },
        },
        boxShadow: {
          'glow-purple': '0 0 20px rgba(124, 58, 237, 0.5)',
          'glow-blue': '0 0 20px rgba(59, 130, 246, 0.5)',
          'inner-light': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        },
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
          'gradient-pastel': 'linear-gradient(135deg, #b794f4 0%, #90cdf4 25%, #9ae6b4 50%, #fbb6ce 75%, #faf089 100%)',
        },
        backdropBlur: {
          xs: '2px',
        },
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
      // Кастомные утилиты
      function({ addUtilities }) {
        addUtilities({
          '.glass-morphism': {
            'backdrop-filter': 'blur(10px)',
            'background-color': 'rgba(255, 255, 255, 0.05)',
            'border': '1px solid rgba(255, 255, 255, 0.1)',
          },
          '.text-gradient': {
            'background': 'linear-gradient(135deg, #b794f4 0%, #90cdf4 100%)',
            '-webkit-background-clip': 'text',
            '-webkit-text-fill-color': 'transparent',
            'background-clip': 'text',
          },
          '.scrollbar-thin': {
            'scrollbar-width': 'thin',
          },
          '.scrollbar-hide': {
            '-ms-overflow-style': 'none',
            'scrollbar-width': 'none',
            '&::-webkit-scrollbar': {
              'display': 'none',
            },
          },
        })
      }
    ],
  }