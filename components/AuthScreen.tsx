import React, { useState } from 'react';
import { isSupabaseConfigured, supabase, SUPABASE_CONFIG_MESSAGE } from '../lib/supabaseClient';
import { Button } from './Button';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail, Lock, AlertCircle, CheckCircle, Check, ArrowLeft, KeyRound } from 'lucide-react';

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

type AuthMode = 'login' | 'register' | 'forgot';

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    if (!supabase || !isSupabaseConfigured) {
      setError(SUPABASE_CONFIG_MESSAGE);
      setIsLoading(false);
      return;
    }

    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          setError(t('auth_password_mismatch'));
          setIsLoading(false);
          return;
        }

        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}`,
            data: {
              marketing_opt_in: marketingOptIn
            }
          }
        });
        
        if (error) {
          if (error.message.includes('already registered') || error.message.includes('already been registered')) {
            throw new Error(t('auth_email_already_exists'));
          }
          throw error;
        }
        
        if (data.user) {
          await supabase
            .from('profiles')
            .update({ marketing_opt_in: marketingOptIn })
            .eq('id', data.user.id);
        }
        
        if (data.user && !data.session) {
          setMessage(t('auth_confirmation_sent'));
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setMarketingOptIn(false);
        } else if (data.session) {
          setMessage(t('auth_registration_success'));
        }
      } else if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          if (error.message.includes('Invalid login credentials') || error.message.includes('Invalid')) {
            throw new Error(t('auth_invalid_credentials'));
          } else if (error.message.includes('Email not confirmed')) {
            throw new Error(t('auth_email_not_confirmed'));
          }
          throw error;
        }
      } else if (mode === 'forgot') {
        if (!email) {
          setError(t('auth_reset_email_required'));
          setIsLoading(false);
          return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}?type=recovery`,
        });
        if (error) throw error;
        
        setMessage(t('auth_reset_email_sent'));
        setEmail('');
        setTimeout(() => {
          setMode('login');
          setMessage(null);
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || t('auth_error'));
    } finally {
      setIsLoading(false);
    }
  };

  const getModeConfig = () => {
    switch (mode) {
      case 'register':
        return {
          title: t('auth_register_title'),
          subtitle: t('auth_register_subtitle'),
          buttonText: t('auth_register_btn'),
          switchText: t('auth_switch_to_login'),
          switchAction: () => setMode('login'),
          bgGradient: 'from-emerald-500 to-teal-600',
          iconBg: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300'
        };
      case 'forgot':
        return {
          title: t('auth_forgot_title'),
          subtitle: t('auth_forgot_subtitle'),
          buttonText: t('auth_forgot_btn'),
          switchText: t('auth_back_to_login'),
          switchAction: () => setMode('login'),
          bgGradient: 'from-amber-500 to-orange-600',
          iconBg: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300'
        };
      default: // login
        return {
          title: t('auth_login_title'),
          subtitle: t('auth_login_subtitle'),
          buttonText: t('auth_login_btn'),
          switchText: t('auth_switch_to_register'),
          switchAction: () => setMode('register'),
          bgGradient: 'from-blue-500 to-indigo-600',
          iconBg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300'
        };
    }
  };

  const config = getModeConfig();

  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-6 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} opacity-5 animate-pulse-slow`}></div>
      
      <div className="w-full max-w-sm space-y-8 relative z-10">
        <div className="text-center">
          {/* Icon with mode-specific styling */}
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg ${config.iconBg} transition-all duration-300`}>
            {mode === 'forgot' ? <KeyRound size={28} /> : <Lock size={28} />}
          </div>
          
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            {config.title}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {config.subtitle}
          </p>
        </div>

        <form 
          className="mt-8 space-y-6" 
          onSubmit={handleAuth}
          autoComplete="on"
        >
          <div className="space-y-4 rounded-md shadow-sm">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={20} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
                autoCapitalize="none"
                autoCorrect="off"
                name="email"
                id={`${mode}-email`}
                className="block w-full pl-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-4 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                placeholder={t('auth_email')}
              />
            </div>
            
            {mode !== 'forgot' && (
              <>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={20} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    name={mode === 'login' ? 'password' : 'new-password'}
                    id={mode === 'login' ? 'current-password' : `${mode}-password`}
                    inputMode="text"
                    autoCapitalize="none"
                    autoCorrect="off"
                    className="block w-full pl-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-4 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                    placeholder={t('auth_password')}
                    minLength={6}
                  />
                </div>
                
                {mode === 'register' && (
                  <>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock size={20} />
                      </div>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        name="confirm-password"
                        id="register-confirm-password"
                        className="block w-full pl-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-4 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                        placeholder={t('auth_confirm_password')}
                        minLength={6}
                      />
                    </div>
                    
                    {/* Marketing Opt-in */}
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center mt-0.5">
                          <input
                            type="checkbox"
                            checked={marketingOptIn}
                            onChange={(e) => setMarketingOptIn(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 peer-checked:bg-emerald-600 peer-checked:border-emerald-600 transition-all flex items-center justify-center">
                            {marketingOptIn && <Check size={14} className="text-white" />}
                          </div>
                        </div>
                        <div className="flex-1">
                          <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            {t('marketing_opt_in_text')}
                          </span>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {t('marketing_opt_in_subtitle')}
                          </p>
                        </div>
                      </label>
                    </div>
                  </>
                )}
              </>
            )}
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

          <Button type="submit" fullWidth isLoading={isLoading} variant="primary">
            {config.buttonText}
          </Button>

          {mode === 'login' && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors flex items-center gap-1"
              >
                <KeyRound size={14} />
                {t('auth_forgot_password')}
              </button>
            </div>
          )}
        </form>

        <div className="text-center">
          <button
            onClick={() => {
              config.switchAction();
              setError(null);
              setMessage(null);
              setPassword('');
              setConfirmPassword('');
              setMarketingOptIn(false);
            }}
            className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            {mode === 'forgot' && <ArrowLeft size={14} />}
            {config.switchText}
          </button>
        </div>
      </div>
    </div>
  );
};
