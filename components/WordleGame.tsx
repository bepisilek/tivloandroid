import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, Delete, CornerDownLeft, RefreshCw, Share2 } from 'lucide-react';
import { Button } from './Button';

interface WordleGameProps {
  onBack: () => void;
}

// Word lists for each language (5-letter words)
const WORD_LISTS: Record<string, string[]> = {
  hu: [
    'ablak', 'alma', 'babos', 'barna', 'cukor', 'dalom', 'egyes', 'fajta', 'galya', 'halas',
    'ifjak', 'jakab', 'kalap', 'lakat', 'magas', 'napos', 'olvas', 'patak', 'ravak', 'savas',
    'talaj', 'ugrat', 'vacak', 'zabos', 'bajok', 'cukos', 'darab', 'egyed', 'falak', 'garat',
    'hamar', 'ingek', 'javas', 'kamat', 'lapos', 'marad', 'napok', 'oktat', 'palya', 'rakat',
    'salak', 'takar', 'utcak', 'vagya', 'zajos', 'balos', 'csata', 'dolog', 'ember', 'farok',
    'gamma', 'halad', 'inger', 'jatek', 'kavar', 'lapok', 'marka', 'nemas', 'orias', 'paros',
    'ramas', 'sarga', 'talal', 'udvar', 'varos', 'zavar', 'balra', 'csiga', 'donna', 'enyhe',
    'favag', 'gamba', 'halmo', 'inter', 'japan', 'kazal', 'labak', 'madal', 'nella', 'orosz',
    'pazar', 'rajta', 'sator', 'tanul', 'ujabb', 'varga', 'zebra', 'banda', 'csepp', 'draga'
  ],
  en: [
    'about', 'above', 'abuse', 'actor', 'acute', 'admit', 'adopt', 'adult', 'after', 'again',
    'agent', 'agree', 'ahead', 'alarm', 'album', 'alert', 'alike', 'alive', 'allow', 'alone',
    'along', 'alter', 'among', 'angry', 'apart', 'apple', 'apply', 'arena', 'argue', 'arise',
    'array', 'aside', 'asset', 'avoid', 'award', 'aware', 'badly', 'baker', 'bases', 'basic',
    'basis', 'beach', 'began', 'begin', 'begun', 'being', 'below', 'bench', 'billy', 'birth',
    'black', 'blame', 'blind', 'block', 'blood', 'board', 'boost', 'bound', 'brain', 'brand',
    'bread', 'break', 'breed', 'brief', 'bring', 'broad', 'broke', 'brown', 'build', 'built',
    'buyer', 'cable', 'calif', 'carry', 'catch', 'cause', 'chain', 'chair', 'chart', 'chase',
    'cheap', 'check', 'chest', 'chief', 'child', 'china', 'chose', 'civil', 'claim', 'class',
    'clean', 'clear', 'click', 'climb', 'clock', 'close', 'coach', 'coast', 'could', 'count'
  ],
  de: [
    'abend', 'alles', 'alter', 'damit', 'daran', 'dabei', 'davon', 'davor', 'denen', 'deren',
    'derer', 'diese', 'dinge', 'durch', 'eben', 'ebene', 'einem', 'einen', 'einer', 'eines',
    'erste', 'etwa', 'fahrt', 'falle', 'falls', 'faser', 'fehlt', 'fest', 'finde', 'firma',
    'folge', 'frage', 'fragt', 'freie', 'fremd', 'freut', 'ganze', 'geben', 'gegen', 'geher',
    'geist', 'genau', 'gerne', 'gibt', 'glass', 'glaubt', 'gross', 'grund', 'gruss', 'haben',
    'haelt', 'halbe', 'hallo', 'halte', 'handy', 'haupt', 'heute', 'hilfe', 'hinzu', 'holen',
    'jahre', 'jeden', 'jeder', 'jedes', 'jetzt', 'kampf', 'karte', 'kasse', 'kaufe', 'keine',
    'kennt', 'kinder', 'kiste', 'klare', 'klein', 'komme', 'kraft', 'kreis', 'kurze', 'lager',
    'lande', 'lange', 'lasse', 'lauft', 'legen', 'lehre', 'leide', 'lesen', 'letzt', 'leute',
    'liebe', 'liegt', 'liste', 'macht', 'maler', 'manche', 'markt', 'masse', 'meist', 'menge'
  ]
};

// Keyboard layouts for each language
const KEYBOARD_LAYOUTS: Record<string, string[][]> = {
  hu: [
    ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['ENTER', 'y', 'x', 'c', 'v', 'b', 'n', 'm', 'BACK']
  ],
  en: [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['ENTER', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'BACK']
  ],
  de: [
    ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['ENTER', 'y', 'x', 'c', 'v', 'b', 'n', 'm', 'BACK']
  ]
};

