import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { X } from 'lucide-react';

interface CoinFlipProps {
  onSuggestion: (suggestion: 'bought' | 'saved') => void;
  onClose: () => void;
}

type FlipState = 'idle' | 'flipping' | 'result';

export const CoinFlip: React.FC<CoinFlipProps> = ({ onSuggestion, onClose }) => {
  const { t } = useLanguage();
  const [flipState, setFlipState] = useState<FlipState>('idle');
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [winking, setWinking] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Reset state when opened
  useEffect(() => {
    if (flipState === 'idle') {
      setRotation(0);
    }
  }, [flipState]);

  const handleFlip = () => {
    setFlipState('flipping');
    
    const randomValue = crypto.getRandomValues(new Uint32Array(1))[0];
    const isHeads = randomValue % 2 === 0;
    const newResult = isHeads ? 'heads' : 'tails';
    
    // Optimalizált forgás logika
    const baseRotation = 1800 + (Math.floor(Math.random() * 3) * 360); 
    const targetRotation = isHeads 
      ? baseRotation // Fej = 0 fokhoz közeli (többszörös)
      : baseRotation + 180; // Írás = 180 fok

    document.documentElement.style.setProperty('--target-rotation', `${targetRotation}deg`);

    setTimeout(() => {
      setResult(newResult);
      setFlipState('result');
      setRotation(targetRotation);
      
      setTimeout(() => {
        setWinking(true);
        setTimeout(() => setWinking(false), 400);
      }, 300);
    }, 2000);
  };

  const handleAcceptSuggestion = () => {
    if (!result) return;
    const suggestion = result === 'heads' ? 'bought' : 'saved';
    onSuggestion(suggestion);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/85 backdrop-blur-md animate-fade-in perspective-container">
      
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white z-20 transition-colors"
      >
        <X size={24} />
      </button>

      <div className="w-full max-w-md text-center space-y-6 relative z-10">
        
        <div className={`transition-all duration-500 ${flipState !== 'idle' ? 'opacity-50 scale-90 blur-[1px]' : 'opacity-100'}`}>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">{t('coinflip_title')}</h2>
            <p className="text-white/60 text-xs md:text-sm font-medium uppercase tracking-widest">{t('coinflip_subtitle')}</p>
        </div>

        <div className="scene h-[280px] w-full flex items-center justify-center">
          <div className={`coin-container ${flipState === 'flipping' ? 'animate-toss' : ''} ${flipState === 'result' ? 'animate-land' : ''}`}>
            
            <div 
              className="coin preserve-3d"
              style={{ 
                transform: flipState === 'result' 
                  ? `rotateX(${rotation}deg)` 
                  : undefined 
              }}
            >
              {/* MOBIL OPTIMALIZÁCIÓ: 
                 Csak 3 elem van (Front, Back, Middle) a korábbi 16 helyett.
                 Ez drasztikusan csökkenti a GPU terhelést.
              */}

              {/* 1. MIDDLE SPACER (A vastagság illúziója) */}
              <div className="coin-spacer"></div>

              {/* 2. FRONT FACE (HEADS) */}
              <div className="coin-face front">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-700 border-[6px] border-yellow-600 flex items-center justify-center shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent opacity-70 pointer-events-none"></div>
                  <div className="flex flex-col items-center transform scale-90">
                    <div className="flex gap-6 mb-3">
                        <div className={`w-4 h-4 bg-yellow-900 rounded-full transition-all ${winking && result === 'heads' ? 'scale-y-10' : ''}`}></div>
                        <div className={`w-4 h-4 bg-yellow-900 rounded-full transition-all ${winking && result === 'heads' ? 'scale-y-10' : ''}`}></div>
                    </div>
                    <div className="w-12 h-6 border-b-4 border-yellow-900 rounded-full"></div>
                    <span className="mt-4 text-yellow-900 font-black text-xs tracking-[0.3em] uppercase">{t('coinflip_heads')}</span>
                  </div>
                </div>
              </div>

              {/* 3. BACK FACE (TAILS) - JAVÍTOTT FORGATÁS */}
              {/* rotateX(180deg) a kulcs, hogy ne legyen fejjel lefelé */}
              <div className="coin-face back">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-300 via-green-500 to-emerald-700 border-[6px] border-emerald-600 flex items-center justify-center shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent opacity-70 pointer-events-none"></div>
                  <div className="flex flex-col items-center transform scale-90">
                     <div className="flex gap-6 mb-3">
                        <div className={`w-4 h-4 bg-emerald-900 rounded-full transition-all ${winking && result === 'tails' ? 'scale-y-10' : ''}`}></div>
                        <div className={`w-4 h-4 bg-emerald-900 rounded-full transition-all ${winking && result === 'tails' ? 'scale-y-10' : ''}`}></div>
                    </div>
                    <div className="w-12 h-6 border-b-4 border-emerald-900 rounded-full"></div>
                    <span className="mt-4 text-emerald-900 font-black text-xs tracking-[0.3em] uppercase">{t('coinflip_tails')}</span>
                  </div>
                </div>
              </div>

            </div>
            
            <div className={`shadow-element ${flipState === 'flipping' ? 'animate-shadow-scale' : ''}`}></div>
          </div>
        </div>

        <div className="min-h-[140px] flex flex-col items-center justify-end pb-4">
            {flipState === 'idle' && (
            <button
                onClick={handleFlip}
                className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 font-black text-xl rounded-full shadow-lg active:scale-95 transition-all"
            >
                <span className="relative z-10 flex items-center gap-2">
                 {t('coinflip_flip_it')} 
                </span>
            </button>
            )}

            {flipState === 'flipping' && (
                <div className="text-white/50 text-sm font-mono animate-pulse">
                    {t('coinflip_flipping')}...
                </div>
            )}

            {flipState === 'result' && result && (
            <div className="w-full space-y-4 animate-fade-in-up">
                <div className={`text-4xl font-black uppercase tracking-tight ${result === 'heads' ? 'text-amber-400' : 'text-emerald-400'}`}>
                {result === 'heads' ? t('coinflip_result_buy') : t('coinflip_result_save')}
                </div>
                
                <div className="flex gap-3 pt-2">
                <button
                    onClick={handleAcceptSuggestion}
                    className={`flex-1 py-3.5 font-bold text-white rounded-xl shadow-lg active:scale-95 transition-transform ${
                        result === 'heads' 
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600' 
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600'
                    }`}
                >
                    {t('coinflip_follow_suggestion')}
                </button>
                <button
                    onClick={onClose}
                    className="px-6 py-3.5 font-medium text-white/60 hover:text-white bg-white/10 rounded-xl active:scale-95 transition-transform"
                >
                    {t('coinflip_ignore')}
                </button>
                </div>
            </div>
            )}
        </div>

      </div>

      <style>{`
        .perspective-container {
            perspective: 1000px;
        }
        
        .scene {
            transform-style: preserve-3d;
        }

        .coin-container {
            position: relative;
            width: 180px;
            height: 180px;
            transform-style: preserve-3d;
        }

        .coin {
            position: relative;
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
            transform: rotateX(0deg); 
        }

        /* --- OPTIMALIZÁLT RÉTEGEK --- */
        
        .coin-face {
            position: absolute;
            inset: 0;
            border-radius: 50%;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden; /* Safari fix */
            transform-style: preserve-3d;
        }

        /* Eleje: kicsit eltolva előre */
        .front {
            transform: translateZ(6px);
        }

        /* Hátulja: eltolva hátra ÉS X tengelyen forgatva */
        /* Így landoláskor helyes irányban áll a szöveg */
        .back {
            transform: translateZ(-6px) rotateX(180deg);
        }

        /* A "vastagság" illúziója egyetlen divvel a két lap között */
        .coin-spacer {
            position: absolute;
            inset: 0;
            border-radius: 50%;
            background: #b45309;
            transform: translateZ(-1px);
            /* Ez a trükk: több shadow-t rakunk egymásra, hogy vastagnak tűnjön */
            box-shadow: 
                0 0 0 2px #92400e,
                0 0 5px rgba(0,0,0,0.5);
            /* Kicsit vastagabbnak mutatjuk oldalról */
            width: 100%;
            height: 100%;
        }

        .shadow-element {
            position: absolute;
            bottom: -60px;
            left: 50%;
            transform: translateX(-50%) rotateX(90deg);
            width: 100px;
            height: 100px;
            background: radial-gradient(rgba(0,0,0,0.6), transparent 70%);
            border-radius: 50%;
            opacity: 1;
            transition: opacity 0.3s;
            pointer-events: none;
        }

        /* --- ANIMÁCIÓK --- */

        .animate-toss .coin {
            animation: tossCoin 2s cubic-bezier(0.2, 0, 0.3, 1) forwards;
            /* Will-change segít a böngészőnek előre készülni */
            will-change: transform;
        }

        @keyframes tossCoin {
            0% {
                transform: translateY(0) rotateX(0) scale(1);
            }
            40% {
                transform: translateY(-300px) rotateX(900deg) scale(1.3);
            }
            100% {
                transform: translateY(0) rotateX(var(--target-rotation)) scale(1);
            }
        }

        .animate-shadow-scale {
            animation: shadowBreathe 2s cubic-bezier(0.2, 0, 0.3, 1) forwards;
        }

        @keyframes shadowBreathe {
            0% { opacity: 0.8; transform: translateX(-50%) rotateX(90deg) scale(1); }
            40% { opacity: 0.3; transform: translateX(-50%) rotateX(90deg) scale(0.5); }
            100% { opacity: 0.8; transform: translateX(-50%) rotateX(90deg) scale(1); }
        }

        .animate-land .coin {
             animation: landBounce 0.4s ease-out;
        }

        @keyframes landBounce {
            0% { transform: translateY(0) rotateX(var(--target-rotation)) scale(1); }
            50% { transform: translateY(8px) rotateX(var(--target-rotation)) scale(0.97); }
            100% { transform: translateY(0) rotateX(var(--target-rotation)) scale(1); }
        }
      `}</style>
    </div>
  );
};
