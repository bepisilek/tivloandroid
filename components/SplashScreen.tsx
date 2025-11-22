import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface FallingClock {
  id: number;
  left: number;
  animationDelay: number;
  animationDuration: number;
  size: number;
  rotation: number;
}

interface SplashScreenProps {
  onComplete: () => void;
  isAppLoaded?: boolean;
}

const MIN_SPLASH_DURATION = 1100; // 1.1 másodperc minimum

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, isAppLoaded = false }) => {
  const [clocks, setClocks] = useState<FallingClock[]>([]);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  // Generáljuk az órákat egyszer
  useEffect(() => {
    const generatedClocks: FallingClock[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDelay: Math.random() * 2,
      animationDuration: 3 + Math.random() * 2,
      size: 20 + Math.random() * 20,
      rotation: Math.random() * 360
    }));
    setClocks(generatedClocks);

    // Minimum 1.1 másodperc után jelezzük, hogy eltelt a minimum idő
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, MIN_SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, []);

  // Ha eltelt a minimum idő ÉS az app betöltött, akkor befejezzük
  useEffect(() => {
    if (minTimeElapsed && isAppLoaded) {
      onComplete();
    }
  }, [minTimeElapsed, isAppLoaded, onComplete]);

  return (
    // MÓDOSÍTVA: Sötét feketés-narancssárgás gradiens háttér
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-gray-950 via-neutral-900 to-orange-900 flex items-center justify-center overflow-hidden">
      
      {/* Eső órák */}
      {clocks.map((clock) => (
        <div
          key={clock.id}
          className="absolute animate-fall opacity-40"
          style={{
            left: `${clock.left}%`,
            animationDelay: `${clock.animationDelay}s`,
            animationDuration: `${clock.animationDuration}s`,
            top: '-50px'
          }}
        >
          {/* MÓDOSÍTVA: Halvány narancssárgás árnyalat a fehér helyett */}
          <Clock 
            size={clock.size} 
            className="text-orange-500/20"
            style={{ 
              transform: `rotate(${clock.rotation}deg)`,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }}
          />
        </div>
      ))}

      {/* Központi logó és szöveg */}
      <div className="relative z-10 text-center animate-fade-in-scale">
        <div className="mb-6 relative">
          {/* MÓDOSÍTVA: Háttér glow narancssárgára cserélve */}
          <div className="absolute inset-0 bg-orange-600/20 blur-3xl rounded-full scale-150"></div>
          
          {/* MÓDOSÍTVA: Sötétített "üveges" hatású kör narancs kerettel */}
          <div className="relative w-32 h-32 mx-auto bg-neutral-900/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl border border-orange-500/30 ring-4 ring-orange-500/10">
            <Clock size={64} className="text-orange-500" strokeWidth={2} />
          </div>
        </div>

        <h1 className="text-5xl font-black text-white mb-2 tracking-tight drop-shadow-lg">
          Tivlo
        </h1>
        {/* MÓDOSÍTVA: Kicsit melegebb szürke szöveg */}
        <p className="text-orange-100/80 text-lg font-medium tracking-wide">
          Ne pazarold az életed
        </p>

        {/* Loading indikátor */}
        <div className="mt-8 flex justify-center">
          {/* MÓDOSÍTVA: Sötétebb sáv, narancs csíkkal */}
          <div className="w-16 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full animate-loading-bar box-shadow-glow"></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-50px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes fade-in-scale {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }

        .animate-fall {
          animation: fall linear infinite;
        }

        .animate-fade-in-scale {
          animation: fade-in-scale 0.6s ease-out forwards;
        }

        .animate-loading-bar {
          animation: loading-bar 1.5s ease-in-out infinite;
        }
        
        .box-shadow-glow {
            box-shadow: 0 0 10px #f97316;
        }
      `}</style>
    </div>
  );
};
