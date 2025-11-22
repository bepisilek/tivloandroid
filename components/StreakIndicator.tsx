import React, { useState } from 'react';
import { Flame } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface StreakIndicatorProps {
  streak: number;
}

export const StreakIndicator: React.FC<StreakIndicatorProps> = ({ streak }) => {
  const { t } = useLanguage();
  const [showPopup, setShowPopup] = useState(false);

  // Szín meghatározása a streak alapján
  const getFlameColor = () => {
    if (streak >= 30) return 'text-violet-500'; // 30+ nap - lila
    if (streak >= 15) return 'text-blue-500';   // 15+ nap - kék
    if (streak >= 10) return 'text-cyan-400';   // 10+ nap - cián
    if (streak >= 5) return 'text-yellow-400';  // 5+ nap - sárga
    if (streak >= 3) return 'text-orange-400';  // 3+ nap - narancs
    if (streak >= 2) return 'text-orange-500';  // 2 nap - sötét narancs
    return 'text-red-500';                       // 1 nap - piros
  };

  // Háttér szín a popup-hoz
  const getPopupBgColor = () => {
    if (streak >= 30) return 'from-violet-500/20 to-purple-600/20 border-violet-500/30';
    if (streak >= 15) return 'from-blue-500/20 to-indigo-600/20 border-blue-500/30';
    if (streak >= 10) return 'from-cyan-400/20 to-teal-500/20 border-cyan-400/30';
    if (streak >= 5) return 'from-yellow-400/20 to-amber-500/20 border-yellow-400/30';
    if (streak >= 3) return 'from-orange-400/20 to-orange-500/20 border-orange-400/30';
    return 'from-red-500/20 to-orange-500/20 border-red-500/30';
  };

  // Animáció intenzitása a streak alapján
  const getAnimationClass = () => {
    if (streak >= 30) return 'animate-flame-intense';
    if (streak >= 10) return 'animate-flame-medium';
    return 'animate-flame-subtle';
  };

  if (streak === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowPopup(!showPopup)}
        className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all hover:bg-slate-100 dark:hover:bg-slate-800 ${getFlameColor()}`}
        aria-label={t('streak_info')}
      >
        <div className={`relative ${getAnimationClass()}`}>
          <Flame size={20} className="fill-current" />
          {/* Glow effect for higher streaks */}
          {streak >= 5 && (
            <div className={`absolute inset-0 blur-sm opacity-50 ${getFlameColor()}`}>
              <Flame size={20} className="fill-current" />
            </div>
          )}
        </div>
        <span className="font-bold text-sm">{streak}</span>
      </button>

      {/* Popup */}
      {showPopup && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPopup(false)}
          />

          {/* Popup content */}
          <div className={`absolute right-0 top-full mt-2 z-50 w-64 p-4 rounded-xl shadow-xl bg-gradient-to-br ${getPopupBgColor()} bg-white dark:bg-slate-900 border backdrop-blur-sm animate-fade-in`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`${getFlameColor()} ${getAnimationClass()}`}>
                <Flame size={32} className="fill-current" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {streak} {t('streak_days')}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {t('streak_label')}
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('streak_explanation')}
            </p>

            {/* Milestone hints */}
            {streak < 30 && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {getNextMilestoneText(streak, t)}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Következő mérföldkő szövege
const getNextMilestoneText = (streak: number, t: (key: string, params?: Record<string, any>) => string): string => {
  if (streak < 3) return t('streak_next_milestone', { days: 3 - streak, level: '3' });
  if (streak < 5) return t('streak_next_milestone', { days: 5 - streak, level: '5' });
  if (streak < 10) return t('streak_next_milestone', { days: 10 - streak, level: '10' });
  if (streak < 15) return t('streak_next_milestone', { days: 15 - streak, level: '15' });
  if (streak < 30) return t('streak_next_milestone', { days: 30 - streak, level: '30' });
  return '';
};
