import React, { useState, useMemo } from 'react';
import { UserSettings, CalculationResult, HistoryItem } from '../types';
import { Button } from './Button';
import { ShoppingBag, Play, Check, X, Sparkles, Briefcase, Coins } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getAdviceMessage } from '../utils/adviceMessages';
import { CoinFlip } from './CoinFlip';
import { BannerCarousel } from './BannerCarousel';

interface CalculatorProps {
  settings: UserSettings;
  onSaveHistory: (item: Omit<HistoryItem, 'id' | 'date'>) => void;
}

interface FeedbackModalState {
    isOpen: boolean;
    type: 'bought' | 'saved';
    data: CalculationResult;
    message: string;
}

// Security: Maximum length for product name to prevent DoS and storage issues
const MAX_PRODUCT_NAME_LENGTH = 100;
const MAX_PRICE_LENGTH = 15;

// Security: Sanitize product name to prevent potential XSS in non-React contexts
const sanitizeProductName = (input: string): string => {
  return input
    .slice(0, MAX_PRODUCT_NAME_LENGTH)
    .replace(/[<>]/g, ''); // Remove potential HTML injection characters
};

// Security: Validate price input format
const sanitizePriceInput = (input: string): string => {
  // Only allow digits, decimal point, and minus (for scientific notation edge cases)
  return input.slice(0, MAX_PRICE_LENGTH).replace(/[^0-9.]/g, '');
};

