/**
 * index.js - Agus Finance Telegram Bot (Polling Mode)
 *
 * Bot ini berjalan sebagai proses Node.js biasa di dalam Docker.
 * Menggunakan polling: bot aktif cek pesan ke Telegram setiap beberapa detik.
 * Tidak butuh URL publik, tidak butuh server cloud.
 */

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const admin = require('firebase-admin');
const { parseMessage } = require('./src/parser');
const { isAllowed } = require('./src/auth');
const { getBudgets, getWallets, findBudget, saveTransaction } = require('./src/firestore');

// --- Inisialisasi Firebase Admin SDK ---
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
});

// --- Inisialisasi Telegram Bot (polling mode) ---
const token = process.env.TELEGRAM_BOT_TOKEN;
const familyId = process.env.FAMILY_ID;
const mainWalletId = process.env.MAIN_WALLET_ID;
const mainWalletName = process.env.MAIN_WALLET_NAME;

if (!token || !familyId || !mainWalletId || !mainWalletName) {
    console.error('❌ Konfigurasi .env tidak lengkap! Cek TELEGRAM_BOT_TOKEN, FAMILY_ID, MAIN_WALLET_ID, MAIN_WALLET_NAME');
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });
console.log('🤖 Bot Telegram aktif (polling mode)...');

// --- Helper: Format nominal ke Rupiah ---
function formatRupiah(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

// --- Handler: /list ---
async function handleList(chatId) {
    const budgets = await getBudgets(familyId);
    if (budgets.length === 0) {
        return bot.sendMessage(chatId, '📋 Belum ada budget.');
    }
    const lines = budgets.map(b => `• <b>${b.name}</b>`);
    bot.sendMessage(chatId, '📋 <b>Budget yang tersedia:</b>\n' + lines.join('\n'), { parse_mode: 'HTML' });
}

// --- Handler: /help & /start ---
async function handleHelp(chatId) {
    const text = `📖 <b>Cara pakai bot ini:</b>

<b>Pengeluaran:</b>
<code>[nominal] [keterangan] - [budget]</code>

Contoh:
  <code>20.000 makan siang - makan</code>
  <code>50rb bensin - transport</code>
  <code>5000 ikan sapu-sapu - hiburan</code>

<b>Pemasukan (gaji):</b>
<code>[nominal] gaji</code>

Contoh:
  <code>5.000.000 gaji</code>

<b>Perintah lain:</b>
  /list — lihat semua budget
  /help — tampilkan panduan ini`;

    bot.sendMessage(chatId, text, { parse_mode: 'HTML' });
}

// --- Tangkap semua pesan masuk ---
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const telegramUserId = msg.from.id;
    const text = msg.text?.trim();

    if (!text) return;

    console.log(`[bot] Pesan dari user ${telegramUserId}: "${text}"`);

    // Cek whitelist
    const allowed = await isAllowed(telegramUserId);
    if (!allowed) {
        return bot.sendMessage(chatId, '🚫 Kamu tidak punya akses ke bot ini.');
    }

    // Perintah khusus
    if (text === '/list') return handleList(chatId);
    if (text === '/help' || text === '/start') return handleHelp(chatId);

    // Parse pesan transaksi
    const parsed = parseMessage(text);
    if (!parsed) {
        return bot.sendMessage(chatId,
            '❓ Format pesan tidak dikenali.\n\nKetik /help untuk panduan.'
        );
    }

    try {
        if (parsed.type === 'income') {
            // Pemasukan → simpan ke wallet utama
            await saveTransaction(familyId, {
                ...parsed,
                targetId: mainWalletId,
                targetName: mainWalletName,
                userId: String(telegramUserId),
            });

            bot.sendMessage(chatId,
                `✅ <b>Tersimpan!</b>\n\n💰 Pemasukan: <b>${formatRupiah(parsed.amount)}</b>\n📝 ${parsed.description}\n🏦 Wallet: ${mainWalletName}`,
                { parse_mode: 'HTML' }
            );

        } else {
            // Pengeluaran → cari budget yang cocok
            const budgets = await getBudgets(familyId);
            const matched = findBudget(budgets, parsed.budgetKeyword);

            if (!matched) {
                const list = budgets.map(b => `  • <code>${b.name.toLowerCase()}</code>`).join('\n');
                return bot.sendMessage(chatId,
                    `❌ Budget "<b>${parsed.budgetKeyword}</b>" tidak ditemukan.\n\nBudget yang tersedia:\n${list}\n\nCoba lagi dengan nama yang sesuai.`,
                    { parse_mode: 'HTML' }
                );
            }

            await saveTransaction(familyId, {
                ...parsed,
                targetId: matched.id,
                targetName: matched.name,
                userId: String(telegramUserId),
            });

            bot.sendMessage(chatId,
                `✅ <b>Tersimpan!</b>\n\n💸 Pengeluaran: <b>${formatRupiah(parsed.amount)}</b>\n📝 ${parsed.description}\n📂 Budget: ${matched.name}`,
                { parse_mode: 'HTML' }
            );
        }
    } catch (err) {
        console.error('[bot] Error saat simpan transaksi:', err);
        bot.sendMessage(chatId, '⚠️ Terjadi error saat menyimpan. Coba lagi.');
    }
});

// Tangkap error polling agar bot tidak crash
bot.on('polling_error', (err) => {
    console.error('[polling_error]', err.message);
});

console.log('✅ Bot siap menerima pesan!');
