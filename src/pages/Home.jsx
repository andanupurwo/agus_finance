import React from 'react';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { parseRupiah, formatRupiah, isCurrentMonth, getMonthRange } from '../utils/formatter';
import { useTransactions } from '../hooks/useTransactions';
import { Summary } from '../components/Summary';

export const Home = ({
  budgets,
  wallets,
  transactions,
  nominal,
  setNominal,
  description,
  setDescription,
  selectedTarget,
  setSelectedTarget,
  transactionDate,
  setTransactionDate,
  transactionType,
  setTransactionType,
  showTargetModal,
  setShowTargetModal,
  loading,
  user,
  setLoading,
  showToast,
  showConfirm,
  isReadOnly
}) => {
  const { handleDailyTransaction, handleNominalInput } = useTransactions(showToast, showConfirm);

  const handleTransactionClick = (type) => {
    if (!nominal) {
      showToast?.('Nominal harus diisi', 'error');
      return;
    }
    if (!isCurrentMonth(transactionDate)) {
      showToast?.('⚠️ Transaksi hanya bisa dibuat di bulan berjalan saja', 'error');
      return;
    }
    setTransactionType(type);
    setShowTargetModal(true);
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    if (!isCurrentMonth(newDate)) {
      showToast?.('⚠️ Tanggal harus di bulan berjalan (bulan ini)', 'error');
      return;
    }
    setTransactionDate(newDate);
  };

  const handleTargetSelect = (targetId) => {
    setSelectedTarget(targetId);
    setShowTargetModal(false);
    handleDailyTransaction(
      transactionType,
      nominal,
      description,
      targetId,
      transactionDate,
      user,
      wallets,
      budgets,
      setNominal,
      setDescription,
      setSelectedTarget,
      setLoading
    );
    setTransactionType(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 px-2">
      {/* BUDGET LIST (HORIZONTAL) */}
      <div>
        <div className="flex justify-between items-end mb-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Budgets Aktif</h2>
          <span className="text-xs text-slate-600 dark:text-slate-500">Geser &rarr;</span>
        </div>
        {budgets.length === 0 ? (
          <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-xs border border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-100 dark:bg-slate-900/40 transition-colors duration-300">Belum ada budget. Buat di menu Manage.</div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar snap-x">
            {budgets.map((b) => {
              const used = parseRupiah(b.limit) - parseRupiah(b.amount);
              const usagePercent = parseRupiah(b.limit) > 0 ? (used / parseRupiah(b.limit)) * 100 : 0;
              let cardColor = "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-800";
              let barColor = "bg-blue-500 dark:bg-blue-600";
              
              // Traffic Light Logic - only if budget has limit
              if (parseRupiah(b.limit) > 0) {
                if (usagePercent >= 80) {
                  cardColor = "bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800";
                  barColor = "bg-red-500 dark:bg-red-600";
                } else if (usagePercent >= 50) {
                  cardColor = "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-800";
                  barColor = "bg-yellow-500 dark:bg-yellow-600";
                } else if (usagePercent > 0) {
                  cardColor = "bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-200 border border-green-300 dark:border-green-800";
                  barColor = "bg-green-500 dark:bg-green-600";
                }
              }
              
              return (
                <div key={b.id} className={`min-w-[150px] sm:min-w-[170px] p-4 rounded-2xl backdrop-blur-sm snap-center flex flex-col justify-between h-28 transition-colors duration-300 ${cardColor}`}>
                  <span className="text-xs font-bold opacity-80 truncate">{b.name}</span>
                  <span className="text-xl font-bold tracking-tight leading-tight truncate">Rp {b.amount}</span>
                  {parseRupiah(b.limit) > 0 && (
                    <div className="w-full bg-black/10 dark:bg-black/20 h-1.5 rounded-full">
                       <div className={`h-full rounded-full opacity-80 ${barColor}`} style={{width: `${Math.min(100, usagePercent)}%`}}></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* INPUT TRANSAKSI HARIAN */}
      {!isReadOnly && (
      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm relative overflow-hidden transition-colors duration-300">
        <div className="mb-6">
          <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-2 block">Nominal Transaksi</label>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-colors duration-300">
            <span className="text-2xl font-bold text-slate-600 dark:text-slate-400">Rp</span>
            <input type="text" inputMode="numeric" value={nominal} onChange={(e) => handleNominalInput(e, setNominal)} placeholder="0" className="w-full bg-transparent text-4xl font-bold text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-700 outline-none" />
          </div>
        </div>

        <div className="mb-6">
           <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-2 block">Tanggal Transaksi (Bulan Berjalan Saja)</label>
           <input type="date" value={transactionDate} onChange={handleDateChange} min={getMonthRange().min} max={getMonthRange().max} className="w-full appearance-none bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:border-blue-500 dark:focus:border-blue-400 outline-none mb-3 transition-colors duration-300" />
           
           <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Keterangan (mis: Beli Bensin)" className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 rounded-xl px-4 py-3 text-sm focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors duration-300" />
        </div>

        <div className="flex gap-2 sm:gap-3">
          <button onClick={() => handleTransactionClick('income')} disabled={loading} className="flex-1 bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500 text-white px-2 sm:px-4 py-3 sm:py-4 rounded-xl font-bold flex items-center justify-center gap-1 sm:gap-2 shadow-lg active:scale-95 transition-all disabled:opacity-50 text-sm sm:text-base">
             <ArrowDownCircle size={18} className="sm:w-5 sm:h-5" /> <span className="hidden sm:inline">Pemasukan</span><span className="sm:hidden">Masuk</span>
          </button>
          <button onClick={() => handleTransactionClick('expense')} disabled={loading} className="flex-1 bg-red-600 hover:bg-red-700 dark:hover:bg-red-500 text-white px-2 sm:px-4 py-3 sm:py-4 rounded-xl font-bold flex items-center justify-center gap-1 sm:gap-2 shadow-lg active:scale-95 transition-all disabled:opacity-50 text-sm sm:text-base">
             <ArrowUpCircle size={18} className="sm:w-5 sm:h-5" /> <span className="hidden sm:inline">Pengeluaran</span><span className="sm:hidden">Keluar</span>
          </button>
        </div>
      </div>
      )}

      {isReadOnly && (
        <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-800 rounded-2xl p-4 text-center transition-colors duration-300">
          <p className="text-sm font-bold text-blue-900 dark:text-blue-300">📖 Mode Demo - Hanya bisa melihat, tidak bisa mengubah</p>
        </div>
      )}

      {/* DASHBOARD SUMMARY (pinned at bottom) */}
      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors duration-300">
        <Summary transactions={transactions} budgets={budgets} />
      </div>

      {/* MODAL PILIH TARGET */}
      {showTargetModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 px-4" onClick={() => setShowTargetModal(false)}>
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 animate-in zoom-in-95 duration-300 transition-colors shadow-2xl border border-slate-200 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {transactionType === 'income' ? '💰 Pilih Wallet Tujuan' : '💸 Pilih Budget Sumber'}
              </h3>
              <button onClick={() => setShowTargetModal(false)} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 text-2xl leading-none transition-colors">
                ✕
              </button>
            </div>
            
            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {transactionType === 'income' ? (
                wallets.length === 0 ? (
                  <p className="text-slate-500 dark:text-slate-400 text-sm text-center py-4">Belum ada wallet</p>
                ) : (
                  wallets.map(w => (
                    <button
                      key={w.id}
                      onClick={() => handleTargetSelect(w.id)}
                      className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white p-4 rounded-xl text-left transition-all active:scale-95"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{w.name}</span>
                        <span className="text-slate-600 dark:text-slate-400 text-sm">Saldo: {w.amount}</span>
                      </div>
                    </button>
                  ))
                )
              ) : (
                budgets.length === 0 ? (
                  <p className="text-slate-500 dark:text-slate-400 text-sm text-center py-4">Belum ada budget</p>
                ) : (
                  budgets.map(b => (
                    <button
                      key={b.id}
                      onClick={() => handleTargetSelect(b.id)}
                      className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white p-4 rounded-xl text-left transition-all active:scale-95"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{b.name}</span>
                        <span className="text-slate-600 dark:text-slate-400 text-sm">Sisa: {b.amount}</span>
                      </div>
                    </button>
                  ))
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
