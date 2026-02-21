/**
 * auth.js
 * Memvalidasi apakah Telegram user ID ada di whitelist.
 *
 * Whitelist disimpan di Firestore:
 *   Collection: bot_config
 *   Document:   whitelist
 *   Field:      allowed_ids (array of numbers)
 *
 * Contoh struktur Firestore:
 *   bot_config/whitelist → { allowed_ids: [123456789, 987654321] }
 */

const { getFirestore } = require('firebase-admin/firestore');

/**
 * Cek apakah telegram user ID diizinkan memakai bot.
 * @param {number} telegramUserId
 * @returns {Promise<boolean>}
 */
async function isAllowed(telegramUserId) {
    try {
        const db = getFirestore();
        const doc = await db.collection('bot_config').doc('whitelist').get();

        if (!doc.exists) {
            console.warn('[auth] Dokumen whitelist tidak ditemukan di Firestore');
            return false;
        }

        const data = doc.data();
        const allowedIds = data.allowed_ids || [];

        // Bandingkan sebagai string agar aman dari masalah tipe data
        return allowedIds.map(String).includes(String(telegramUserId));
    } catch (err) {
        console.error('[auth] Error saat cek whitelist:', err);
        return false;
    }
}

module.exports = { isAllowed };
