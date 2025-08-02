import React from "react";
import TitleBar from "../components/layout/TitleBar";

const MainPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-pastel-blue">
      <TitleBar />
      <div className="flex flex-1">
        <aside className="w-64 bg-pastel-purple text-white p-4 flex flex-col gap-2">
          <div className="font-bold text-lg mb-4">Серверы</div>
          {/* Список серверов */}
          <button className="bg-pastel-blue text-pastel-purple rounded p-2 hover:bg-pastel-blue-light">+ Новый сервер</button>
        </aside>
        <main className="flex-1 bg-white bg-opacity-80 p-6 flex flex-col">
          <div className="font-bold text-xl text-pastel-purple mb-2">Канал #общий</div>
          <div className="flex-1 overflow-y-auto">
            {/* Сообщения */}
            <div className="text-gray-700">Добро пожаловать в discord-lite!</div>
          </div>
          <form className="mt-4 flex gap-2">
            <input className="flex-1 p-2 rounded border border-pastel-purple focus:outline-none focus:ring-2 focus:ring-pastel-purple" placeholder="Введите сообщение..." />
            <button className="bg-pastel-purple text-white rounded px-4 py-2 font-semibold hover:bg-pastel-purple-dark transition">Отправить</button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default MainPage;
