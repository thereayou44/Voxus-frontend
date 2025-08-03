// Простой скрипт для запуска Electron в режиме разработки
const { spawn } = require('child_process');
const electron = require('electron');

// Запускаем Electron с текущим проектом
const electronProcess = spawn(electron, ['.'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development'
  }
});

electronProcess.on('close', (code) => {
  process.exit(code);
});