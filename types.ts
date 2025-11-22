export interface UserSettings {
  monthlyNetSalary: number;
  weeklyHours: number;
  currency: string;
  city: string;
  age: number;
  isSetup: boolean;
  theme: 'light' | 'dark';
}

export interface CalculationResult {
  hours: number;
  minutes: number;
  totalHoursDecimal: number;
  priceNum: number;
}

export enum ViewState {
  WELCOME = 'WELCOME',
  AUTH = 'AUTH',
  ONBOARDING = 'ONBOARDING',
  CALCULATOR = 'CALCULATOR',
  HISTORY = 'HISTORY',
  SETTINGS = 'SETTINGS',
  LEVELS = 'LEVELS',
  CHALLENGES = 'CHALLENGES',
  RESET_PASSWORD = 'RESET_PASSWORD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT'
}

export interface HistoryItem {
  id: string;
  productName: string;
  price: number;
  currency: string;
  totalHoursDecimal: number;
  decision: 'bought' | 'saved';
  date: string;
  adviceUsed?: string;
}

export type Language = 'hu' | 'en' | 'de';
