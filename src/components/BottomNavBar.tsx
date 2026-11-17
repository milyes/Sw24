import React from 'react';
import { useApp } from '../context/AppContext';
import { NavigationTab } from '../types';
import { 
  Mic, 
  CloudUpload, 
  Contact2, 
  Tv, 
  Terminal, 
  Sparkles 
} from 'lucide-react';

export const BottomNavBar: React.FC = () => {
  const { currentTab, setTab, tr } = useApp();

  const navItems: { tab: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      tab: 'RECORDER_VAULT',
      label: tr('Enregistrements', 'Recordings'),
      icon: <Mic className="w-5 h-5" />
    },
    {
      tab: 'CLOUD_SYNC',
      label: tr('Synchro Drive', 'Drive Sync'),
      icon: <CloudUpload className="w-5 h-5" />
    },
    {
      tab: 'CONTACTS',
      label: tr('Contacts', 'Contacts'),
      icon: <Contact2 className="w-5 h-5" />
    },
    {
      tab: 'LIVE_STREAM',
      label: 'BEIN 1 HF',
      icon: <Tv className="w-5 h-5" />,
      badge: 'LIVE'
    },
    {
      tab: 'TERMUX_MACROS',
      label: tr('Macros', 'Macros'),
      icon: <Terminal className="w-5 h-5" />
    },
    {
      tab: 'AI_STUDIO',
      label: tr('Gemini IA', 'Gemini AI'),
      icon: <Sparkles className="w-5 h-5" />
    }
  ];

  return (
    <nav 
      data-testid="bottom_navigation_bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 safe-area-bottom"
    >
      <div className="max-w-xl mx-auto flex items-center justify-around">
        {navItems.map(item => {
          const isActive = currentTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => setTab(item.tab)}
              data-testid={`tab_${item.tab.toLowerCase()}`}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer relative group ${
                isActive 
                  ? 'text-emerald-400 font-semibold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1.5 -right-3.5 px-1 py-0.2 bg-rose-600 text-white text-[9px] font-extrabold rounded-full tracking-wider animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10.5px] mt-1 tracking-tight truncate max-w-[70px]">
                {item.label}
              </span>
              {isActive && (
                <div className="w-6 h-1 bg-emerald-500 rounded-full mt-0.5"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
