import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, Share2, Trophy, Flame, RotateCcw, Clock, MousePointer2, Star } from 'lucide-react';
import { Button } from './Button';

interface MemoryGameProps {
  onBack: () => void;
}

interface Card {
  id: number;
  catId: number;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryStats {
  currentStreak: number;
  bestStreak: number;
  gamesWon: number;
  lastPlayedDate: string;
  todayCompleted: boolean;
  todayMoves: number;
  todayTime: number;
  todayDifficulty: string;
}

// Cute cat designs - each cat is unique with different expressions
const CAT_DESIGNS = [
  { id: 1, emoji: '😺', name: 'Happy Cat', bg: 'from-orange-400 to-amber-500' },
  { id: 2, emoji: '😸', name: 'Grinning Cat', bg: 'from-yellow-400 to-orange-500' },
  { id: 3, emoji: '😻', name: 'Heart Eyes Cat', bg: 'from-pink-400 to-rose-500' },
  { id: 4, emoji: '😼', name: 'Smirk Cat', bg: 'from-purple-400 to-violet-500' },
  { id: 5, emoji: '😽', name: 'Kissing Cat', bg: 'from-red-400 to-pink-500' },
  { id: 6, emoji: '🙀', name: 'Surprised Cat', bg: 'from-cyan-400 to-blue-500' },
  { id: 7, emoji: '😿', name: 'Crying Cat', bg: 'from-blue-400 to-indigo-500' },
  { id: 8, emoji: '😾', name: 'Grumpy Cat', bg: 'from-slate-400 to-gray-500' },
  { id: 9, emoji: '🐱', name: 'Cat Face', bg: 'from-amber-400 to-yellow-500' },
  { id: 10, emoji: '🐈', name: 'Walking Cat', bg: 'from-orange-300 to-amber-400' },
  { id: 11, emoji: '🐈‍⬛', name: 'Black Cat', bg: 'from-gray-600 to-slate-700' },
  { id: 12, emoji: '😹', name: 'Joy Cat', bg: 'from-emerald-400 to-teal-500' },
];

// Daily difficulty configurations
const DIFFICULTY_CONFIGS = [
  { name: 'easy', pairs: 4, cols: 2, rows: 4 },      // Monday - 2x4
  { name: 'easy', pairs: 6, cols: 3, rows: 4 },      // Tuesday - 3x4
  { name: 'medium', pairs: 6, cols: 3, rows: 4 },    // Wednesday - 3x4
  { name: 'medium', pairs: 8, cols: 4, rows: 4 },    // Thursday - 4x4
  { name: 'hard', pairs: 8, cols: 4, rows: 4 },      // Friday - 4x4
  { name: 'hard', pairs: 10, cols: 4, rows: 5 },     // Saturday - 4x5
  { name: 'expert', pairs: 12, cols: 4, rows: 6 },   // Sunday - 4x6
];

const MEMORY_STATS_KEY = 'tivlo_memory_game_stats';

const getTodayDateString = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

const getInitialStats = (): MemoryStats => ({
  currentStreak: 0,
  bestStreak: 0,
  gamesWon: 0,
  lastPlayedDate: '',
  todayCompleted: false,
  todayMoves: 0,
  todayTime: 0,
  todayDifficulty: '',
});

// Seeded random number generator for consistent daily puzzles
const seededRandom = (seed: number): (() => number) => {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
};

export const MemoryGame: React.FC<MemoryGameProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<MemoryStats>(getInitialStats);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'already_played'>('playing');
  const [isChecking, setIsChecking] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const todayString = getTodayDateString();

  // Get daily configuration based on date
  const dailyConfig = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to 0 = Monday, 6 = Sunday

