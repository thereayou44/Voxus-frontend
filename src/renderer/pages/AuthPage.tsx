import React, { useState } from "react";
import { login } from "../services/api";

const AuthPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(username, password);
      // TODO: redirect to main page
    } catch (err) {
      setError("Неверные данные для входа");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pastel-blue">
      <form onSubmit={handleSubmit} className="bg-white bg-opacity-80 p-8 rounded-lg shadow-md w-80 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-pastel-purple mb-2 text-center">Вход</h2>
        <input
          className="p-2 rounded border border-pastel-purple focus:outline-none focus:ring-2 focus:ring-pastel-purple"
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          className="p-2 rounded border border-pastel-purple focus:outline-none focus:ring-2 focus:ring-pastel-purple"
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-pastel-red text-sm text-center">{error}</div>}
        <button
          className="bg-pastel-purple text-white rounded p-2 font-semibold hover:bg-pastel-purple-dark transition"
          type="submit"
        >
          Войти
        </button>
      </form>
    </div>
  );
};

export default AuthPage;
