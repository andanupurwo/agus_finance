import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Calendar, Wallet, ArrowUpCircle, ArrowDownCircle, BarChart3, LineChart as LineChartIcon } from 'lucide-react';
import { parseRupiah, formatRupiah, isCurrentMonth } from '../utils/formatter';
import { IncomeExpenseChart, BudgetPieChart, CategoryBarChart } from '../components/Charts';

export const Report = ({ transactions, budgets, wallets }) => {
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    });

    // Generate list of available months from transactions
    const availableMonths = useMemo(() => {
        const months = new Set();
        transactions.forEach(t => {
            if (t.date) {
                const monthKey = t.date.substring(0, 7); // YYYY-MM
                months.add(monthKey);
            }
        });
        // Add current month if not present
        const today = new Date();
        const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
        months.add(currentMonth);

        return Array.from(months).sort().reverse();
    }, [transactions]);

    // Filter transactions by selected month
    const monthTransactions = useMemo(() => {
        return transactions.filter(t => {
            if (!t.date) return false;
            return t.date.substring(0, 7) === selectedMonth;
        });
    }, [transactions, selectedMonth]);

    // Calculate monthly summary
    const summary = useMemo(() => {
        let totalIncome = 0;
        let totalExpense = 0;

        monthTransactions.forEach(t => {
            const amount = parseRupiah(t.amount);
            if (t.type === 'income') {
                totalIncome += amount;
            } else if (t.type === 'expense') {
                totalExpense += amount;
            }
        });

        return {
            income: totalIncome,
            expense: totalExpense,
            net: totalIncome - totalExpense
        };
    }, [monthTransactions]);

    // Budget breakdown
    const budgetBreakdown = useMemo(() => {
        const breakdown = {};

        budgets.forEach(budget => {
            const budgetExpenses = monthTransactions.filter(t =>
                t.type === 'expense' && t.targetId === budget.id
            );
            const total = budgetExpenses.reduce((sum, t) => sum + parseRupiah(t.amount), 0);

            if (total > 0) {
                breakdown[budget.name] = {
                    total,
                    limit: parseRupiah(budget.limit),
                    percentage: parseRupiah(budget.limit) > 0 ? (total / parseRupiah(budget.limit)) * 100 : 0,
                    count: budgetExpenses.length
                };
            }
        });

        return breakdown;
    }, [budgets, monthTransactions]);

    // Top transactions
    const topTransactions = useMemo(() => {
        const expenses = monthTransactions
            .filter(t => t.type === 'expense')
            .sort((a, b) => parseRupiah(b.amount) - parseRupiah(a.amount))
            .slice(0, 5);

        const incomes = monthTransactions
            .filter(t => t.type === 'income')
            .sort((a, b) => parseRupiah(b.amount) - parseRupiah(a.amount))
            .slice(0, 5);

        return { expenses, incomes };
    }, [monthTransactions]);

    // Wallet summary
    const walletSummary = useMemo(() => {
        const total = wallets.reduce((sum, w) => sum + parseRupiah(w.amount), 0);
        return { wallets, total };
    }, [wallets]);

    // Format month for display
    const formatMonthDisplay = (monthKey) => {
        const [year, month] = monthKey.split('-');
        const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        return `${monthNames[parseInt(month) - 1]} ${year}`;
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-500 pb-24 px-1.5">
            {/* HEADER */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Laporan Keuangan</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Analisis pemasukan, pengeluaran, dan budget Anda</p>
            </div>

            {/* MONTH SELECTOR */}
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-colors duration-300">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-2 block flex items-center gap-2">
                    <Calendar size={14} />
                    Pilih Bulan
                </label>
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors"
                >
                    {availableMonths.map(month => (
                        <option key={month} value={month}>
                            {formatMonthDisplay(month)}
                        </option>
                    ))}
                </select>
            </div>

            {/* MONTHLY SUMMARY CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Total Income */}
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-4 shadow-sm transition-colors duration-300">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 dark:bg-emerald-600 flex items-center justify-center">
                            <ArrowDownCircle size={20} className="text-white" />
                        </div>
                        <TrendingUp size={16} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase mb-1">Pemasukan</p>
                    <p className="text-xl font-bold text-emerald-900 dark:text-emerald-300">
                        Rp {summary.income.toLocaleString('id-ID')}
                    </p>
                </div>

                {/* Total Expense */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/40 dark:to-red-900/40 border border-red-300 dark:border-red-800 rounded-2xl p-4 shadow-sm transition-colors duration-300">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 rounded-full bg-red-500 dark:bg-red-600 flex items-center justify-center">
                            <ArrowUpCircle size={20} className="text-white" />
                        </div>
                        <TrendingDown size={16} className="text-red-600 dark:text-red-400" />
                    </div>
                    <p className="text-xs font-bold text-red-700 dark:text-red-400 uppercase mb-1">Pengeluaran</p>
                    <p className="text-xl font-bold text-red-900 dark:text-red-300">
                        Rp {summary.expense.toLocaleString('id-ID')}
                    </p>
                </div>

                {/* Net Income */}
                <div className={`bg-gradient-to-br ${summary.net >= 0
                    ? 'from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/40 border-blue-300 dark:border-blue-800'
                    : 'from-orange-50 to-orange-100 dark:from-orange-950/40 dark:to-orange-900/40 border-orange-300 dark:border-orange-800'
                    } border rounded-2xl p-4 shadow-sm transition-colors duration-300`}>
                    <div className="flex items-center justify-between mb-2">
                        <div className={`w-10 h-10 rounded-full ${summary.net >= 0
                            ? 'bg-blue-500 dark:bg-blue-600'
                            : 'bg-orange-500 dark:bg-orange-600'
                            } flex items-center justify-center`}>
                            <DollarSign size={20} className="text-white" />
                        </div>
                        {summary.net >= 0 ? (
                            <TrendingUp size={16} className="text-blue-600 dark:text-blue-400" />
                        ) : (
                            <TrendingDown size={16} className="text-orange-600 dark:text-orange-400" />
                        )}
                    </div>
                    <p className={`text-xs font-bold ${summary.net >= 0
                        ? 'text-blue-700 dark:text-blue-400'
                        : 'text-orange-700 dark:text-orange-400'
                        } uppercase mb-1`}>
                        {summary.net >= 0 ? 'Surplus' : 'Defisit'}
                    </p>
                    <p className={`text-xl font-bold ${summary.net >= 0
                        ? 'text-blue-900 dark:text-blue-300'
                        : 'text-orange-900 dark:text-orange-300'
                        }`}>
                        Rp {Math.abs(summary.net).toLocaleString('id-ID')}
                    </p>
                </div>
            </div>

            {/* INCOME VS EXPENSE TREND CHART */}
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-colors duration-300">
                <div className="flex items-center gap-2 mb-4">
                    <LineChartIcon size={18} className="text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tren Pemasukan vs Pengeluaran</h3>
                </div>
                <IncomeExpenseChart transactions={transactions} selectedMonth={selectedMonth} />
            </div>

            {/* BUDGET CHARTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pie Chart */}
                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-colors duration-300">
                    <div className="flex items-center gap-2 mb-4">
                        <PieChart size={18} className="text-purple-600 dark:text-purple-400" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Distribusi Budget</h3>
                    </div>
                    <BudgetPieChart budgetBreakdown={budgetBreakdown} />
                </div>

                {/* Bar Chart */}
                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-colors duration-300">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 size={18} className="text-indigo-600 dark:text-indigo-400" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Perbandingan Kategori</h3>
                    </div>
                    <CategoryBarChart budgetBreakdown={budgetBreakdown} />
                </div>
            </div>

            {/* BUDGET BREAKDOWN */}
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-colors duration-300">
                <div className="flex items-center gap-2 mb-4">
                    <PieChart size={18} className="text-purple-600 dark:text-purple-400" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Breakdown Budget</h3>
                </div>

                {Object.keys(budgetBreakdown).length === 0 ? (
                    <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-sm border border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-100 dark:bg-slate-900/40">
                        Tidak ada pengeluaran di bulan ini
                    </div>
                ) : (
                    <div className="space-y-3">
                        {Object.entries(budgetBreakdown)
                            .sort(([, a], [, b]) => b.total - a.total)
                            .map(([name, data]) => (
                                <div key={name} className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-sm text-slate-900 dark:text-white">{name}</span>
                                        <span className="text-xs text-slate-600 dark:text-slate-400">
                                            {data.count} transaksi
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-slate-600 dark:text-slate-400">
                                            Rp {data.total.toLocaleString('id-ID')} / Rp {data.limit.toLocaleString('id-ID')}
                                        </span>
                                        <span className={`text-xs font-bold ${data.percentage > 100 ? 'text-red-600 dark:text-red-400' :
                                            data.percentage > 80 ? 'text-orange-600 dark:text-orange-400' :
                                                'text-green-600 dark:text-green-400'
                                            }`}>
                                            {data.percentage.toFixed(0)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${data.percentage > 100 ? 'bg-red-500 dark:bg-red-600' :
                                                data.percentage > 80 ? 'bg-orange-500 dark:bg-orange-600' :
                                                    'bg-green-500 dark:bg-green-600'
                                                }`}
                                            style={{ width: `${Math.min(100, data.percentage)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>

            {/* WALLET SUMMARY */}
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-colors duration-300">
                <div className="flex items-center gap-2 mb-4">
                    <Wallet size={18} className="text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Saldo Wallet Saat Ini</h3>
                </div>

                {walletSummary.wallets.length === 0 ? (
                    <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-sm border border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-100 dark:bg-slate-900/40">
                        Belum ada wallet
                    </div>
                ) : (
                    <div className="space-y-2">
                        {walletSummary.wallets.map(wallet => (
                            <div key={wallet.id} className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-sm text-slate-900 dark:text-white">{wallet.name}</p>
                                    {wallet.description && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{wallet.description}</p>
                                    )}
                                </div>
                                <p className="font-bold text-sm text-slate-900 dark:text-white">{wallet.amount}</p>
                            </div>
                        ))}
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-300 dark:border-indigo-800 rounded-xl p-3 flex justify-between items-center mt-3">
                            <p className="font-bold text-sm text-indigo-900 dark:text-indigo-300">Total Aset</p>
                            <p className="font-bold text-lg text-indigo-900 dark:text-indigo-300">
                                Rp {walletSummary.total.toLocaleString('id-ID')}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* TOP TRANSACTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Top Expenses */}
                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-colors duration-300">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 size={18} className="text-red-600 dark:text-red-400" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top 5 Pengeluaran</h3>
                    </div>

                    {topTransactions.expenses.length === 0 ? (
                        <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-sm border border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-100 dark:bg-slate-900/40">
                            Tidak ada pengeluaran
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {topTransactions.expenses.map((t, idx) => (
                                <div key={t.id} className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg p-3 flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-red-500 dark:bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{t.title}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{t.target}</p>
                                    </div>
                                    <p className="font-bold text-sm text-red-600 dark:text-red-400 flex-shrink-0">
                                        Rp {t.amount}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Top Incomes */}
                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-colors duration-300">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 size={18} className="text-emerald-600 dark:text-emerald-400" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top 5 Pemasukan</h3>
                    </div>

                    {topTransactions.incomes.length === 0 ? (
                        <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-sm border border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-100 dark:bg-slate-900/40">
                            Tidak ada pemasukan
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {topTransactions.incomes.map((t, idx) => (
                                <div key={t.id} className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-lg p-3 flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 dark:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{t.title}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{t.target}</p>
                                    </div>
                                    <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                                        Rp {t.amount}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