    // Also use the date to vary the cats used
    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    return {
      ...DIFFICULTY_CONFIGS[dayIndex],
      dateSeed,
    };
  }, [todayString]);

  // Generate shuffled cards for the day
  const generateCards = useCallback(() => {
    const random = seededRandom(dailyConfig.dateSeed);

    // Select random cats for today
    const shuffledCats = [...CAT_DESIGNS]
      .sort(() => random() - 0.5)
      .slice(0, dailyConfig.pairs);

    // Create pairs
    const cardPairs: Card[] = [];
    shuffledCats.forEach((cat, index) => {
      cardPairs.push(
        { id: index * 2, catId: cat.id, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, catId: cat.id, isFlipped: false, isMatched: false }
      );
    });

    // Shuffle cards
    const shuffledCards = cardPairs.sort(() => random() - 0.5);
    return shuffledCards;
  }, [dailyConfig]);

  // Load stats and initialize game
  useEffect(() => {
    try {
      const savedStats = localStorage.getItem(MEMORY_STATS_KEY);
      if (savedStats) {
        const parsed: MemoryStats = JSON.parse(savedStats);

        if (parsed.lastPlayedDate !== todayString) {
          // New day - check if streak continues
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayString = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

          const streakContinues = parsed.lastPlayedDate === yesterdayString && parsed.todayCompleted;

          setStats({
            ...parsed,
            currentStreak: streakContinues ? parsed.currentStreak : 0,
            todayCompleted: false,
            todayMoves: 0,
            todayTime: 0,
            todayDifficulty: '',
          });
          setCards(generateCards());
          setGameState('playing');
        } else {
          // Same day
          setStats(parsed);
          if (parsed.todayCompleted) {
            setGameState('already_played');
            setMoves(parsed.todayMoves);
            setTime(parsed.todayTime);
          } else {
            setCards(generateCards());
            setGameState('playing');
          }
        }
      } else {
        setCards(generateCards());
      }
    } catch (e) {
      console.error('Failed to load memory stats:', e);
      setCards(generateCards());
    }
  }, [todayString, generateCards]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing' && cards.length > 0) {
      interval = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, cards.length]);

  const saveStats = (newStats: MemoryStats) => {
    try {
      localStorage.setItem(MEMORY_STATS_KEY, JSON.stringify(newStats));
      setStats(newStats);
    } catch (e) {
      console.error('Failed to save memory stats:', e);
    }
  };

  const handleCardClick = (cardId: number) => {
    if (isChecking || gameState !== 'playing') return;

    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newCards = cards.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsChecking(true);

      const [firstId, secondId] = newFlipped;
      const firstCard = newCards.find(c => c.id === firstId);
      const secondCard = newCards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.catId === secondCard.catId) {
        // Match found
        setTimeout(() => {
          const matchedCards = newCards.map(c =>
            c.id === firstId || c.id === secondId
              ? { ...c, isMatched: true }
              : c
          );
          setCards(matchedCards);
          setFlippedCards([]);
          setIsChecking(false);

          // Check if game is won
          if (matchedCards.every(c => c.isMatched)) {
            handleGameWon(moves + 1, time);
          }
        }, 500);
      } else {
        // No match - flip back
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === firstId || c.id === secondId
              ? { ...c, isFlipped: false }
              : c
          ));
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  const handleGameWon = (finalMoves: number, finalTime: number) => {
    setGameState('won');
    setShowCelebration(true);

    const newStreak = stats.currentStreak + 1;
    const newBestStreak = Math.max(stats.bestStreak, newStreak);

    saveStats({
      currentStreak: newStreak,
      bestStreak: newBestStreak,
      gamesWon: stats.gamesWon + 1,
      lastPlayedDate: todayString,
      todayCompleted: true,
      todayMoves: finalMoves,
      todayTime: finalTime,
      todayDifficulty: dailyConfig.name,
    });

    setTimeout(() => setShowCelebration(false), 3000);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyLabel = (name: string): string => {
    const labels: Record<string, Record<string, string>> = {
      easy: { hu: 'Könnyű', en: 'Easy', de: 'Einfach' },
      medium: { hu: 'Közepes', en: 'Medium', de: 'Mittel' },
      hard: { hu: 'Nehéz', en: 'Hard', de: 'Schwer' },
      expert: { hu: 'Szakértő', en: 'Expert', de: 'Experte' },
    };
    return labels[name]?.[t('app_name') === 'Tivlo' ? 'hu' : 'en'] || name;
  };

  const getDifficultyColor = (name: string): string => {
    const colors: Record<string, string> = {
      easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
      medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      hard: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
      expert: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    };
    return colors[name] || colors.easy;
  };

  const shareResult = () => {
    const diffLabel = getDifficultyLabel(stats.todayDifficulty || dailyConfig.name);
    const emoji = '🐱';
    const streakText = stats.currentStreak > 0 ? `🔥 ${stats.currentStreak}` : '';

    const text = `Tivlo Memory ${emoji}\n${diffLabel}: ${stats.todayMoves} ${t('memory_moves')} | ${formatTime(stats.todayTime)}\n${streakText}`;

    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  const getCatById = (id: number) => CAT_DESIGNS.find(cat => cat.id === id);

  const alreadyPlayedToday = gameState === 'already_played';

  return (
    <div className="h-full flex flex-col w-full bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('memory_title')}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('memory_subtitle')}</p>
        </div>
        {stats.currentStreak > 0 && (
          <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 px-3 py-1.5 rounded-full">
            <Flame size={16} className="text-amber-500" />
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{stats.currentStreak}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-3 text-center border border-slate-200 dark:border-slate-700">
            <Flame size={20} className="mx-auto text-amber-500 mb-1" />
            <div className="text-lg font-bold text-slate-900 dark:text-white">{stats.currentStreak}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">{t('memory_streak')}</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-3 text-center border border-slate-200 dark:border-slate-700">
            <Trophy size={20} className="mx-auto text-blue-500 mb-1" />
            <div className="text-lg font-bold text-slate-900 dark:text-white">{stats.bestStreak}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">{t('memory_best_streak')}</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-3 text-center border border-slate-200 dark:border-slate-700">
            <Star size={20} className="mx-auto text-purple-500 mb-1" />
            <div className="text-lg font-bold text-slate-900 dark:text-white">{stats.gamesWon}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">{t('memory_games_won')}</div>
          </div>
        </div>

        {/* Daily Challenge Badge */}
        <div className="flex justify-center gap-2 mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${getDifficultyColor(dailyConfig.name)}`}>
            {t('memory_daily_challenge')}: {getDifficultyLabel(dailyConfig.name)}
          </span>
        </div>

        {/* Game Stats Bar */}
        {!alreadyPlayedToday && (
          <div className="flex justify-center gap-4 mb-4">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
              <MousePointer2 size={16} className="text-blue-500" />
              <span className="text-sm font-bold text-slate-900 dark:text-white">{moves}</span>
              <span className="text-xs text-slate-500">{t('memory_moves')}</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
              <Clock size={16} className="text-emerald-500" />
              <span className="text-sm font-bold text-slate-900 dark:text-white">{formatTime(time)}</span>
            </div>
          </div>
        )}

        {/* Game Grid */}
        {!alreadyPlayedToday && gameState === 'playing' && (
          <div
            className="grid gap-2 mx-auto max-w-sm"
            style={{
              gridTemplateColumns: `repeat(${dailyConfig.cols}, 1fr)`,
            }}
          >
            {cards.map((card) => {
              const cat = getCatById(card.catId);
              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={card.isFlipped || card.isMatched || isChecking}
                  className={`
                    aspect-square rounded-xl transition-all duration-300 transform
                    ${card.isFlipped || card.isMatched
                      ? 'rotate-y-0'
                      : 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 shadow-lg hover:shadow-xl active:scale-95'
                    }
                    ${card.isMatched ? 'opacity-70 scale-95' : ''}
                  `}
                  style={{
                    perspective: '1000px',
                  }}
                >
                  {(card.isFlipped || card.isMatched) ? (
                    <div className={`w-full h-full rounded-xl bg-gradient-to-br ${cat?.bg} flex items-center justify-center shadow-inner`}>
                      <span className="text-3xl sm:text-4xl filter drop-shadow-md">{cat?.emoji}</span>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl sm:text-4xl text-white/30">🐱</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Win State */}
        {gameState === 'won' && (
          <div className={`text-center animate-fade-in`}>
            {showCelebration && (
              <div className="text-6xl mb-4 animate-bounce">
                🎉🐱🎉
              </div>
            )}
            <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800 mb-4">
              <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mb-2">
                {t('memory_won')}
              </h3>
              <div className="flex justify-center gap-6 text-sm">
                <div>
                  <span className="text-emerald-600 dark:text-emerald-400">{t('memory_moves')}: </span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">{moves}</span>
                </div>
                <div>
                  <span className="text-emerald-600 dark:text-emerald-400">{t('memory_time')}: </span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">{formatTime(time)}</span>
                </div>
              </div>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-3">
                {t('memory_come_back')}
              </p>
            </div>
            <Button onClick={shareResult} variant="secondary" className="mx-auto">
              <Share2 size={16} className="mr-2" />
              {t('memory_share')}
            </Button>
          </div>
        )}

        {/* Already Played Today */}
        {alreadyPlayedToday && (
          <div className="text-center animate-fade-in">
            <div className="text-6xl mb-4">🐱✨</div>
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-2xl p-6 border border-blue-200 dark:border-blue-800 mb-4">
              <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-2">
                {t('memory_already_played')}
              </h3>
              <div className="flex justify-center gap-6 text-sm mb-3">
                <div>
                  <span className="text-blue-600 dark:text-blue-400">{t('memory_moves')}: </span>
                  <span className="font-bold text-blue-700 dark:text-blue-300">{stats.todayMoves}</span>
                </div>
                <div>
                  <span className="text-blue-600 dark:text-blue-400">{t('memory_time')}: </span>
                  <span className="font-bold text-blue-700 dark:text-blue-300">{formatTime(stats.todayTime)}</span>
                </div>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {t('memory_come_back')}
              </p>
            </div>
            <Button onClick={shareResult} variant="secondary" className="mx-auto">
              <Share2 size={16} className="mr-2" />
              {t('memory_share')}
            </Button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce {
          animation: bounce 0.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
