import React from 'react';
import { Home, History, Wallet, Settings } from 'lucide-react';

export const BottomNav = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'Home', Icon: Home },
    { id: 'activity', label: 'Activity', Icon: History },
    { id: 'manage', label: 'Manage', Icon: Wallet },
    { id: 'settings', label: 'Settings', Icon: Settings }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-[max(env(safe-area-inset-bottom),12px)] transition-colors duration-300 shadow-2xl shadow-slate-200/10 dark:shadow-slate-950/30">
      <div className="flex justify-around items-center h-16 px-4 sm:px-6">
        {tabs.map((tab) => {
          const Icon = tab.Icon;
          const isActive = activeTab === tab.id;
          return (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`flex flex-col items-center gap-1 w-16 transition-all duration-300 ${isActive ? 'text-blue-600 dark:text-blue-400 -translate-y-1' : 'text-slate-500 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'}`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-bold ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-500'}`}>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  );
};
