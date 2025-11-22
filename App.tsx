import React, { useState, useEffect, useMemo } from 'react';
import { isSupabaseConfigured, supabase, SUPABASE_CONFIG_MESSAGE } from './lib/supabaseClient';
import { SettingsForm } from './components/SettingsForm';
import { Calculator } from './components/Calculator';
import { History } from './components/History';
import { Levels } from './components/Levels';
import { Challenges } from './components/Challenges';
import { Navigation } from './components/Navigation';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AuthScreen } from './components/AuthScreen';
import { OnboardingTour } from './components/OnboardingTour';
import { ResetPassword } from './components/ResetPassword';
import { DeleteAccount } from './components/DeleteAccount';
import { SplashScreen } from './components/SplashScreen';
import { UserSettings, ViewState, HistoryItem } from './types';
import { useLanguage } from './contexts/LanguageContext';

const TOUR_KEY = 'idopenz_tour_completed';
const SPLASH_SHOWN_KEY = 'tivlo_splash_shown';
const HIDDEN_ITEMS_KEY = 'tivlo_hidden_items';

// Streak számítás a history alapján
const calculateStreak = (history: HistoryItem[]): number => {
  if (history.length === 0) return 0;

  // Egyedi napok kinyerése a history-ból
  const uniqueDays = new Set<string>();
  history.forEach(item => {
    const date = new Date(item.date);
    const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    uniqueDays.add(dayKey);
  });

  // Napok listája rendezve (legújabbtól)
  const sortedDays = Array.from(uniqueDays)
    .map(dayKey => {
      const [year, month, day] = dayKey.split('-').map(Number);
      return new Date(year, month, day);
    })
    .sort((a, b) => b.getTime() - a.getTime());

  if (sortedDays.length === 0) return 0;

  // Ellenőrizzük, hogy a mai nap vagy a tegnap szerepel-e
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const latestDay = sortedDays[0];
  latestDay.setHours(0, 0, 0, 0);

  // Ha a legutóbbi nap nem ma vagy tegnap, a streak 0
  if (latestDay.getTime() !== today.getTime() && latestDay.getTime() !== yesterday.getTime()) {
    return 0;
  }

  // Streak számolása
  let streak = 1;
  let currentDate = latestDay;

  for (let i = 1; i < sortedDays.length; i++) {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    prevDate.setHours(0, 0, 0, 0);

    const checkDate = sortedDays[i];
    checkDate.setHours(0, 0, 0, 0);

    if (checkDate.getTime() === prevDate.getTime()) {
      streak++;
      currentDate = checkDate;
    } else {
      break;
    }
  }

  return streak;
};

const DEFAULT_SETTINGS: UserSettings = {
  monthlyNetSalary: 0,
  weeklyHours: 40,
  currency: 'HUF',
  city: '',
  age: 0,
  isSetup: false,
  theme: 'dark'
};

