import React from 'react';

export function Header({ user, setUser }) {
  // Format current date
  const getCurrentDate = () => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('id-ID', options);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-50/95 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 pt-[calc(env(safe-area-inset-top)+10px)] flex flex-col gap-3 transition-colors duration-300">
      {/* Date */}
      <div className="flex items-center justify-center">
        <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-none tracking-wide">{getCurrentDate()}</p>
      </div>
      
      {/* Logo & User */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h1 className="text-base font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-300 dark:to-cyan-200">
            Agus Finance.
          </h1>
          <p className="text-[9px] text-slate-600 dark:text-slate-400 font-medium leading-snug mt-0.5">Buat anggaran untuk masa depan</p>
        </div>
        <button 
          onClick={() => setUser(null)} 
          className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border border-white/10 transition-colors duration-300 ${user === 'Purwo' ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500' : 'bg-pink-600 hover:bg-pink-700 dark:bg-pink-600 dark:hover:bg-pink-500'}`}
        >
          {user ? user.charAt(0) : '?'}
        </button>
      </div>
    </header>
  );
}