export const Calculator: React.FC<CalculatorProps> = ({ settings, onSaveHistory }) => {
  const { t, language } = useLanguage();
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [feedbackModal, setFeedbackModal] = useState<FeedbackModalState | null>(null);
  const [showCoinFlip, setShowCoinFlip] = useState(false);
  const [coinSuggestion, setCoinSuggestion] = useState<'bought' | 'saved' | null>(null);

  // Hourly Rate Calculation with validation
  const hourlyRate = useMemo(() => {
    // Security: Validate settings to prevent division by zero and NaN propagation
    if (!isFinite(settings.monthlyNetSalary) || !isFinite(settings.weeklyHours) ||
        settings.weeklyHours <= 0 || settings.monthlyNetSalary < 0) {
      return 0;
    }
    return settings.monthlyNetSalary / (settings.weeklyHours * 4.33);
  }, [settings]);

  // Maximum price limit (10 billion) to prevent overflow
  const MAX_PRICE = 1e10;

  const handleCalculate = () => {
    const priceNum = parseFloat(price);
    // Security: Enhanced validation - check for NaN, Infinity, negative, zero, and max limit
    if (isNaN(priceNum) || priceNum <= 0 || !isFinite(priceNum) || priceNum > MAX_PRICE) return;
    // Security: Prevent calculation if hourlyRate is invalid
    if (hourlyRate <= 0 || !isFinite(hourlyRate)) return;

    const totalHoursDecimal = priceNum / hourlyRate;
    const hours = Math.floor(totalHoursDecimal);
    const minutes = Math.round((totalHoursDecimal - hours) * 60);

    setResult({ hours, minutes, totalHoursDecimal, priceNum });
    setCoinSuggestion(null);
  };

  const handleDecision = (decision: 'bought' | 'saved') => {
    if (!result) return;

    const advice = getAdviceMessage(decision, language);

    onSaveHistory({
        productName: productName || t('item_unnamed'),
        price: result.priceNum,
        currency: settings.currency,
        totalHoursDecimal: result.totalHoursDecimal,
        decision: decision,
        adviceUsed: advice
    });

    setFeedbackModal({
        isOpen: true,
        type: decision,
        data: result,
        message: advice
    });
    
    setCoinSuggestion(null);
  };

  const handleCoinFlipSuggestion = (suggestion: 'bought' | 'saved') => {
    setShowCoinFlip(false);
    setCoinSuggestion(suggestion);
  };

  const handleCloseFeedback = () => {
      setFeedbackModal(null);
      setResult(null);
      setProductName('');
      setPrice('');
      setCoinSuggestion(null);
  };

  const getSeverityColor = (totalHours: number) => {
    if (totalHours < 1) return "text-emerald-600 dark:text-emerald-400";
    if (totalHours < 8) return "text-yellow-500 dark:text-yellow-400";
    if (totalHours < 40) return "text-orange-500 dark:text-orange-400";
    return "text-rose-500 dark:text-rose-500";
  };

  const getButtonStyle = (type: 'bought' | 'saved') => {
    if (!coinSuggestion) {
      return type === 'bought' 
        ? "bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/20 dark:hover:bg-rose-500/30 border-2 border-rose-200 dark:border-rose-500/50 text-rose-700 dark:text-rose-300"
        : "bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-600/20 dark:hover:bg-emerald-600/30 border-2 border-emerald-200 dark:border-emerald-500/50 text-emerald-700 dark:text-emerald-300";
    }
    
    const isSuggested = coinSuggestion === type;
    if (isSuggested) {
      return type === 'bought'
        ? "bg-rose-100 dark:bg-rose-500/40 border-4 border-rose-400 dark:border-rose-400 text-rose-800 dark:text-rose-200 shadow-lg shadow-rose-500/30 scale-105"
        : "bg-emerald-100 dark:bg-emerald-600/40 border-4 border-emerald-400 dark:border-emerald-400 text-emerald-800 dark:text-emerald-200 shadow-lg shadow-emerald-500/30 scale-105";
    } else {
      return type === 'bought'
        ? "bg-rose-50/50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 border-2 border-rose-200/50 dark:border-rose-500/30 text-rose-700/70 dark:text-rose-300/70"
        : "bg-emerald-50/50 hover:bg-emerald-100 dark:bg-emerald-600/10 dark:hover:bg-emerald-600/20 border-2 border-emerald-200/50 dark:border-emerald-500/30 text-emerald-700/70 dark:text-emerald-300/70";
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      
      {showCoinFlip && (
        <CoinFlip 
          onSuggestion={handleCoinFlipSuggestion}
          onClose={() => setShowCoinFlip(false)}
        />
      )}

      {feedbackModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md animate-fade-in">
              <div className="w-full max-w-sm text-center space-y-4 px-2">
                  {feedbackModal.type === 'saved' ? (
                      <>
                        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto animate-bounce-small">
                            <Sparkles size={40} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">{t('feedback_saved_title')}</h2>
                            <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg">
                                {t('feedback_saved_desc')} <span className="font-bold text-emerald-600 dark:text-emerald-400">{feedbackModal.data.priceNum.toLocaleString()} {settings.currency}</span>!
                            </p>
                        </div>
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800">
                            <p className="text-emerald-800 dark:text-emerald-200 font-medium italic text-sm">{feedbackModal.message}</p>
                        </div>
                      </>
                  ) : (
                      <>
                         <div className="w-20 h-20 bg-rose-100 dark:bg-rose-600/20 rounded-full flex items-center justify-center mx-auto">
                            <Briefcase size={40} className="text-rose-600 dark:text-rose-400" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('feedback_bought_title')}</h2>
                            <div className="text-3xl md:text-4xl font-black text-rose-600 dark:text-rose-400 my-3">
                                {feedbackModal.data.hours} {t('hour_short')}
                                {feedbackModal.data.minutes > 0 && <span className="text-xl md:text-2xl ml-2">{feedbackModal.data.minutes} {t('min_short')}</span>}
                            </div>
                        </div>
                        <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-100 dark:border-rose-800">
                             <p className="text-rose-800 dark:text-rose-200 font-medium italic text-sm">{feedbackModal.message}</p>
                        </div>
                      </>
                  )}
                  
                  <Button onClick={handleCloseFeedback} fullWidth>
                      {t('thanks_btn')}
                  </Button>
              </div>
          </div>
      )}

      {/* Sub-header info */}
      <div className="px-4 py-2 text-center border-b border-slate-100 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shrink-0">
         <p className="text-xs md:text-sm text-slate-500">{t('hourly_rate')}: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{hourlyRate.toFixed(0)} {settings.currency}</span></p>
      </div>

      <main className="flex-1 px-4 md:px-6 overflow-y-auto no-scrollbar py-4 pb-4 max-w-md mx-auto w-full">
        
        {/* Input Section */}
        <div className={`space-y-4 transition-all duration-500 ${result ? 'hidden' : 'opacity-100'}`}>
            <div className="space-y-2">
                <label className="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-400">{t('what_to_buy')}</label>
                <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(sanitizeProductName(e.target.value))}
                    placeholder={t('placeholder_item')}
                    maxLength={MAX_PRODUCT_NAME_LENGTH}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 md:p-4 text-sm md:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-400">{t('price_label')} ({settings.currency})</label>
                <div className="relative">
                    <input
                        type="text"
                        inputMode="decimal"
                        value={price}
                        onChange={(e) => setPrice(sanitizePriceInput(e.target.value))}
                        placeholder="0"
                        maxLength={MAX_PRICE_LENGTH}
                        pattern="[0-9]*\.?[0-9]*"
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 md:p-4 text-2xl md:text-3xl font-bold text-slate-900 dark:text-white placeholder-slate-300 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                    />
                    <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <ShoppingBag size={20} className="md:hidden" />
                        <ShoppingBag size={24} className="hidden md:block" />
                    </div>
                </div>
            </div>
            
            <Button onClick={handleCalculate} fullWidth size="lg" disabled={!price} className="mt-4">
                <Play size={18} /> {t('calculate_btn')}
            </Button>

            {/* Banner Carousel - positioned below calculate button, centered between button and navbar */}
            <div className="mt-48">
              <BannerCarousel />
            </div>
        </div>

        {/* Result Display */}
        {result && !feedbackModal && (
          <div className="flex flex-col h-full animate-fade-in-up">
            <div className="text-center mb-4 md:mb-6 pt-2 md:pt-4">
              <p className="text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider text-[10px] md:text-xs font-bold">{t('cost_in_life')}</p>
              <div className={`text-5xl md:text-7xl font-black leading-none tracking-tighter ${getSeverityColor(result.totalHoursDecimal)}`}>
                {result.hours}<span className="text-xl md:text-2xl font-medium text-slate-400 ml-1">{t('hour_short')}</span>
              </div>
              {result.minutes > 0 && (
                <div className={`text-3xl md:text-4xl font-bold mt-2 ${getSeverityColor(result.totalHoursDecimal)} opacity-80`}>
                  {result.minutes}<span className="text-base md:text-lg font-medium text-slate-400 ml-1">{t('min_short')}</span>
                </div>
              )}
            </div>

            {coinSuggestion && (
              <div className="mb-3 md:mb-4 p-2.5 md:p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl animate-fade-in-up">
                <div className="flex items-center justify-center gap-2 text-amber-700 dark:text-amber-300 text-xs md:text-sm font-semibold">
                  <Coins size={14} className="md:hidden" />
                  <Coins size={16} className="hidden md:block" />
                  <span>{t('coinflip_suggestion_label')}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
                <button 
                    onClick={() => handleDecision('bought')}
                    className={`flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl transition-all active:scale-95 ${getButtonStyle('bought')}`}
                >
                    <X size={28} className="mb-1 md:mb-2 md:w-9 md:h-9" />
                    <span className="font-bold text-base md:text-lg">{t('buy_btn')}</span>
                    <span className="text-[10px] md:text-xs opacity-70 mt-0.5 md:mt-1">(-{result.hours}h {t('buy_sub')})</span>
                </button>
                
                <button 
                    onClick={() => handleDecision('saved')}
                    className={`flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl transition-all active:scale-95 ${getButtonStyle('saved')}`}
                >
                    <Check size={28} className="mb-1 md:mb-2 md:w-9 md:h-9" />
                    <span className="font-bold text-base md:text-lg">{t('save_btn')}</span>
                    <span className="text-[10px] md:text-xs opacity-70 mt-0.5 md:mt-1">(+{result.priceNum} {settings.currency})</span>
                </button>
            </div>

            {/* Coin Flip Button */}
            <button
              onClick={() => setShowCoinFlip(true)}
              className="w-full flex items-center justify-center gap-2 p-3 md:p-4 bg-amber-50 hover:bg-amber-100 dark:bg-amber-600/20 dark:hover:bg-amber-600/30 border-2 border-amber-200 dark:border-amber-500/50 rounded-2xl text-amber-700 dark:text-amber-300 transition-all active:scale-95 font-semibold text-sm md:text-base"
            >
              <Coins size={18} className="md:hidden" />
              <Coins size={20} className="hidden md:block" />
              <span>{t('cant_decide')}</span>
            </button>

            <div className="mt-6 md:mt-8 text-center">
                <button onClick={() => { setResult(null); setCoinSuggestion(null); }} className="text-slate-400 text-xs md:text-sm underline hover:text-slate-200 transition-colors">{t('new_calculation')}</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
