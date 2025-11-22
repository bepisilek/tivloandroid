import React, { useState } from 'react';
import { X, User, Moon, Sun, LogOut, KeyRound, Trash2, Globe, Settings, ChevronDown, ChevronUp, MessageCircle, HelpCircle } from 'lucide-react';
import { UserSettings } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { isSupabaseConfigured, supabase, SUPABASE_CONFIG_MESSAGE } from '../lib/supabaseClient';

// Custom social media icons
const TikTokIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const InstagramIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProfile: () => void;
  onOpenResetPassword: () => void;
  onOpenDeleteAccount: () => void;
  onOpenHelp: () => void;
  settings: UserSettings;
  toggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onOpenProfile,
  onOpenResetPassword,
  onOpenDeleteAccount,
  onOpenHelp,
  settings,
  toggleTheme
}) => {
  const { t, language, setLanguage } = useLanguage();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogout = async () => {
    if (!supabase || !isSupabaseConfigured) {
      alert(SUPABASE_CONFIG_MESSAGE);
      return;
    }

    await supabase.auth.signOut();
    onClose();
    // App.tsx will handle the state change via onAuthStateChange
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel - From Right */}
      <div className={`fixed top-0 right-0 bottom-0 w-72 bg-white dark:bg-slate-900 z-[60] transform transition-transform duration-300 shadow-2xl flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">{t('app_name')}</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-2 flex-1 overflow-y-auto">
          <div className="mb-6 px-2">
              <div className="text-xs text-slate-500 uppercase font-bold mb-1">{t('menu_profile')}</div>
              <div className="text-sm font-medium text-slate-900 dark:text-white">
                  {settings.monthlyNetSalary > 0
                    ? `${settings.monthlyNetSalary.toLocaleString()} ${settings.currency}`
                    : '...'}
              </div>
          </div>

          {/* Appearance Toggle */}
          <div className="px-2 mb-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                {settings.theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                <span>{t('appearance')}</span>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-9 w-16 items-center rounded-full transition-colors ${settings.theme === 'dark' ? 'bg-slate-700' : 'bg-amber-300'}`}
                aria-label={settings.theme === 'dark' ? t('light_mode') : t('dark_mode')}
              >
                <span
                  className={`absolute left-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md transition-transform ${settings.theme === 'dark' ? 'translate-x-7' : 'translate-x-0'}`}
                >
                  {settings.theme === 'dark' ? <Moon size={16} className="text-slate-800" /> : <Sun size={16} className="text-amber-500" />}
                </span>
              </button>
            </div>
          </div>

          {/* Edit Profile */}
          <button
            onClick={() => { onOpenProfile(); onClose(); }}
            className="w-full flex items-center gap-3 p-3 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors"
          >
            <User size={20} />
            <span className="font-medium">{t('menu_edit_profile')}</span>
          </button>

          {/* Settings Collapsible Section */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-2 mt-2">
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="w-full flex items-center justify-between gap-3 p-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings size={20} />
                <span className="font-medium">{t('menu_settings')}</span>
              </div>
              {isSettingsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {isSettingsOpen && (
              <div className="pl-4 space-y-1 mt-1">
                {/* Language Setting */}
                <div className="flex items-center justify-between gap-3 p-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                    <Globe size={18} />
                    <span>{t('language')}</span>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as typeof language)}
                    className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en">{t('language_english')}</option>
                    <option value="hu">{t('language_hungarian')}</option>
                    <option value="de">{t('language_german')}</option>
                  </select>
                </div>

                {/* Change Password */}
                <button
                  onClick={() => { onOpenResetPassword(); onClose(); }}
                  className="w-full flex items-center gap-3 p-3 text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors"
                >
                  <KeyRound size={18} />
                  <span className="font-medium text-sm">{t('menu_reset_password')}</span>
                </button>

                {/* Delete Account */}
                <button
                  onClick={() => { onOpenDeleteAccount(); onClose(); }}
                  className="w-full flex items-center gap-3 p-3 text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition-colors"
                >
                  <Trash2 size={18} />
                  <span className="font-medium text-sm">{t('menu_delete_account')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Help Button */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-2 mt-2">
            <button
              onClick={() => { onOpenHelp(); onClose(); }}
              className="w-full flex items-center gap-3 p-3 text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 rounded-xl transition-colors"
            >
              <HelpCircle size={20} />
              <span className="font-medium text-sm">{t('menu_help')}</span>
            </button>
          </div>

          {/* Support Button */}
          <div className="pt-1">
            <button
              onClick={() => { /* Link will be added later */ }}
              className="w-full flex items-center gap-3 p-3 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors"
            >
              <MessageCircle size={20} />
              <span className="font-medium text-sm">{t('menu_support')}</span>
            </button>
          </div>

          {/* Social Media Section */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-2">
            <div className="px-2 mb-3">
              <span className="text-xs text-slate-500 uppercase font-bold">{t('menu_follow_us')}</span>
            </div>
            <div className="flex items-center justify-center gap-4 px-2">
              <button
                onClick={() => { /* TikTok link will be added later */ }}
                className="p-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white rounded-full transition-colors"
                aria-label="TikTok"
              >
                <TikTokIcon size={24} />
              </button>
              <button
                onClick={() => { /* Instagram link will be added later */ }}
                className="p-3 text-slate-600 dark:text-slate-400 hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600 hover:text-white rounded-full transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon size={24} />
              </button>
              <button
                onClick={() => { /* Facebook link will be added later */ }}
                className="p-3 text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white rounded-full transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon size={24} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
           <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">{t('auth_logout')}</span>
          </button>
          <div className="mt-4 text-center">
             <p className="text-xs text-slate-400">{t('app_name')} v2.0</p>
          </div>
        </div>
      </div>
    </>
  );
};