type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';

interface GameState {
  targetWord: string;
  guesses: string[];
  currentGuess: string;
  gameStatus: 'playing' | 'won' | 'lost';
  letterStatuses: Record<string, LetterStatus>;
}

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

export const WordleGame: React.FC<WordleGameProps> = ({ onBack }) => {
  const { t, language } = useLanguage();

  const getRandomWord = useCallback(() => {
    const words = WORD_LISTS[language] || WORD_LISTS.en;
    return words[Math.floor(Math.random() * words.length)].toLowerCase();
  }, [language]);

  const [gameState, setGameState] = useState<GameState>(() => ({
    targetWord: getRandomWord(),
    guesses: [],
    currentGuess: '',
    gameStatus: 'playing',
    letterStatuses: {}
  }));

  const [shakeRow, setShakeRow] = useState(false);
  const [revealRow, setRevealRow] = useState<number | null>(null);

  const keyboard = KEYBOARD_LAYOUTS[language] || KEYBOARD_LAYOUTS.en;

  const resetGame = useCallback(() => {
    setGameState({
      targetWord: getRandomWord(),
      guesses: [],
      currentGuess: '',
      gameStatus: 'playing',
      letterStatuses: {}
    });
    setRevealRow(null);
  }, [getRandomWord]);

  // Reset game when language changes
  useEffect(() => {
    resetGame();
  }, [language, resetGame]);

  const getLetterStatus = (letter: string, index: number, word: string, target: string): LetterStatus => {
    if (target[index] === letter) return 'correct';
    if (target.includes(letter)) {
      // Count occurrences in target and correct positions
      const targetCount = target.split('').filter(l => l === letter).length;
      const correctCount = word.split('').filter((l, i) => l === letter && target[i] === letter).length;
      const presentCount = word.slice(0, index).split('').filter((l, i) => l === letter && target[i] !== letter).length;

      if (presentCount + correctCount < targetCount) return 'present';
    }
    return 'absent';
  };

  const submitGuess = useCallback(() => {
    if (gameState.currentGuess.length !== WORD_LENGTH) {
      setShakeRow(true);
      setTimeout(() => setShakeRow(false), 500);
      return;
    }

    const guess = gameState.currentGuess.toLowerCase();
    const newGuesses = [...gameState.guesses, guess];
    const newLetterStatuses = { ...gameState.letterStatuses };

    // Update letter statuses
    guess.split('').forEach((letter, index) => {
      const status = getLetterStatus(letter, index, guess, gameState.targetWord);
      const currentStatus = newLetterStatuses[letter];

      // Only upgrade status (correct > present > absent)
      if (!currentStatus ||
          (currentStatus === 'absent' && status !== 'absent') ||
          (currentStatus === 'present' && status === 'correct')) {
        newLetterStatuses[letter] = status;
      }
    });

    const won = guess === gameState.targetWord;
    const lost = !won && newGuesses.length >= MAX_GUESSES;

    setRevealRow(newGuesses.length - 1);

    setTimeout(() => {
      setGameState({
        ...gameState,
        guesses: newGuesses,
        currentGuess: '',
        gameStatus: won ? 'won' : lost ? 'lost' : 'playing',
        letterStatuses: newLetterStatuses
      });
      setRevealRow(null);
    }, WORD_LENGTH * 300);
  }, [gameState]);

  const handleKeyPress = useCallback((key: string) => {
    if (gameState.gameStatus !== 'playing') return;

    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACK') {
      setGameState(prev => ({
        ...prev,
        currentGuess: prev.currentGuess.slice(0, -1)
      }));
    } else if (gameState.currentGuess.length < WORD_LENGTH) {
      setGameState(prev => ({
        ...prev,
        currentGuess: prev.currentGuess + key.toLowerCase()
      }));
    }
  }, [gameState, submitGuess]);

  // Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleKeyPress('ENTER');
      } else if (e.key === 'Backspace') {
        handleKeyPress('BACK');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toLowerCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  const getStatusColor = (status: LetterStatus) => {
    switch (status) {
      case 'correct': return 'bg-emerald-500 border-emerald-500 text-white';
      case 'present': return 'bg-amber-500 border-amber-500 text-white';
      case 'absent': return 'bg-slate-500 dark:bg-slate-600 border-slate-500 dark:border-slate-600 text-white';
      default: return 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white';
    }
  };

  const getKeyboardKeyColor = (key: string) => {
    const status = gameState.letterStatuses[key.toLowerCase()];
    switch (status) {
      case 'correct': return 'bg-emerald-500 text-white border-emerald-500';
      case 'present': return 'bg-amber-500 text-white border-amber-500';
      case 'absent': return 'bg-slate-500 dark:bg-slate-600 text-white border-slate-500';
      default: return 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600';
    }
  };

  const shareResult = () => {
    const emojiGrid = gameState.guesses.map(guess =>
      guess.split('').map((letter, index) => {
        const status = getLetterStatus(letter, index, guess, gameState.targetWord);
        return status === 'correct' ? '🟩' : status === 'present' ? '🟨' : '⬛';
      }).join('')
    ).join('\n');

    const text = `Tivlo Wordle ${gameState.guesses.length}/${MAX_GUESSES}\n\n${emojiGrid}`;

    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  const renderGrid = () => {
    const rows = [];

    for (let i = 0; i < MAX_GUESSES; i++) {
      const guess = gameState.guesses[i];
      const isCurrentRow = i === gameState.guesses.length && gameState.gameStatus === 'playing';
      const isRevealing = revealRow === i;

      rows.push(
        <div
          key={i}
          className={`flex gap-1.5 justify-center ${isCurrentRow && shakeRow ? 'animate-shake' : ''}`}
        >
          {Array(WORD_LENGTH).fill(null).map((_, j) => {
            let letter = '';
            let status: LetterStatus = 'empty';

            if (guess) {
              letter = guess[j];
              status = getLetterStatus(letter, j, guess, gameState.targetWord);
            } else if (isCurrentRow) {
              letter = gameState.currentGuess[j] || '';
            }

            return (
              <div
                key={j}
                className={`
                  w-12 h-12 md:w-14 md:h-14 flex items-center justify-center
                  text-xl md:text-2xl font-bold uppercase border-2 rounded-lg
                  transition-all duration-300
                  ${getStatusColor(guess ? status : 'empty')}
                  ${isCurrentRow && letter ? 'scale-105 border-slate-500' : ''}
                  ${isRevealing ? 'animate-flip' : ''}
                `}
                style={isRevealing ? { animationDelay: `${j * 300}ms` } : {}}
              >
                {letter}
              </div>
            );
          })}
        </div>
      );
    }

    return rows;
  };

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
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('wordle_title')}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('wordle_subtitle')}</p>
        </div>
        <button
          onClick={resetGame}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={t('wordle_new_game')}
        >
          <RefreshCw size={20} className="text-slate-600 dark:text-slate-400" />
        </button>
      </div>

      {/* Game Grid */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-1.5">
        {renderGrid()}
      </div>

      {/* Game Over Modal */}
      {gameState.gameStatus !== 'playing' && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-xs w-full shadow-xl border border-slate-200 dark:border-slate-700 text-center">
            <h3 className={`text-2xl font-bold mb-2 ${gameState.gameStatus === 'won' ? 'text-emerald-500' : 'text-rose-500'}`}>
              {gameState.gameStatus === 'won' ? t('wordle_won') : t('wordle_lost')}
            </h3>

            {gameState.gameStatus === 'lost' && (
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                {t('wordle_answer')}: <span className="font-bold uppercase">{gameState.targetWord}</span>
              </p>
            )}

            {gameState.gameStatus === 'won' && (
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                {t('wordle_guesses', { count: gameState.guesses.length.toString() })}
              </p>
            )}

            <div className="flex gap-2">
              <Button onClick={shareResult} variant="secondary" fullWidth>
                <Share2 size={16} className="mr-1" />
                {t('wordle_share')}
              </Button>
              <Button onClick={resetGame} fullWidth>
                <RefreshCw size={16} className="mr-1" />
                {t('wordle_play_again')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard */}
      <div className="p-2 pb-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        {keyboard.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 mb-1">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className={`
                  ${key === 'ENTER' || key === 'BACK' ? 'px-2 md:px-3 text-xs' : 'w-8 md:w-10'}
                  h-12 md:h-14 rounded-lg font-bold uppercase border
                  transition-all duration-150 active:scale-95
                  ${getKeyboardKeyColor(key)}
                `}
              >
                {key === 'BACK' ? <Delete size={18} /> : key === 'ENTER' ? <CornerDownLeft size={18} /> : key}
              </button>
            ))}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes flip {
          0% { transform: rotateX(0); }
          50% { transform: rotateX(90deg); }
          100% { transform: rotateX(0); }
        }
        .animate-flip {
          animation: flip 0.6s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};
