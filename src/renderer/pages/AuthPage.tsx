import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

interface FormData {
  username: string;
  email: string;
  password: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  general?: string;
}

interface AuthPageProps {
  onLogin: () => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!isLogin && !formData.username.trim()) {
      newErrors.username = 'Имя пользователя обязательно';
    } else if (!isLogin && formData.username.length < 3) {
      newErrors.username = 'Минимум 3 символа';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Неверный формат email';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (!isLogin && formData.password.length < 6) {
      newErrors.password = 'Минимум 6 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        const response = await api.login({
          email: formData.email,
          password: formData.password
        });
        onLogin();
      } else {
        await api.register({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
        // После успешной регистрации автоматически логинимся
        const response = await api.login({
          email: formData.email,
          password: formData.password
        });
        onLogin();
      }
    } catch (error: any) {
      setErrors({ 
        general: error.response?.data?.error || 'Произошла ошибка. Попробуйте снова.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Убираем ошибку при вводе
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
      {/* Фоновые эффекты */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-pastel-purple/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-pastel-blue/20 rounded-full blur-3xl" />
      </div>

      {/* Форма */}
      <div className="relative w-full max-w-md">
        <div className="bg-background-secondary/80 backdrop-blur-xl rounded-2xl p-8 border border-border shadow-2xl">
          {/* Логотип */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-accent-pastel-purple to-accent-pastel-blue mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Discord Lite</h1>
            <p className="text-text-secondary mt-2">
              {isLogin ? 'С возвращением!' : 'Создайте аккаунт'}
            </p>
          </div>

          {/* Ошибка общая */}
          {errors.general && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center text-red-400">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm">{errors.general}</span>
            </div>
          )}

          {/* Форма */}
          <div className="space-y-5">
            {/* Username (только для регистрации) */}
            {!isLogin && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-text-secondary mb-2">
                  Имя пользователя
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="johndoe"
                    className={`w-full pl-10 pr-3 py-3 bg-background-primary rounded-lg border ${
                      errors.username ? 'border-red-500' : 'border-border'
                    } focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all`}
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-400">{errors.username}</p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className={`w-full pl-10 pr-3 py-3 bg-background-primary rounded-lg border ${
                    errors.email ? 'border-red-500' : 'border-border'
                  } focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-3 py-3 bg-background-primary rounded-lg border ${
                    errors.password ? 'border-red-500' : 'border-border'
                  } focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all`}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Кнопка отправки */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-accent-pastel-purple to-accent-pastel-blue text-white font-medium rounded-lg hover:shadow-lg hover:shadow-accent-pastel-purple/25 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Войти' : 'Зарегистрироваться'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>

          {/* Переключение между входом и регистрацией */}
          <div className="mt-6 text-center">
            <p className="text-text-secondary">
              {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="text-accent-pastel-purple hover:text-accent-pastel-blue font-medium transition-colors"
              >
                {isLogin ? 'Создать' : 'Войти'}
              </button>
            </p>
          </div>
        </div>

        {/* Дополнительная информация */}
        <p className="text-center text-text-muted text-sm mt-6">
          Продолжая, вы соглашаетесь с условиями использования
        </p>
      </div>
    </div>
  );
}