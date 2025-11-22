import React from 'react';
import { ViewState } from '../types';
import { Calculator, History, Trophy, Gamepad2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface NavigationProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  isHighlighted?: boolean;
  tourStep?: number;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate, isHighlighted = false, tourStep }) => {
  const { t } = useLanguage();

  const navItems = [
    { id: ViewState.CALCULATOR, icon: Calculator, label: t('nav_calculator') },
    { id: ViewState.HISTORY, icon: History, label: t('nav_history') },
    { id: ViewState.LEVELS, icon: Trophy, label: t('nav_levels') },
    { id: ViewState.CHALLENGES, icon: Gamepad2, label: t('nav_challenges') },
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe px-4 py-3 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] ${isHighlighted ? 'z-[110]' : 'z-40'}`}>
      {navItems.map((item, index) => {
        const Icon = item.icon;
        // During tour: highlight the nav item corresponding to the current tour step
        // Tour step 1 = Calculator (index 0), step 2 = History (index 1), etc.
        const isActive = tourStep !== undefined && tourStep >= 1
          ? index === tourStep - 1
          : currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 flex-1 ${
              isActive
                ? 'text-orange-500 dark:text-orange-400 font-semibold bg-orange-500/10 dark:bg-orange-400/10 ring-1 ring-orange-500/30 dark:ring-orange-400/30'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Icon
                size={24}
                strokeWidth={isActive ? 2.5 : 2}
                className={`transition-transform duration-200 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]' : ''}`}
            />
            <span className="text-[10px] tracking-wide">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};