import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Lock, Sparkles, Brain, Target, Zap, Trophy, HelpCircle } from 'lucide-react';
import { WordleGame } from './WordleGame';
import { DailyQuiz } from './DailyQuiz';
import { MemoryGame } from './MemoryGame';

interface ChallengesProps {}

interface GameCard {
  id: string;
  icon: React.ElementType;
  titleKey: string;
  descKey: string;
  available: boolean;
  color: string;
}

export const Challenges: React.FC<ChallengesProps> = () => {
  const { t } = useLanguage();
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const games: GameCard[] = [
    {
      id: 'wordle',
      icon: Sparkles,
      titleKey: 'challenge_wordle_title',
      descKey: 'challenge_wordle_desc',
      available: true,
      color: 'emerald'
    },
    {
      id: 'memory',
      icon: Brain,
      titleKey: 'challenge_memory_title',
      descKey: 'challenge_memory_desc',
      available: true,
      color: 'blue'
    },
    {
      id: 'quiz',
      icon: HelpCircle,
      titleKey: 'challenge_quiz_title',
      descKey: 'challenge_quiz_desc',
      available: true,
      color: 'purple'
    },
    {
      id: 'speed',
      icon: Zap,
      titleKey: 'challenge_speed_title',
      descKey: 'challenge_speed_desc',
      available: false,
      color: 'amber'
    },
    {
      id: 'puzzle',
      icon: Trophy,
      titleKey: 'challenge_puzzle_title',
      descKey: 'challenge_puzzle_desc',
      available: false,
      color: 'rose'
    },
    {
      id: 'streak',
      icon: Target,
      titleKey: 'challenge_streak_title',
      descKey: 'challenge_streak_desc',
      available: false,
      color: 'cyan'
    }
  ];

  const getColorClasses = (color: string, available: boolean) => {
    if (!available) {
      return {
        bg: 'bg-slate-100 dark:bg-slate-800/50',
        border: 'border-slate-200 dark:border-slate-700',
        icon: 'text-slate-400 dark:text-slate-500',
        title: 'text-slate-400 dark:text-slate-500',
        desc: 'text-slate-400 dark:text-slate-600'
      };
    }

    const colorMap: Record<string, { bg: string; border: string; icon: string; title: string; desc: string }> = {
      emerald: {
        bg: 'bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30',
        border: 'border-emerald-200 dark:border-emerald-700/50',
        icon: 'text-emerald-500 dark:text-emerald-400',
        title: 'text-emerald-700 dark:text-emerald-300',
        desc: 'text-emerald-600 dark:text-emerald-400'
      },
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30',
        border: 'border-blue-200 dark:border-blue-700/50',
        icon: 'text-blue-500 dark:text-blue-400',
        title: 'text-blue-700 dark:text-blue-300',
        desc: 'text-blue-600 dark:text-blue-400'
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30',
        border: 'border-purple-200 dark:border-purple-700/50',
        icon: 'text-purple-500 dark:text-purple-400',
        title: 'text-purple-700 dark:text-purple-300',
        desc: 'text-purple-600 dark:text-purple-400'
      },
      amber: {
        bg: 'bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30',
        border: 'border-amber-200 dark:border-amber-700/50',
        icon: 'text-amber-500 dark:text-amber-400',
        title: 'text-amber-700 dark:text-amber-300',
        desc: 'text-amber-600 dark:text-amber-400'
      },
      rose: {
        bg: 'bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/30',
        border: 'border-rose-200 dark:border-rose-700/50',
        icon: 'text-rose-500 dark:text-rose-400',
        title: 'text-rose-700 dark:text-rose-300',
        desc: 'text-rose-600 dark:text-rose-400'
      },
      cyan: {
        bg: 'bg-cyan-50 dark:bg-cyan-900/20 hover:bg-cyan-100 dark:hover:bg-cyan-900/30',
        border: 'border-cyan-200 dark:border-cyan-700/50',
        icon: 'text-cyan-500 dark:text-cyan-400',
        title: 'text-cyan-700 dark:text-cyan-300',
        desc: 'text-cyan-600 dark:text-cyan-400'
      }
    };

    return colorMap[color] || colorMap.emerald;
  };

  const handleCardClick = (game: GameCard) => {
    if (game.available) {
      setActiveGame(game.id);
    }
  };

  // Show active game
  if (activeGame === 'wordle') {
    return <WordleGame onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === 'quiz') {
    return <DailyQuiz onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === 'memory') {
    return <MemoryGame onBack={() => setActiveGame(null)} />;
  }

  return (
    <div className="h-full flex flex-col w-full">
      {/* Header */}
      <div className="p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800 shrink-0">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('challenges_title')}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('challenges_subtitle')}</p>
      </div>

      {/* Game Grid */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="grid grid-cols-2 gap-3">
          {games.map((game) => {
            const Icon = game.icon;
            const colors = getColorClasses(game.color, game.available);

            return (
              <button
                key={game.id}
                onClick={() => handleCardClick(game)}
                disabled={!game.available}
                className={`
                  relative aspect-square rounded-2xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200
                  ${colors.bg} ${colors.border}
                  ${game.available ? 'cursor-pointer active:scale-95' : 'cursor-not-allowed opacity-70'}
                `}
              >
                {!game.available && (
                  <div className="absolute top-2 right-2">
                    <Lock size={16} className="text-slate-400 dark:text-slate-500" />
                  </div>
                )}

                <div className={`p-3 rounded-xl ${game.available ? 'bg-white/60 dark:bg-slate-800/60' : 'bg-slate-200/50 dark:bg-slate-700/30'}`}>
                  <Icon size={28} className={colors.icon} strokeWidth={2} />
                </div>

                <div className="text-center">
                  <h3 className={`font-bold text-sm ${colors.title}`}>
                    {t(game.titleKey)}
                  </h3>
                  <p className={`text-[10px] mt-0.5 ${colors.desc}`}>
                    {t(game.descKey)}
                  </p>
                </div>

                {!game.available && (
                  <span className="absolute bottom-2 text-[9px] font-medium text-slate-400 dark:text-slate-500">
                    {t('challenge_coming_soon')}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
