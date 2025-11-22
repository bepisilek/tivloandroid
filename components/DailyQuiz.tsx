import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, Share2, CheckCircle, XCircle, Trophy, Flame, Calendar } from 'lucide-react';
import { Button } from './Button';
import { getDailyQuestion, getTodayDateString, QuizQuestion } from '../utils/quizQuestions';

interface DailyQuizProps {
  onBack: () => void;
}

interface QuizStats {
  currentStreak: number;
  bestStreak: number;
  totalCorrect: number;
  lastPlayedDate: string;
  todayResult: 'correct' | 'wrong' | null;
  todaySelectedAnswer: string | null;
}

const QUIZ_STATS_KEY = 'tivlo_daily_quiz_stats';

const getInitialStats = (): QuizStats => ({
  currentStreak: 0,
  bestStreak: 0,
  totalCorrect: 0,
  lastPlayedDate: '',
  todayResult: null,
  todaySelectedAnswer: null,
});

export const DailyQuiz: React.FC<DailyQuizProps> = ({ onBack }) => {
  const { t, language } = useLanguage();
  const [stats, setStats] = useState<QuizStats>(getInitialStats);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [animatingOption, setAnimatingOption] = useState<string | null>(null);

  const todayString = getTodayDateString();
  const question: QuizQuestion = useMemo(() => getDailyQuestion(language), [language]);

  // Shuffle options consistently per day (seeded by date)
  const shuffledOptions = useMemo(() => {
    const seed = todayString.split('-').reduce((acc, num) => acc + parseInt(num), 0);
    const options = [...question.options];
    // Simple deterministic shuffle based on seed
    for (let i = options.length - 1; i > 0; i--) {
      const j = (seed * (i + 1)) % (i + 1);
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  }, [question.options, todayString]);

  // Load stats from localStorage
  useEffect(() => {
    try {
      const savedStats = localStorage.getItem(QUIZ_STATS_KEY);
      if (savedStats) {
        const parsed: QuizStats = JSON.parse(savedStats);

        // Check if it's a new day
        if (parsed.lastPlayedDate !== todayString) {
          // Check if streak should continue (yesterday) or reset
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayString = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

          const streakContinues = parsed.lastPlayedDate === yesterdayString && parsed.todayResult === 'correct';

          setStats({
            ...parsed,
            currentStreak: streakContinues ? parsed.currentStreak : 0,
            todayResult: null,
            todaySelectedAnswer: null,
          });
        } else {
          // Same day - restore previous answer
          setStats(parsed);
          if (parsed.todayResult !== null) {
            setSelectedAnswer(parsed.todaySelectedAnswer);
            setIsRevealed(true);
          }
        }
      }
    } catch (e) {
      console.error('Failed to load quiz stats:', e);
    }
  }, [todayString]);

  // Save stats to localStorage
  const saveStats = (newStats: QuizStats) => {
    try {
      localStorage.setItem(QUIZ_STATS_KEY, JSON.stringify(newStats));
      setStats(newStats);
    } catch (e) {
      console.error('Failed to save quiz stats:', e);
    }
  };

  const handleAnswerClick = (answer: string) => {
    if (isRevealed || stats.todayResult !== null) return;

    setAnimatingOption(answer);
    setSelectedAnswer(answer);

    // Delay reveal for animation
    setTimeout(() => {
      setIsRevealed(true);
      setAnimatingOption(null);

      const isCorrect = answer === question.correct_answer;
      const newStreak = isCorrect ? stats.currentStreak + 1 : 0;
      const newBestStreak = Math.max(stats.bestStreak, newStreak);
      const newTotalCorrect = isCorrect ? stats.totalCorrect + 1 : stats.totalCorrect;

      saveStats({
        currentStreak: newStreak,
        bestStreak: newBestStreak,
        totalCorrect: newTotalCorrect,
        lastPlayedDate: todayString,
        todayResult: isCorrect ? 'correct' : 'wrong',
        todaySelectedAnswer: answer,
      });
    }, 500);
  };

  const shareResult = () => {
    const isCorrect = stats.todayResult === 'correct';
    const emoji = isCorrect ? '✅' : '❌';
    const streakText = stats.currentStreak > 0 ? `🔥 ${stats.currentStreak}` : '';

    const text = `Tivlo Daily Quiz ${emoji}\n${question.category}\n${streakText}`;

    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  const getOptionStyle = (option: string) => {
    const baseStyle = 'w-full p-4 rounded-xl border-2 text-left font-medium transition-all duration-300 ';

    if (!isRevealed) {
      if (animatingOption === option) {
        return baseStyle + 'bg-purple-100 dark:bg-purple-900/30 border-purple-400 dark:border-purple-500 scale-[0.98]';
      }
      return baseStyle + 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 active:scale-[0.98]';
    }

    const isCorrect = option === question.correct_answer;
    const isSelected = option === selectedAnswer;

    if (isCorrect) {
      return baseStyle + 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-500 dark:border-emerald-400 text-emerald-700 dark:text-emerald-300';
    }
    if (isSelected && !isCorrect) {
      return baseStyle + 'bg-rose-100 dark:bg-rose-900/30 border-rose-500 dark:border-rose-400 text-rose-700 dark:text-rose-300';
    }
    return baseStyle + 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 opacity-60';
  };

  const alreadyPlayedToday = stats.lastPlayedDate === todayString && stats.todayResult !== null;

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
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('daily_quiz_title')}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('daily_quiz_subtitle')}</p>
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
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-3 text-center border border-slate-200 dark:border-slate-700">
            <Flame size={20} className="mx-auto text-amber-500 mb-1" />
            <div className="text-lg font-bold text-slate-900 dark:text-white">{stats.currentStreak}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">{t('daily_quiz_streak')}</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-3 text-center border border-slate-200 dark:border-slate-700">
            <Trophy size={20} className="mx-auto text-purple-500 mb-1" />
            <div className="text-lg font-bold text-slate-900 dark:text-white">{stats.bestStreak}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">{t('daily_quiz_best_streak')}</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-3 text-center border border-slate-200 dark:border-slate-700">
            <CheckCircle size={20} className="mx-auto text-emerald-500 mb-1" />
            <div className="text-lg font-bold text-slate-900 dark:text-white">{stats.totalCorrect}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">{t('daily_quiz_total_correct')}</div>
          </div>
        </div>

        {/* Category Badge */}
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
            <Calendar size={14} />
            {question.category}
          </span>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center leading-relaxed">
            {question.question}
          </h3>
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
          {shuffledOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(option)}
              disabled={isRevealed || alreadyPlayedToday}
              className={getOptionStyle(option)}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1 text-slate-700 dark:text-slate-200">{option}</span>
                {isRevealed && option === question.correct_answer && (
                  <CheckCircle size={20} className="text-emerald-500 flex-shrink-0" />
                )}
                {isRevealed && option === selectedAnswer && option !== question.correct_answer && (
                  <XCircle size={20} className="text-rose-500 flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Result Message */}
        {isRevealed && (
          <div className={`mt-6 p-4 rounded-xl text-center animate-fade-in ${
            stats.todayResult === 'correct'
              ? 'bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-100 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800'
          }`}>
            <div className={`text-lg font-bold mb-1 ${
              stats.todayResult === 'correct' ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
            }`}>
              {stats.todayResult === 'correct' ? t('daily_quiz_correct') : t('daily_quiz_wrong')}
            </div>
            {stats.todayResult === 'wrong' && (
              <p className="text-sm text-rose-600 dark:text-rose-400">
                {t('daily_quiz_correct_answer')}: <span className="font-bold">{question.correct_answer}</span>
              </p>
            )}
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              {t('daily_quiz_come_back')}
            </p>

            {/* Share Button */}
            <div className="mt-4">
              <Button onClick={shareResult} variant="secondary" className="mx-auto">
                <Share2 size={16} className="mr-2" />
                {t('daily_quiz_share')}
              </Button>
            </div>
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
      `}</style>
    </div>
  );
};
