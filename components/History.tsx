import React, { useState, useMemo } from 'react';
import { HistoryItem } from '../types';
import { Trash2, TrendingUp, TrendingDown, ShoppingBag, Pencil, X, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './Button';
import { getPriceReference, Language } from '../utils/priceReferences';

interface EditModalState {
  isOpen: boolean;
  item: HistoryItem | null;
  productName: string;
  price: string;
  decision: 'bought' | 'saved';
}

interface HistoryProps {
  items: HistoryItem[];
  onClearHistory: () => void;
  onEditItem: (originalItem: HistoryItem, updatedData: { productName: string; price: number; decision: 'bought' | 'saved' }) => void;
}

export const History: React.FC<HistoryProps> = ({ items, onClearHistory, onEditItem }) => {
  const { t, language } = useLanguage();
  const [editModal, setEditModal] = useState<EditModalState>({
    isOpen: false,
    item: null,
    productName: '',
    price: '',
    decision: 'saved'
  });

  const handleOpenEdit = (item: HistoryItem) => {
    setEditModal({
      isOpen: true,
      item,
      productName: item.productName,
      price: item.price.toString(),
      decision: item.decision
    });
  };

  const handleCloseEdit = () => {
    setEditModal({
      isOpen: false,
      item: null,
      productName: '',
      price: '',
      decision: 'saved'
    });
  };

  const handleSaveEdit = () => {
    if (!editModal.item) return;
    const priceNum = parseFloat(editModal.price);
    if (isNaN(priceNum) || priceNum <= 0) return;

    onEditItem(editModal.item, {
      productName: editModal.productName,
      price: priceNum,
      decision: editModal.decision
    });
    handleCloseEdit();
  };

  // Statistics calculations
  const stats = useMemo(() => {
    const saved = items.filter(i => i.decision === 'saved');
    const bought = items.filter(i => i.decision === 'bought');

    const savedHours = saved.reduce((acc, curr) => acc + curr.totalHoursDecimal, 0);
    const spentHours = bought.reduce((acc, curr) => acc + curr.totalHoursDecimal, 0);

    const savedMoney = saved.reduce((acc, curr) => acc + curr.price, 0);
    const spentMoney = bought.reduce((acc, curr) => acc + curr.price, 0);

    return { savedHours, spentHours, savedMoney, spentMoney };
  }, [items]);

  const currency = items.length > 0 ? items[0].currency : 'HUF';

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full pb-20 px-6 text-center">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
          <ShoppingBag size={28} className="md:hidden" />
          <ShoppingBag size={32} className="hidden md:block" />
        </div>
        <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white mb-2">{t('history_empty_title')}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm max-w-xs">
          {t('history_empty_desc')}
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col w-full relative">
      {/* Edit Modal */}
      {editModal.isOpen && editModal.item && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('edit_item')}</h3>
              <button
                onClick={handleCloseEdit}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('what_to_buy')}</label>
                <input
                  type="text"
                  value={editModal.productName}
                  onChange={(e) => setEditModal(prev => ({ ...prev, productName: e.target.value }))}
                  placeholder={t('placeholder_item')}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('price_label')} ({editModal.item.currency})</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={editModal.price}
                  onChange={(e) => setEditModal(prev => ({ ...prev, price: e.target.value.replace(/[^0-9.]/g, '') }))}
                  placeholder="0"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-lg font-bold text-slate-900 dark:text-white placeholder-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('decision_label')}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setEditModal(prev => ({ ...prev, decision: 'saved' }))}
                    className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-semibold text-sm ${
                      editModal.decision === 'saved'
                        ? 'bg-emerald-100 dark:bg-emerald-600/30 border-emerald-400 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                    }`}
                  >
                    <Check size={16} />
                    {t('tag_saved')}
                  </button>
                  <button
                    onClick={() => setEditModal(prev => ({ ...prev, decision: 'bought' }))}
                    className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-semibold text-sm ${
                      editModal.decision === 'bought'
                        ? 'bg-rose-100 dark:bg-rose-600/30 border-rose-400 text-rose-700 dark:text-rose-300'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                    }`}
                  >
                    <X size={16} />
                    {t('tag_bought')}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button onClick={handleSaveEdit} fullWidth>
                  {t('save')}
                </Button>
                <p className="text-[10px] text-center text-slate-400 mt-2">{t('edit_creates_new')}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-3 md:p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800 shrink-0">

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 gap-2 md:gap-3 mb-3">
            {/* Saved Time Card */}
            <div className="bg-emerald-50 dark:bg-emerald-600/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-3 md:p-4">
                <div className="flex items-center gap-1.5 md:gap-2 text-emerald-600 dark:text-emerald-400 mb-0.5 md:mb-1">
                    <TrendingUp size={12} className="md:hidden" />
                    <TrendingUp size={14} className="hidden md:block" />
                    <span className="text-[10px] md:text-xs font-bold uppercase">{t('stats_saved_time')}</span>
                </div>
                <div className="text-lg md:text-xl font-black text-slate-900 dark:text-white mb-0.5">
                    {stats.savedHours.toFixed(1)} <span className="text-xs md:text-sm font-medium text-slate-500">{t('hour_short')}</span>
                </div>
                <div className="text-[10px] md:text-xs text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                    + {stats.savedMoney.toLocaleString()} {currency}
                </div>
                {stats.savedMoney > 0 && getPriceReference(stats.savedMoney, language as Language) && (
                    <div className="mt-2 pt-2 border-t border-emerald-200 dark:border-emerald-500/20 text-[10px] md:text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                        {language === 'hu' ? '≈ ' : language === 'de' ? '≈ ' : '≈ '}
                        {getPriceReference(stats.savedMoney, language as Language)}
                    </div>
                )}
            </div>

            {/* Spent Time Card */}
            <div className="bg-rose-50 dark:bg-rose-600/10 border border-rose-200 dark:border-rose-500/20 rounded-xl p-3 md:p-4">
                <div className="flex items-center gap-1.5 md:gap-2 text-rose-600 dark:text-rose-400 mb-0.5 md:mb-1">
                    <TrendingDown size={12} className="md:hidden" />
                    <TrendingDown size={14} className="hidden md:block" />
                    <span className="text-[10px] md:text-xs font-bold uppercase">{t('stats_spent_time')}</span>
                </div>
                <div className="text-lg md:text-xl font-black text-slate-900 dark:text-white mb-0.5">
                    {stats.spentHours.toFixed(1)} <span className="text-xs md:text-sm font-medium text-slate-500">{t('hour_short')}</span>
                </div>
                <div className="text-[10px] md:text-xs text-rose-600 dark:text-rose-400 font-mono font-medium">
                    - {stats.spentMoney.toLocaleString()} {currency}
                </div>
                {stats.spentMoney > 0 && getPriceReference(stats.spentMoney, language as Language) && (
                    <div className="mt-2 pt-2 border-t border-rose-200 dark:border-rose-500/20 text-[10px] md:text-xs text-rose-700 dark:text-rose-300 font-medium">
                        {language === 'hu' ? '≈ ' : language === 'de' ? '≈ ' : '≈ '}
                        {getPriceReference(stats.spentMoney, language as Language)}
                    </div>
                )}
            </div>
        </div>

         <div className="flex justify-end">
             <button
                onClick={onClearHistory}
                className="text-[10px] md:text-xs font-medium text-slate-500 hover:text-rose-500 transition-colors flex items-center gap-1 py-1"
             >
                <Trash2 size={12} className="md:hidden" />
                <Trash2 size={14} className="hidden md:block" />
                {t('clear_history')}
             </button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3 no-scrollbar pb-24">
        {items.map((item) => (
          <div
            key={item.id}
            className={`relative bg-white dark:bg-slate-800 rounded-xl p-3 md:p-4 border-l-4 shadow-sm ${
                item.decision === 'bought'
                ? 'border-rose-500'
                : 'border-emerald-500'
            }`}
          >
            {/* Header: Name and Tag */}
            <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-semibold text-sm md:text-base text-slate-900 dark:text-white truncate flex-1">
                    {item.productName || t('item_unnamed')}
                </h4>
                {item.decision === 'bought' ? (
                    <span className="shrink-0 px-1.5 md:px-2 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[9px] md:text-[10px] rounded-full font-bold uppercase tracking-wide">{t('tag_bought')}</span>
                ) : (
                    <span className="shrink-0 px-1.5 md:px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] md:text-[10px] rounded-full font-bold uppercase tracking-wide">{t('tag_saved')}</span>
                )}
            </div>

            {/* Footer: Price, Hours, Date */}
            <div className="flex items-end justify-between gap-2">
                <div className="flex flex-col gap-0.5">
                    <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-mono">
                        {item.price.toLocaleString()} {item.currency}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] md:text-xs text-slate-400">
                            {new Date(item.date).toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' })}
                        </span>
                        <button
                            onClick={() => handleOpenEdit(item)}
                            className={`p-1 rounded-md transition-colors ${
                                item.decision === 'bought'
                                    ? 'text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/30'
                                    : 'text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                            }`}
                            title={t('edit')}
                        >
                            <Pencil size={12} className="md:hidden" />
                            <Pencil size={14} className="hidden md:block" />
                        </button>
                    </div>
                </div>
                <div className={`font-bold text-base md:text-lg ${
                    item.decision === 'bought' ? 'text-rose-500' : 'text-emerald-500'
                }`}>
                    {Math.floor(item.totalHoursDecimal)}h {Math.round((item.totalHoursDecimal % 1) * 60)}m
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
