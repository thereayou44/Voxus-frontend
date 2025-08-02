import React from "react";

const TitleBar: React.FC = () => {
  return (
    <div className="w-full h-10 flex items-center px-4 select-none bg-pastel-blue border-b border-pastel-purple">
      <span className="text-pastel-purple font-bold text-lg tracking-wide">discord-lite</span>
      <div className="ml-auto flex gap-2">
        <button className="w-3 h-3 rounded-full bg-pastel-green hover:opacity-80" title="Minimize"></button>
        <button className="w-3 h-3 rounded-full bg-pastel-yellow hover:opacity-80" title="Maximize"></button>
        <button className="w-3 h-3 rounded-full bg-pastel-red hover:opacity-80" title="Close"></button>
      </div>
    </div>
  );
};

export default TitleBar;
