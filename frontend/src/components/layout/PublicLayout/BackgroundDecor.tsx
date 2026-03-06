import React from "react";

export const BackgroundDecor: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[120px] animate-blob" />
      <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[120px] animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-[120px] animate-blob animation-delay-4000" />
    </div>
  );
};
