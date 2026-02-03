import React from 'react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg">
                <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-xs" style={{ color: entry.color }}>
                        {entry.name}: Rp {entry.value.toLocaleString('id-ID')}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// Income vs Expense Line Chart
export const IncomeExpenseChart = ({ transactions, selectedMonth }) => {
    // Group transactions by date
    const dailyData = {};

    transactions.forEach(t => {
        if (!t.date) return;
        if (t.date.substring(0, 7) !== selectedMonth) return;

        const date = t.date.substring(8, 10); // Get day (DD)
        if (!dailyData[date]) {
            dailyData[date] = { date: `${parseInt(date)}`, income: 0, expense: 0 };
        }

        const amount = parseInt(t.amount.replace(/\./g, '')) || 0;
        if (t.type === 'income') {
            dailyData[date].income += amount;
        } else if (t.type === 'expense') {
            dailyData[date].expense += amount;
        }
    });

    const chartData = Object.values(dailyData).sort((a, b) => parseInt(a.date) - parseInt(b.date));

    if (chartData.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm">
                Tidak ada data transaksi
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                <XAxis
                    dataKey="date"
                    stroke="#64748b"
                    className="dark:stroke-slate-400"
                    tick={{ fontSize: 12 }}
                />
                <YAxis
                    stroke="#64748b"
                    className="dark:stroke-slate-400"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    wrapperStyle={{ fontSize: '12px' }}
                    iconType="line"
                />
                <Line
                    type="monotone"
                    dataKey="income"
                    name="Pemasukan"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 4 }}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="expense"
                    name="Pengeluaran"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: '#ef4444', r: 4 }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

// Budget Breakdown Pie Chart
export const BudgetPieChart = ({ budgetBreakdown }) => {
    const data = Object.entries(budgetBreakdown).map(([name, info]) => ({
        name,
        value: info.total,
        percentage: info.percentage
    }));

    if (data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm">
                Tidak ada data budget
            </div>
        );
    }

    // Color palette
    const COLORS = [
        '#3b82f6', // blue
        '#10b981', // green
        '#f59e0b', // amber
        '#ef4444', // red
        '#8b5cf6', // purple
        '#ec4899', // pink
        '#14b8a6', // teal
        '#f97316', // orange
    ];

    const CustomPieTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            return (
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg">
                    <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">{data.name}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                        Rp {data.value.toLocaleString('id-ID')}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                        {data.payload.percentage.toFixed(1)}% dari limit
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
        </ResponsiveContainer>
    );
};

// Category Spending Bar Chart
export const CategoryBarChart = ({ budgetBreakdown }) => {
    const data = Object.entries(budgetBreakdown)
        .map(([name, info]) => ({
            name: name.length > 15 ? name.substring(0, 15) + '...' : name,
            terpakai: info.total,
            limit: info.limit
        }))
        .sort((a, b) => b.terpakai - a.terpakai)
        .slice(0, 8); // Top 8 categories

    if (data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm">
                Tidak ada data kategori
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    className="dark:stroke-slate-400"
                    tick={{ fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                />
                <YAxis
                    stroke="#64748b"
                    className="dark:stroke-slate-400"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="terpakai" name="Terpakai" fill="#ef4444" radius={[8, 8, 0, 0]} />
                <Bar dataKey="limit" name="Limit" fill="#94a3b8" radius={[8, 8, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};
