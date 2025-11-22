import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { isSupabaseConfigured, supabase, SUPABASE_CONFIG_MESSAGE } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './Button';

interface ResetPasswordProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ onSuccess, onCancel }) => {
  const { t } = useLanguage();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError(t('reset_password_mismatch'));
      return;
    }

    if (!supabase || !isSupabaseConfigured) {
      setError(SUPABASE_CONFIG_MESSAGE);
      return;
    }

    setIsLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      setMessage(t('reset_password_success'));
      setPassword('');
      setConfirmPassword('');
      setTimeout(onSuccess, 800);
    } catch (err: any) {
      setError(err.message || t('auth_error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-6 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300">
            <Lock size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('reset_password_title')}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">{t('reset_password_desc')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={20} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-4 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                placeholder={t('auth_password')}
                minLength={6}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={20} />
              </div>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pl-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-4 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                placeholder={t('auth_confirm_password')}
                minLength={6}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-rose-500 text-sm bg-rose-50 dark:bg-rose-900/20 p-3 rounded-lg">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="flex items-center gap-2 text-emerald-500 text-sm bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
              <CheckCircle size={16} />
              <span>{message}</span>
            </div>
          )}

          <div className="space-y-3">
            <Button type="submit" fullWidth isLoading={isLoading} variant="primary">
              {t('reset_password_button')}
            </Button>
            <Button type="button" fullWidth variant="secondary" onClick={onCancel}>
              {t('cancel')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
