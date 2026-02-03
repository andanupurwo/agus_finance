import * as XLSX from 'xlsx';

const now = new Date();
const Y = now.getFullYear();
const M = String(now.getMonth() + 1).padStart(2, '0');
const prevDate = new Date(Y, now.getMonth(), 0);
const pY = prevDate.getFullYear();
const pM = String(prevDate.getMonth() + 1).padStart(2, '0');
const pD = String(prevDate.getDate()).padStart(2, '0');

// Helper to format date: YYYY-MM-DD
const d = (day) => `${Y}-${M}-${String(day).padStart(2, '0')}`;
const prevStr = `${pY}-${pM}-${pD}`;

const data = [
  ["Tanggal", "Waktu", "Tipe", "Keterangan", "Target", "Nominal", "User"],
  [d(1), "00:10", "Pengeluaran", `${prevStr} Buah, Enoki`, "Konsumsi", 125000, "Purwo"],
  [d(1), "00:10", "Pengeluaran", `${prevStr} Daging`, "Konsumsi", 280000, "Purwo"],
  [d(1), "00:10", "Pengeluaran", `${prevStr} Coklat panas`, "Konsumsi", 24000, "Purwo"],
  [d(1), "00:10", "Pengeluaran", `${prevStr} Bakpia mochi`, "Konsumsi", 90000, "Purwo"],
  [d(1), "15:46", "Pengeluaran", "Gocar rumah - stasiun tugu", "Dana Kaget", 53500, "Ashri"],
  [d(1), "15:46", "Pengeluaran", "Bakpia", "Konsumsi", 65000, "Ashri"],
  [d(1), "15:46", "Pengeluaran", "Sayur", "Konsumsi", 10000, "Ashri"],
  [d(1), "15:46", "Pengeluaran", "Alfamart", "Konsumsi", 55800, "Ashri"],
  [d(3), "6:54", "Pengeluaran", "Oleholeh 1", "Dana Kaget", 190000, "Ashri"],
  [d(3), "6:55", "Pengeluaran", "Oleholeh 2", "Dana Kaget", 154000, "Ashri"],
  [d(3), "6:55", "Pengeluaran", "Tempe", "Konsumsi", 32000, "Ashri"],
  [d(3), "6:56", "Pengeluaran", "Siput", "Konsumsi", 693000, "Ashri"],
  [d(4), "19:33", "Pengeluaran", "Pijit arka", "Keperluan Anak", 75000, "Ashri"],
  [d(4), "19:32", "Pengeluaran", "Tiket sempor", "Dana Kaget", 63000, "Ashri"],
  [d(4), "19:33", "Pengeluaran", "Cuan uti", "Dana Kaget", 300000, "Ashri"],
  [d(4), "19:33", "Pengeluaran", "Nenek tp boong", "Dana Kaget", 300000, "Ashri"],
  [d(4), "19:33", "Pengeluaran", "Listrik", "Konsumsi", 203000, "Ashri"],
  [d(4), "19:33", "Pengeluaran", "Alfamart", "Konsumsi", 38000, "Ashri"],
  [d(4), "19:34", "Pengeluaran", "Pecel", "Konsumsi", 23000, "Ashri"],
  [d(4), "19:34", "Pengeluaran", "Bakso bakar", "Konsumsi", 10000, "Ashri"],
  [d(4), "19:34", "Pengeluaran", "Sambal jos", "Konsumsi", 29000, "Ashri"],
  [d(4), "19:34", "Pengeluaran", "Semuda", "Konsumsi", 29000, "Ashri"],
  [d(4), "19:34", "Pengeluaran", "Galon", "Konsumsi", 42000, "Ashri"],
  [d(5), "17:00", "Pengeluaran", "Bakso mie", "Konsumsi", 35000, "Purwo"],
  [d(6), "17:35", "Pengeluaran", "Bu tatik", "Konsumsi", 21000, "Ashri"],
  [d(6), "17:36", "Pengeluaran", "Maksi asrek", "Konsumsi", 19000, "Ashri"],
  [d(6), "17:36", "Pengeluaran", "Ketoprak purwo", "Konsumsi", 15000, "Ashri"],
  [d(7), "8:00", "Pengeluaran", "srapan", "Konsumsi", 10000, "Ashri"]
];

const ws = XLSX.utils.aoa_to_sheet(data);
ws['!cols'] = [
  { wch: 12 },
  { wch: 8 },
  { wch: 12 },
  { wch: 30 },
  { wch: 18 },
  { wch: 12 },
  { wch: 10 }
];

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Data');
XLSX.writeFile(wb, 'public/test-import.xlsx');
console.log('✓ File created: public/test-import.xlsx');
