import React from 'react';
import { Button } from './Button';
import { useLanguage } from '../contexts/LanguageContext';
import { Clock } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const { t } = useLanguage();

  return (
    <div className="h-full w-full flex flex-col items-center justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[40%] bg-gradient-to-b from-rose-600/15 to-transparent rounded-[50%] animate-wave blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[120%] h-[40%] bg-gradient-to-t from-orange-500/15 to-transparent rounded-[50%] animate-wave blur-3xl" style={{ animationDelay: '-5s' }}></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full px-6 md:px-8 z-10">
        
        {/* 3D Floating Clock */}
        <div className="relative mb-8 md:mb-12 animate-float">
          {/* Back glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/40 to-orange-500/40 blur-3xl rounded-full scale-110"></div>
          
          {/* Clock Body */}
          <div className="relative w-40 h-40 md:w-48 md:h-48 bg-gradient-to-br from-rose-500 to-orange-600 rounded-full flex items-center justify-center shadow-[0_20px_60px_rgba(225,29,72,0.6),inset_0_4px_20px_rgba(255,255,255,0.2)] border-4 border-rose-400/30">
             {/* Clock Face */}
             <div className="w-32 h-32 md:w-40 md:h-40 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-inner relative overflow-hidden">
                <Clock size={64} className="text-rose-500 dark:text-rose-400 md:w-20 md:h-20" strokeWidth={1.5} />
                
                {/* Fake 3D depth elements */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none"></div>
             </div>
             
             {/* Bells */}
             <div className="absolute -top-3 md:-top-4 -left-2 w-10 h-10 md:w-12 md:h-12 bg-rose-600 rounded-full -z-10 shadow-lg"></div>
             <div className="absolute -top-3 md:-top-4 -right-2 w-10 h-10 md:w-12 md:h-12 bg-rose-600 rounded-full -z-10 shadow-lg"></div>
             
             {/* Legs */}
             <div className="absolute -bottom-1.5 md:-bottom-2 left-3 md:left-4 w-3 h-6 md:w-4 md:h-8 bg-rose-700 rounded-full -z-10 rotate-[30deg] shadow-md"></div>
             <div className="absolute -bottom-1.5 md:-bottom-2 right-3 md:right-4 w-3 h-6 md:w-4 md:h-8 bg-rose-700 rounded-full -z-10 rotate-[-30deg] shadow-md"></div>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 mb-3 md:mb-4 text-center drop-shadow-lg">
          {t('app_name')}
        </h1>
        
        <p className="text-lg md:text-xl font-bold text-center text-white/90 mb-2 max-w-sm">
            {t('welcome_slogan')}
        </p>
        <p className="text-xs md:text-sm text-center text-slate-400 max-w-xs leading-relaxed px-4">
            {t('welcome_sub')}
        </p>
      </div>

      <div className="w-full p-6 md:p-8 z-10 max-w-md">
        <Button 
            onClick={onStart} 
            fullWidth 
            size="lg" 
            className="bg-gradient-to-r from-rose-500 via-rose-600 to-orange-500 hover:from-rose-600 hover:via-rose-700 hover:to-orange-600 shadow-2xl shadow-rose-500/40 border-none text-base md:text-lg font-bold"
        >
          {t('lets_start')}
        </Button>
      </div>
    </div>
  );
};
