import React from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { parseRupiah, formatRupiah } from '../utils/formatter';

export const BudgetTransactionModal = ({ budget, transactions, onClose, isOpen }) => {
    if (!isOpen || !budget) return null;

    // Filter transaksi expense yang menargetkan budget ini
    const budgetTransactions = transactions
        .filter(t => t.type === 'expense' && t.targetId === budget.id)
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    // Hitung statistik budget
    const used = budgetTransactions.reduce((sum, t) => sum + parseRupiah(t.amount), 0);
    const available = parseRupiah(budget.limit) - used;
    const usagePercent = parseRupiah(budget.limit) > 0 ? (used / parseRupiah(budget.limit)) * 100 : 0;

    // Color coding berdasarkan usage
    let headerColor = "bg-blue-100 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800";
    let barColor = "bg-blue-500 dark:bg-blue-600";
    let textColor = "text-blue-900 dark:text-blue-200";

    if (parseRupiah(budget.limit) > 0) {
        if (usagePercent >= 80) {
            headerColor = "bg-red-100 dark:bg-red-950/40 border-red-300 dark:border-red-800";
            barColor = "bg-red-500 dark:bg-red-600";
            textColor = "text-red-900 dark:text-red-200";
        } else if (usagePercent >= 50) {
            headerColor = "bg-yellow-100 dark:bg-yellow-950/40 border-yellow-300 dark:border-yellow-800";
            barColor = "bg-yellow-500 dark:bg-yellow-600";
            textColor = "text-yellow-900 dark:text-yellow-200";
        } else if (usagePercent > 0) {
            headerColor = "bg-green-100 dark:bg-green-950/40 border-green-300 dark:border-green-800";
            barColor = "bg-green-500 dark:bg-green-600";
            textColor = "text-green-900 dark:text-green-200";
        }
    }

    return (
        <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-white/40 dark:bg-black/60 backdrop-blur-md animate-in fade-in duration-300 px-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300 transition-colors flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex-shrink-0 p-6 pb-4">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                                💰 {budget.name}
                            </h3>
                            {budget.description && (
                                <p className="text-sm text-slate-600 dark:text-slate-400">{budget.description}</p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="ml-4 flex-shrink-0 p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Budget Info Card */}
                    <div className={`p-4 rounded-xl border ${headerColor} transition-colors duration-300`}>
                        <div className="grid grid-cols-3 gap-3 mb-3">
                            <div>
                                <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 block mb-1">Anggaran</span>
                                <span className={`text-lg font-bold block ${textColor}`}>
                                    Rp {formatRupiah(parseRupiah(budget.limit))}
                                </span>
                            </div>
                            <div>
                                <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 block mb-1">Terpakai</span>
                                <span className={`text-lg font-bold block ${textColor}`}>
                                    Rp {formatRupiah(used)}
                                </span>
                            </div>
                            <div>
                                <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 block mb-1">Tersisa</span>
                                <span className={`text-lg font-bold block ${textColor}`}>
                                    Rp {formatRupiah(available)}
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        {parseRupiah(budget.limit) > 0 && (
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">
                                        Penggunaan
                                    </span>
                                    <span className={`text-xs font-bold ${textColor}`}>
                                        {usagePercent.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="w-full bg-black/10 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${barColor} transition-all duration-300`}
                                        style={{ width: `${Math.min(100, usagePercent)}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Transaction List */}
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                    <div className="flex items-center justify-between mb-3 sticky top-0 bg-white dark:bg-slate-900 pt-2 pb-2 -mt-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            Riwayat Transaksi
                        </h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            {budgetTransactions.length} transaksi
                        </span>
                    </div>

                    {budgetTransactions.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="text-5xl mb-3">📭</div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
                                Belum ada transaksi
                            </p>
                            <p className="text-slate-400 dark:text-slate-500 text-xs">
                                Transaksi pengeluaran untuk budget ini akan muncul di sini
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {budgetTransactions.map((t) => {
                                const date = t.date || (t.createdAt ? new Date(t.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '');
                                const time = t.time || (t.createdAt ? new Date(t.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '');

                                return (
                                    <div
                                        key={t.id}
                                        className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors duration-300"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0 text-red-600 dark:text-red-500">
                                                <ArrowUpRight size={18} />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                                                        {t.title}
                                                    </h5>
                                                    <span className="font-bold text-sm text-red-600 dark:text-red-400 flex-shrink-0">
                                                        - Rp {t.amount}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-600 dark:text-slate-500">
                                                    {date && <span>📅 {date}</span>}
                                                    {time && <><span>•</span><span>🕐 {time}</span></>}
                                                    {t.user && <><span>•</span><span>👤 {t.user}</span></>}
                                                </div>

                                                {t.description && (
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic">
                                                        "{t.description}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
