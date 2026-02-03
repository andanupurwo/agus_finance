# Chart Visualization Documentation

Dokumentasi lengkap untuk fitur visualisasi chart di Agus Finance Report page.

---

## 📊 Chart Components

### 1. **Income vs Expense Line Chart**
**File:** `src/components/Charts.jsx` → `IncomeExpenseChart`

**Fungsi:**
- Menampilkan tren harian pemasukan vs pengeluaran
- Data dikelompokkan per tanggal dalam bulan yang dipilih
- Visualisasi dengan 2 garis (hijau untuk income, merah untuk expense)

**Props:**
- `transactions`: Array of all transactions
- `selectedMonth`: String (format: "YYYY-MM")

**Features:**
- ✅ Interactive tooltip on hover
- ✅ Responsive design (menyesuaikan lebar layar)
- ✅ Automatic Y-axis formatting (dalam ribuan: "50k")
- ✅ Click on data points for detail
- ✅ Dark mode support

**Data Processing:**
```javascript
// Group transactions by day
{
  "01": { date: "1", income: 500000, expense: 200000 },
  "02": { date: "2", income: 0, expense: 150000 },
  ...
}
```

**Visual:**
- Green line (#10b981): Income
- Red line (#ef4444): Expense
- Dots on each data point
- Grid background for easy reading

---

### 2. **Budget Pie Chart**
**File:** `src/components/Charts.jsx` → `BudgetPieChart`

**Fungsi:**
- Menampilkan distribusi pengeluaran per kategori budget
- Visualisasi proporsi budget yang terpakai
- Warna berbeda untuk setiap kategori

**Props:**
- `budgetBreakdown`: Object with budget data
  ```javascript
  {
    "Makan": { total: 500000, limit: 1000000, percentage: 50 },
    "Transport": { total: 300000, limit: 500000, percentage: 60 },
    ...
  }
  ```

**Features:**
- ✅ 8 vibrant colors (auto-rotates)
- ✅ Percentage labels on slices
- ✅ Custom tooltip with budget details
- ✅ Shows percentage vs limit
- ✅ Interactive (hover to highlight)

**Color Palette:**
```javascript
[blue, green, amber, red, purple, pink, teal, orange]
```

---

### 3. **Category Bar Chart**
**File:** `src/components/Charts.jsx` → `CategoryBarChart`

**Fungsi:**
- Membandingkan pengeluaran vs limit budget per kategori
- Menampilkan top 8 kategori (sorted by spending)
- Visualisasi bar chart horizontal

**Props:**
- `budgetBreakdown`: Same as BudgetPieChart

**Features:**
- ✅ Dual bars (Terpakai vs Limit)
- ✅ Top 8 categories only (untuk readability)
- ✅ Angled X-axis labels untuk nama panjang
- ✅ Color coded:
  - Red (#ef4444): Terpakai (spent)
  - Gray (#94a3b8): Limit
- ✅ Y-axis dalam ribuan

**Visual:**
- Red bars show actual spending
- Gray bars show budget limit
- Easy to spot over-budget categories

---

## 🎨 Styling & Theming

### Dark Mode Support
Semua chart mendukung dark mode dengan:
```javascript
className="dark:stroke-slate-400"  // Axis lines
stroke="#64748b"                   // Light mode axis
```

### Responsive Design
```jsx
<ResponsiveContainer width="100%" height={300}>
```
- Width: 100% dari container parent
- Height: Fixed 300px (optimal untuk mobile & desktop)
- Auto-adjusts on screen resize

### Custom Tooltips
```jsx
<CustomTooltip />
```
- White background (dark: slate-800)
- Border with rounded corners
- Shows formatted currency (Rp)
- Multi-line for multiple data points

---

## 📱 Mobile Optimization

### Touch Interactions
- ✅ Tap to view tooltip
- ✅ Pinch to zoom (browser native)
- ✅ Smooth scrolling past charts

### Performance
- Memoized data processing
- Only re-renders when selectedMonth changes
- Lightweight recharts library (~50kb gzipped)

### Layout
- Stack vertically on mobile (grid-cols-1)
- Side-by-side on desktop (md:grid-cols-2)

---

## 🔧 Usage in Report Page

### Integration
```jsx
import { IncomeExpenseChart, BudgetPieChart, CategoryBarChart } from '../components/Charts';

// Inside Report component
<IncomeExpenseChart 
  transactions={transactions} 
  selectedMonth={selectedMonth} 
/>

<BudgetPieChart 
  budgetBreakdown={budgetBreakdown} 
/>

<CategoryBarChart 
  budgetBreakdown={budgetBreakdown} 
/>
```

### Layout Structure
```
1. Month Selector
2. Summary Cards (Income, Expense, Net)
3. ★ Income vs Expense Line Chart (full width)
4. ★ Budget Charts (2 columns)
   - Pie Chart (left)
   - Bar Chart (right)
5. Budget Breakdown List
6. Wallet Summary
7. Top Transactions
```

---

## 📊 Data Flow

```
transactions (from App.jsx)
    ↓
monthTransactions (filtered by selectedMonth)
    ↓
Chart Components
    ↓
Process & group data
    ↓
Recharts library
    ↓
Visual chart with interactions
```

### Example Data Processing

**Line Chart:**
```javascript
// Input: transactions
[
  { date: "2026-02-01", type: "income", amount: "Rp 500.000" },
  { date: "2026-02-01", type: "expense", amount: "Rp 200.000" },
  { date: "2026-02-02", type: "expense", amount: "Rp 150.000" }
]

// Output: chartData
[
  { date: "1", income: 500000, expense: 200000 },
  { date: "2", income: 0, expense: 150000 }
]
```

**Pie/Bar Chart:**
```javascript
// Input: budgetBreakdown
{
  "Makan": { total: 500000, limit: 1000000, percentage: 50, count: 10 },
  "Transport": { total: 300000, limit: 500000, percentage: 60, count: 5 }
}

// Output: sorted by total, mapped to chart format
[
  { name: "Makan", value: 500000, percentage: 50 },
  { name: "Transport", value: 300000, percentage: 60 }
]
```

---

## 🎯 Future Enhancements

### Planned Features:
1. **Export Chart as Image**
   - Download PNG/JPG
   - Share to WhatsApp/Email

2. **Comparison Mode**
   - Overlay 2 months on same chart
   - Show growth/decline percentage

3. **Daily Average Line**
   - Add average spending line
   - Highlight days above/below average

4. **Budget Forecast**
   - Predict when budget will run out
   - Recommend daily spending limit

5. **Animated Charts**
   - Smooth entrance animations
   - Transition on month change

6. **Custom Date Range**
   - Weekly view
   - Quarterly summary
   - Year-to-date

---

## 🐛 Troubleshooting

### Chart Not Showing
**Possible Causes:**
1. No data for selected month → Shows "Tidak ada data" message
2. Transaction date field missing → Check transaction schema
3. recharts not installed → Run `npm install recharts`

**Fix:**
```bash
npm install recharts
```

### Chart Cut Off on Mobile
**Cause:** Parent container width constraint

**Fix:**
```jsx
<ResponsiveContainer width="100%" height={300}>
```
Already implemented ✅

### Dark Mode Colors Wrong
**Check:**
- Tailwind dark: prefix
- Chart stroke colors
- Tooltip background

**Example:**
```jsx
stroke="#64748b" 
className="dark:stroke-slate-400"
```

---

## 📦 Dependencies

### recharts
```json
{
  "recharts": "^2.x.x"
}
```

**What it includes:**
- LineChart, Line
- PieChart, Pie, Cell
- BarChart, Bar
- XAxis, YAxis
- CartesianGrid
- Tooltip, Legend
- ResponsiveContainer

**Bundle Size:**
- ~50kb gzipped
- Tree-shakable (only imports used components)

---

## ✅ Summary

**3 Chart Types Added:**
1. ✅ Line Chart - Income vs Expense Trend
2. ✅ Pie Chart - Budget Distribution
3. ✅ Bar Chart - Category Comparison

**Key Features:**
- Fully responsive
- Dark mode support
- Interactive tooltips
- Automatic data processing
- Currency formatting
- Empty state handling

**Performance:**
- Memoized calculations
- Efficient re-renders
- Lightweight library

Your Report page now has beautiful, interactive charts! 📊✨
