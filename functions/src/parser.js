/**
 * parser.js
 * Mengubah teks pesan Telegram menjadi data transaksi.
 *
 * Format yang didukung:
 *   [nominal] [deskripsi] - [budget]   → pengeluaran
 *   [nominal] gaji [deskripsi?]         → pemasukan
 *
 * Contoh:
 *   "20.000 makan - makan"              → expense 20000, desc "makan", budget "makan"
 *   "1.000 parkir warung - makan"       → expense 1000, desc "parkir warung", budget "makan"
 *   "5000 ikan sapu-sapu - hiburan"     → expense 5000, desc "ikan sapu-sapu", budget "hiburan"
 *   "80000 pisang-makan"                → expense 80000, desc "pisang", budget "makan"
 *   "5.000.000 gaji"                    → income 5000000
 */

/**
 * Mengubah string angka ke integer.
 * Mendukung: "20.000", "20000", "20rb", "20k"
 */
function parseAmount(raw) {
  let str = raw.trim().toLowerCase();

  // Tangani suffix rb / k
  const rbMatch = str.match(/^([\d.,]+)\s*(rb|k)$/);
  if (rbMatch) {
    const base = parseFloat(rbMatch[1].replace(/\./g, '').replace(',', '.'));
    return Math.round(base * 1000);
  }

  // Hapus titik sebagai pemisah ribuan, ganti koma dengan titik desimal
  str = str.replace(/\./g, '').replace(',', '.');
  const num = parseFloat(str);
  return isNaN(num) ? null : Math.round(num);
}

/**
 * Mem-parse pesan teks menjadi objek transaksi.
 * @param {string} text - Teks pesan dari Telegram
 * @returns {{ type, amount, description, budgetKeyword } | null}
 */
function parseMessage(text) {
  if (!text || typeof text !== 'string') return null;

  const trimmed = text.trim();

  // --- Cek apakah pemasukan (mengandung kata "gaji") ---
  // Contoh: "5.000.000 gaji" atau "gaji 3000000"
  const incomePattern = /^(?:([\d.,]+(?:\s*(?:rb|k))?)\s+)?gaji(?:\s+(.+))?$/i;
  const incomeMatch = trimmed.match(incomePattern);
  if (incomeMatch) {
    // Coba ambil nominal dari depan, atau dari belakang jika "gaji 3000000"
    let amount = null;
    let description = 'Gaji';

    if (incomeMatch[1]) {
      // Format: "5.000.000 gaji"
      amount = parseAmount(incomeMatch[1]);
    } else if (incomeMatch[2]) {
      // Format: "gaji 3000000"
      const parts = incomeMatch[2].trim().split(/\s+/);
      amount = parseAmount(parts[0]);
      if (amount && parts.length > 1) {
        description = 'Gaji ' + parts.slice(1).join(' ');
      }
    }

    if (!amount) return null;
    return { type: 'income', amount, description, budgetKeyword: null };
  }

  // --- Pengeluaran: ambil angka pertama sebagai nominal ---
  // Pattern: [angka] [teks] - [budget]
  // Tanda - paling TERAKHIR adalah pemisah budget
  const expensePattern = /^([\d.,]+(?:\s*(?:rb|k))?)\s+(.+)$/i;
  const expenseMatch = trimmed.match(expensePattern);
  if (!expenseMatch) return null;

  const amount = parseAmount(expenseMatch[1]);
  if (!amount) return null;

  const rest = expenseMatch[2].trim();

  // Cari posisi tanda "-" paling terakhir sebagai pemisah budget
  const lastDashIdx = rest.lastIndexOf('-');
  if (lastDashIdx === -1) {
    // Tidak ada "-" → tidak ada budget → kembalikan null (format tidak lengkap)
    return null;
  }

  const description = rest.slice(0, lastDashIdx).trim();
  const budgetKeyword = rest.slice(lastDashIdx + 1).trim().toLowerCase();

  if (!description || !budgetKeyword) return null;

  return { type: 'expense', amount, description, budgetKeyword };
}

module.exports = { parseMessage, parseAmount };
