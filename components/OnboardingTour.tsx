import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './Button';
import { X } from 'lucide-react';

interface OnboardingTourProps {
  onComplete: () => void;
  onStepChange?: (step: number) => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete, onStepChange }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);

  // Notify parent about step changes
  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);

  const steps = [
    {
      title: t('tour_welcome_title'),
      desc: t('tour_welcome_desc'),
      position: 'center',
      highlight: null
    },
    {
      title: t('tour_calc_title'),
      desc: t('tour_calc_desc'),
      position: 'bottom-left',
      highlight: '0%' // Approximate position of 1st tab
    },
    {
      title: t('tour_hist_title'),
      desc: t('tour_hist_desc'),
      position: 'bottom-left-center',
      highlight: '25%' // Approximate position of 2nd tab
    },
    {
      title: t('tour_level_title'),
      desc: t('tour_level_desc'),
      position: 'bottom-right-center',
      highlight: '50%' // Approximate position of 3rd tab
    },
    {
      title: t('tour_challenges_title'),
      desc: t('tour_challenges_desc'),
      position: 'bottom-right',
      highlight: '75%' // Approximate position of 4th tab
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex flex-col animate-fade-in">
      
      {/* Skip Button */}
      <button 
        onClick={onComplete}
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white z-20"
      >
        <X size={24} />
      </button>

      {/* Highlight Spot (Only for nav items) - transparent cutout so icons are visible */}
      {currentStep.highlight && (
         <div
            className="absolute bottom-0 h-[80px] w-[25%] border-t-2 border-orange-500 transition-all duration-300 pointer-events-none"
            style={{ left: currentStep.highlight }}
         >
            {/* Arrow indicator pointing down to the nav item */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-orange-500 rotate-45 shadow-lg"></div>
            {/* Glow effect around the highlighted area */}
            <div className="absolute inset-0 ring-2 ring-orange-500/50 ring-inset rounded-t-xl"></div>
         </div>
      )}

      {/* Content Card */}
      <div className={`flex-1 flex items-center justify-center p-6 ${currentStep.highlight ? 'pb-32' : ''}`}>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-xs w-full shadow-2xl border border-slate-200 dark:border-slate-700 text-center relative animate-bounce-small">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{currentStep.title}</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                {currentStep.desc}
            </p>
            
            <div className="flex justify-between items-center">
                <div className="flex gap-1">
                    {steps.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`w-2 h-2 rounded-full transition-colors ${idx === step ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}`} 
                        />
                    ))}
                </div>
                <Button onClick={handleNext} size="sm" variant="primary">
                    {step === steps.length - 1 ? t('finish') : t('next')}
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};