import React, { useState } from 'react';
import { UserSettings } from '../types';
import { Button } from './Button';
import { Briefcase, Wallet, Clock, ChevronDown, MapPin, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SettingsFormProps {
  initialSettings: UserSettings;
  onSave: (settings: UserSettings) => Promise<void> | void;
  isFirstTime?: boolean;
  onCancel?: () => void;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialSettings, onSave, isFirstTime = false, onCancel }) => {
  const { t } = useLanguage();
  const [netSalary, setNetSalary] = useState<string>(initialSettings.monthlyNetSalary === 0 ? '' : initialSettings.monthlyNetSalary.toString());
  const [hours, setHours] = useState<string>(initialSettings.weeklyHours === 0 ? '40' : initialSettings.weeklyHours.toString());
  const [currency, setCurrency] = useState<string>(initialSettings.currency || 'HUF');
  const [city, setCity] = useState<string>(initialSettings.city || '');
  const [age, setAge] = useState<string>(initialSettings.age === 0 ? '' : initialSettings.age.toString());
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const salaryNum = parseFloat(netSalary);
    const hoursNum = parseFloat(hours);
    const ageNum = parseInt(age);

    if (!salaryNum || !hoursNum || !ageNum || !city) return;

    setIsSaving(true);
    try {
        await onSave({
            ...initialSettings,
            monthlyNetSalary: salaryNum,
            weeklyHours: hoursNum,
            currency,
            city,
            age: ageNum,
            isSetup: true
        });
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-24">
        <div className={`w-full max-w-md mx-auto flex flex-col min-h-full ${isFirstTime ? 'justify-center' : 'pt-4'} animate-fade-in`}>
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-600/10">
              <Briefcase size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {isFirstTime ? t('settings_title_first') : t('settings_title')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {isFirstTime ? t('settings_desc_first') : t('settings_desc')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col">
            
            {/* Personal Details */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('age')}</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                            <Calendar size={18} />
                        </div>
                        <input
                            type="number"
                            required
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="25"
                            className="block w-full pl-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('city')}</label>
                    <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                            <MapPin size={18} />
                        </div>
                        <input
                            type="text"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Bp."
                            className="block w-full pl-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Financials */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('monthly_salary')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Wallet size={18} />
                </div>
                <input
                  type="number"
                  required
                  value={netSalary}
                  onChange={(e) => setNetSalary(e.target.value)}
                  placeholder="Pl. 450000"
                  className="block w-full pl-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-4 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('weekly_hours')}</label>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                        <Clock size={18} />
                    </div>
                    <input
                        type="number"
                        required
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        placeholder="40"
                        className="block w-full pl-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                    />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('currency')}</label>
                    <div className="relative">
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="block w-full pl-3 pr-8 appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                        >
                            <option value="HUF">HUF</option>
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                            <option value="GBP">GBP</option>
                            <option value="RON">RON</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                            <ChevronDown size={16} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4 mt-auto space-y-3">
              <Button type="submit" fullWidth variant="primary" isLoading={isSaving}>
                {isFirstTime ? t('start_btn') : t('save_settings_btn')}
              </Button>
              
              {!isFirstTime && onCancel && (
                  <Button type="button" onClick={onCancel} fullWidth variant="ghost" disabled={isSaving}>
                      {t('cancel')}
                  </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};