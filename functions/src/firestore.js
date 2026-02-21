/**
 * firestore.js
 * Helper untuk membaca dan menulis data ke Firebase Firestore.
 *
 * Struktur Firestore app ini:
 *   /wallets/{id}       → field familyId untuk filter
 *   /budgets/{id}       → field familyId untuk filter
 *   /transactions/{id}  → field familyId untuk filter
 */

const { getFirestore } = require('firebase-admin/firestore');

/**
 * Ambil semua budget dari Firestore untuk familyId tertentu.
 * @param {string} familyId
 * @returns {Promise<Array>}
 */
async function getBudgets(familyId) {
    const db = getFirestore();
    const snapshot = await db
        .collection('budgets')
        .where('familyId', '==', familyId)
        .get();

    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Ambil semua wallet dari Firestore untuk familyId tertentu.
 * @param {string} familyId
 * @returns {Promise<Array>}
 */
async function getWallets(familyId) {
    const db = getFirestore();
    const snapshot = await db
        .collection('wallets')
        .where('familyId', '==', familyId)
        .get();

    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Cari budget yang namanya paling mirip dengan keyword.
 * Menggunakan logika: nama budget mengandung keyword, atau keyword mengandung nama budget.
 * @param {Array} budgets
 * @param {string} keyword
 * @returns {Object|null}
 */
function findBudget(budgets, keyword) {
    if (!keyword) return null;
    const kw = keyword.toLowerCase().trim();

    return budgets.find(b => {
        const name = b.name.toLowerCase();
        return name.includes(kw) || kw.includes(name);
    }) || null;
}

/**
 * Simpan transaksi baru ke Firestore (root collection 'transactions').
 * @param {string} familyId
 * @param {Object} txData
 */
async function saveTransaction(familyId, txData) {
    const db = getFirestore();
    const now = Date.now();

    // Format tanggal hari ini: YYYY-MM-DD
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    // Format jam WIB: HH:MM
    const timeStr = today.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta'
    });

    // Format nominal ke string ribuan (sesuai format app, contoh: "20.000")
    const amountStr = txData.amount.toLocaleString('id-ID');

    const doc = {
        familyId,                              // wajib untuk filter
        title: txData.description,
        amount: amountStr,
        type: txData.type,                     // 'income' atau 'expense'
        targetId: txData.targetId || null,     // ID budget atau wallet
        target: txData.targetName || '',       // nama budget atau wallet
        date: dateStr,
        time: timeStr,
        createdAt: now,
        source: 'telegram',                    // penanda dari mana transaksi dibuat
        user: txData.userId || null,
    };

    await db.collection('transactions').add(doc);
    return doc;
}

module.exports = { getBudgets, getWallets, findBudget, saveTransaction };