const App: React.FC = () => {
  const { t } = useLanguage();
  const [viewState, setViewState] = useState<ViewState>(ViewState.WELCOME);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [previousView, setPreviousView] = useState<ViewState>(ViewState.CALCULATOR);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [session, setSession] = useState<any>(null);

  // Streak számítás
  const streak = useMemo(() => calculateStreak(history), [history]);

  // Splash Screen Logic
  useEffect(() => {
    if (!session) {
      setShowSplash(false);
      return;
    }

    const splashShown = sessionStorage.getItem(SPLASH_SHOWN_KEY);
    setShowSplash(!splashShown);
  }, [session]);

  const handleSplashComplete = () => {
    sessionStorage.setItem(SPLASH_SHOWN_KEY, 'true');
    setShowSplash(false);
    if (session) {
      setViewState(ViewState.CALCULATOR);
    }
  };

  // Initial Auth Check & Subscription
  useEffect(() => {
    if (!supabase) {
      console.warn(SUPABASE_CONFIG_MESSAGE);
      setIsLoading(false);
      setViewState(ViewState.WELCOME);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserData(session.user.id);
      } else {
        setIsLoading(false);
        setViewState(ViewState.WELCOME);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state change:', _event, session);
      setSession(session);
      if (session) {
        fetchUserData(session.user.id);
      } else {
        // Logged out
        setSettings(DEFAULT_SETTINGS);
        setHistory([]);
        setViewState(ViewState.WELCOME);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Detect password recovery from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    const type = urlParams.get('type') || hashParams.get('type');
    const accessToken = hashParams.get('access_token');

    if (type === 'recovery' && accessToken) {
      setViewState(ViewState.RESET_PASSWORD);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (type === 'signup' || (type === 'email' && accessToken)) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [session]);

  // Apply Theme Effect
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(settings.theme);
  }, [settings.theme]);

  // Fetch Profile and History from Supabase
  const fetchUserData = async (userId: string) => {
    if (!supabase) return;

    try {
        setIsLoading(true);

        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error fetching profile:', profileError);
        }

        const { data: historyData, error: historyError } = await supabase
            .from('history')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false });
            
        if (historyError) {
             console.error('Error fetching history:', historyError);
        }

        if (profileData) {
            const newSettings: UserSettings = {
                monthlyNetSalary: profileData.monthly_net_salary || 0,
                weeklyHours: profileData.weekly_hours || 40,
                currency: profileData.currency || 'HUF',
                city: profileData.city || '',
                age: profileData.age || 0,
                theme: profileData.theme || 'dark',
                isSetup: !!profileData.monthly_net_salary
            };
            setSettings(newSettings);
            
            // Get hidden item IDs from localStorage
            const hiddenItemsJson = localStorage.getItem(HIDDEN_ITEMS_KEY);
            const hiddenItemIds: string[] = hiddenItemsJson ? JSON.parse(hiddenItemsJson) : [];

            const mappedHistory: HistoryItem[] = (historyData || [])
                .filter((item: any) => !hiddenItemIds.includes(item.id))
                .map((item: any) => ({
                    id: item.id,
                    productName: item.product_name,
                    price: item.price,
                    currency: item.currency,
                    totalHoursDecimal: item.total_hours_decimal,
                    decision: item.decision,
                    date: item.date,
                    adviceUsed: item.advice_used
                }));
            setHistory(mappedHistory);

            if (newSettings.isSetup) {
                setViewState(ViewState.CALCULATOR);
                const tourCompleted = localStorage.getItem(TOUR_KEY) === 'true';
                if (!tourCompleted) setShowTour(true);
            } else {
                setViewState(ViewState.ONBOARDING);
            }

        } else {
            setViewState(ViewState.ONBOARDING);
        }
    } catch (error) {
        console.error('Data fetch error:', error);
    } finally {
        setIsLoading(false);
    }
  };

  const handleStart = () => {
      setViewState(ViewState.AUTH);
  };

  const handleAuthSuccess = () => {
      // Handled by onAuthStateChange
  };

  const handleSaveSettings = async (newSettings: UserSettings) => {
    if (!session || !supabase) return;

    try {
        const updates = {
            id: session.user.id,
            monthly_net_salary: newSettings.monthlyNetSalary,
            weekly_hours: newSettings.weeklyHours,
            currency: newSettings.currency,
            city: newSettings.city,
            age: newSettings.age,
            theme: newSettings.theme,
            updated_at: new Date(),
        };

        const { error } = await supabase.from('profiles').upsert(updates);
        if (error) throw error;

        setSettings({ ...newSettings, isSetup: true });
        
        if (viewState === ViewState.ONBOARDING) {
            setViewState(ViewState.CALCULATOR);
            const tourCompleted = localStorage.getItem(TOUR_KEY) === 'true';
            if (!tourCompleted) setShowTour(true);
        } else if (viewState === ViewState.SETTINGS) {
            setViewState(previousView);
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        alert('Failed to save profile.');
    }
  };

  const handleTourComplete = () => {
      setShowTour(false);
      setTourStep(0);
      localStorage.setItem(TOUR_KEY, 'true');
  };

  const toggleTheme = async () => {
      const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
      setSettings(prev => ({ ...prev, theme: newTheme }));

      if (session && supabase) {
          await supabase.from('profiles').update({ theme: newTheme }).eq('id', session.user.id);
      }
  };

  const handleSaveHistory = async (itemData: Omit<HistoryItem, 'id' | 'date'>) => {
      if (!session || !supabase) return;

      try {
          const dbItem = {
            user_id: session.user.id,
            product_name: itemData.productName,
            price: itemData.price,
            currency: itemData.currency,
            total_hours_decimal: itemData.totalHoursDecimal,
            decision: itemData.decision,
            advice_used: itemData.adviceUsed,
            date: new Date().toISOString()
          };

          const { data, error } = await supabase.from('history').insert(dbItem).select().single();
          
          if (error) throw error;
          
          if (data) {
               const newItem: HistoryItem = {
                id: data.id,
                productName: data.product_name,
                price: data.price,
                currency: data.currency,
                totalHoursDecimal: data.total_hours_decimal,
                decision: data.decision,
                date: data.date,
                adviceUsed: data.advice_used
              };
              setHistory(prev => [newItem, ...prev]);
          }

      } catch (error) {
          console.error('Error saving history:', error);
      }
  };


  const handleClearHistory = async () => {
      if (!session || !supabase) return;
      if(confirm(t('clear_confirm'))) {
          const { error } = await supabase.from('history').delete().eq('user_id', session.user.id);
          if (!error) {
            setHistory([]);
            // Also clear hidden items list
            localStorage.removeItem(HIDDEN_ITEMS_KEY);
          } else {
             console.error('Error clearing history:', error);
          }
      }
  };

  const handleEditItem = async (
    originalItem: HistoryItem,
    updatedData: { productName: string; price: number; decision: 'bought' | 'saved' }
  ) => {
    if (!session || !supabase) return;

    try {
      // Calculate new hours based on the updated price and current hourly rate
      const hourlyRate = settings.monthlyNetSalary / (settings.weeklyHours * 4.33);
      const newTotalHoursDecimal = updatedData.price / hourlyRate;

      // Create a new entry in Supabase (keeping the original for admin purposes)
      const dbItem = {
        user_id: session.user.id,
        product_name: updatedData.productName || t('item_unnamed'),
        price: updatedData.price,
        currency: originalItem.currency,
        total_hours_decimal: newTotalHoursDecimal,
        decision: updatedData.decision,
        advice_used: originalItem.adviceUsed,
        date: new Date().toISOString()
      };

      const { data, error } = await supabase.from('history').insert(dbItem).select().single();

      if (error) throw error;

      if (data) {
        const newItem: HistoryItem = {
          id: data.id,
          productName: data.product_name,
          price: data.price,
          currency: data.currency,
          totalHoursDecimal: data.total_hours_decimal,
          decision: data.decision,
          date: data.date,
          adviceUsed: data.advice_used
        };

        // Save original item ID to hidden items list in localStorage
        // This way, user won't see it after reload, but it stays in Supabase for admin
        const hiddenItemsJson = localStorage.getItem(HIDDEN_ITEMS_KEY);
        const hiddenItemIds: string[] = hiddenItemsJson ? JSON.parse(hiddenItemsJson) : [];
        if (!hiddenItemIds.includes(originalItem.id)) {
          hiddenItemIds.push(originalItem.id);
          localStorage.setItem(HIDDEN_ITEMS_KEY, JSON.stringify(hiddenItemIds));
        }

        // For user: remove the old item and add the new one (appears as "edit")
        // For Supabase: both entries remain (original item stays in database)
        setHistory(prev => [newItem, ...prev.filter(item => item.id !== originalItem.id)]);
      }
    } catch (error) {
      console.error('Error creating edited item:', error);
    }
  };

  const handleOpenProfile = () => {
      setPreviousView(viewState === ViewState.SETTINGS ? ViewState.CALCULATOR : viewState);
      setViewState(ViewState.SETTINGS);
  };

  const handleOpenResetPassword = () => {
      setPreviousView(viewState);
      setViewState(ViewState.RESET_PASSWORD);
  };

  const handleResetSuccess = () => {
      setViewState(previousView === ViewState.RESET_PASSWORD ? ViewState.CALCULATOR : previousView);
  };

  const handleOpenDeleteAccount = () => {
      setPreviousView(viewState);
      setViewState(ViewState.DELETE_ACCOUNT);
  };

  const handleDeleteSuccess = () => {
      setViewState(ViewState.WELCOME);
  };

  const handleOpenHelp = () => {
      setViewState(ViewState.CALCULATOR);
      setShowTour(true);
  };

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  const getPageTitle = () => {
    switch(viewState) {
      case ViewState.CALCULATOR: return t('nav_calculator');
      case ViewState.HISTORY: return t('nav_history');
      case ViewState.LEVELS: return t('nav_levels');
      case ViewState.CHALLENGES: return t('nav_challenges');
      case ViewState.RESET_PASSWORD: return t('reset_password_title');
      case ViewState.DELETE_ACCOUNT: return t('delete_account_title');
      default: return t('app_name');
    }
  };

  // Splash Screen megjelenítése
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} isAppLoaded={!isLoading} />;
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h1 className="text-2xl font-semibold">Configuration required</h1>
          <p className="text-slate-200 leading-relaxed">{SUPABASE_CONFIG_MESSAGE}</p>
          <p className="text-slate-400 text-sm">Update your <code>.env</code> file with <strong>VITE_SUPABASE_URL</strong> and <strong>VITE_SUPABASE_ANON_KEY</strong> to enable authentication and data syncing.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col relative">
      
      {!session ? (
          viewState === ViewState.WELCOME ? (
            <WelcomeScreen onStart={handleStart} />
          ) : (
            <AuthScreen onAuthSuccess={handleAuthSuccess} />
          )
      ) : (
        <>
            {viewState === ViewState.ONBOARDING ? (
                 <SettingsForm
                    initialSettings={settings}
                    onSave={handleSaveSettings}
                    isFirstTime={true}
                />
            ) : (
                <>
                    {showTour && viewState === ViewState.CALCULATOR && (
                        <OnboardingTour onComplete={handleTourComplete} onStepChange={setTourStep} />
                    )}

                    <Sidebar
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                        onOpenProfile={handleOpenProfile}
                        onOpenResetPassword={handleOpenResetPassword}
                        onOpenDeleteAccount={handleOpenDeleteAccount}
                        onOpenHelp={handleOpenHelp}
                        settings={settings}
                        toggleTheme={toggleTheme}
                    />

                    {viewState === ViewState.SETTINGS ? (
                        <div className="flex flex-col h-full">
                            <TopBar title={t('settings_title')} onMenuClick={handleMenuClick} streak={streak} />
                            <div className="flex-1 overflow-hidden">
                        <SettingsForm
                            initialSettings={settings}
                            onSave={handleSaveSettings}
                            onCancel={() => setViewState(previousView)}
                        />
                    </div>
                        </div>
                    ) : viewState === ViewState.RESET_PASSWORD ? (
                        <div className="flex flex-col h-full">
                            <TopBar title={t('reset_password_title')} onMenuClick={handleMenuClick} streak={streak} />
                            <div className="flex-1 overflow-hidden">
                                <ResetPassword
                                    onSuccess={handleResetSuccess}
                                    onCancel={() => setViewState(previousView)}
                                />
                            </div>
                        </div>
                    ) : viewState === ViewState.DELETE_ACCOUNT ? (
                        <div className="flex flex-col h-full">
                            <TopBar title={t('delete_account_title')} onMenuClick={handleMenuClick} streak={streak} />
                            <div className="flex-1 overflow-hidden">
                                <DeleteAccount
                                    onSuccess={handleDeleteSuccess}
                                    onCancel={() => setViewState(previousView)}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            <TopBar title={getPageTitle()} onMenuClick={handleMenuClick} streak={streak} />
                            
                            <div className="flex-1 relative overflow-hidden">
                                {viewState === ViewState.CALCULATOR && (
                                    <Calculator 
                                        settings={settings} 
                                        onSaveHistory={handleSaveHistory}
                                    />
                                )}

                                {viewState === ViewState.HISTORY && (
                                    <History items={history} onClearHistory={handleClearHistory} onEditItem={handleEditItem} />
                                )}

                                {viewState === ViewState.LEVELS && (
                                    <Levels history={history} />
                                )}

                                {viewState === ViewState.CHALLENGES && (
                                    <Challenges />
                                )}
                            </div>

                            <Navigation currentView={viewState} onNavigate={setViewState} isHighlighted={showTour} tourStep={showTour ? tourStep : undefined} />
                        </div>
                    )}
                </>
            )}
        </>
      )}
    </div>
  );
};

export default App;
