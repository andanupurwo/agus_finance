import { addDoc, collection, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { formatRupiah, parseRupiah } from '../utils/formatter';

export const useDeveloperMode = (showToast, showConfirm) => {
  const loadDummyData = async (setLoading) => {
    const confirmed = await showConfirm?.("Load dummy data untuk testing? Ini akan menambahkan data contoh.");
    if (!confirmed) return;
    setLoading(true);
    try {
      const batch = writeBatch(db);
      
      // WALLETS - 3 types
      const wallet1Ref = doc(collection(db, "wallets"));
      batch.set(wallet1Ref, {
        name: "Tabungan Utama",
        description: "Muamalat, Seabank",
        amount: formatRupiah(8500000),
        type: "Rekening",
        color: "from-blue-800 to-blue-900 border-blue-700",
        createdAt: Date.now() - 10000
      });
      
      const wallet2Ref = doc(collection(db, "wallets"));
      batch.set(wallet2Ref, {
        name: "Dompet Cash",
        description: "Uang tunai",
        amount: formatRupiah(750000),
        type: "Cash",
        color: "from-emerald-800 to-emerald-900 border-emerald-700",
        createdAt: Date.now() - 9000
      });

      const wallet3Ref = doc(collection(db, "wallets"));
      batch.set(wallet3Ref, {
        name: "Emas Digital",
        description: "Pegadaian",
        amount: formatRupiah(5000000),
        type: "Investasi",
        color: "from-yellow-700 to-yellow-900 border-yellow-700",
        createdAt: Date.now() - 8000
      });

      // BUDGETS - show all traffic light colors
      // Green: < 50% terpakai (sisa banyak)
      const budget1Ref = doc(collection(db, "budgets"));
      batch.set(budget1Ref, {
        name: "Makan",
        description: "Masak, Gofood, Galon",
        amount: formatRupiah(1200000),  // Sisa 1.2jt dari 2jt = terpakai 800K (40%) = GREEN
        limit: formatRupiah(2000000),
        color: "bg-red-900 text-red-200 border border-red-800",
        bar: "bg-red-500",
        createdAt: Date.now() - 7000
      });

      // Yellow: 50-79% terpakai (perlu perhatian)
      const budget2Ref = doc(collection(db, "budgets"));
      batch.set(budget2Ref, {
        name: "Transportasi",
        description: "Bensin, Gocar",
        amount: formatRupiah(350000),  // Sisa 350K dari 1jt = terpakai 650K (65%) = YELLOW
        limit: formatRupiah(1000000),
        color: "bg-blue-900 text-blue-200 border border-blue-800",
        bar: "bg-blue-500",
        createdAt: Date.now() - 6000
      });

      // Red: >= 80% terpakai (KRITIS!)
      const budget3Ref = doc(collection(db, "budgets"));
      batch.set(budget3Ref, {
        name: "Rumah Tangga",
        description: "Listrik, Internet, Air",
        amount: formatRupiah(200000),  // Sisa 200K dari 1.5jt = terpakai 1.3jt (87%) = RED
        limit: formatRupiah(1500000),
        color: "bg-orange-900 text-orange-200 border border-orange-800",
        bar: "bg-orange-500",
        createdAt: Date.now() - 5000
      });

      const budget4Ref = doc(collection(db, "budgets"));
      batch.set(budget4Ref, {
        name: "Anak",
        description: "Popok, Susu, Obat",
        amount: formatRupiah(450000),  // Sisa 450K dari 1jt = terpakai 550K (55%) = YELLOW
        limit: formatRupiah(1000000),
        color: "bg-pink-900 text-pink-200 border border-pink-800",
        bar: "bg-pink-500",
        createdAt: Date.now() - 4000
      });

      // TRANSACTIONS with date field
      const today = new Date();
      const thisMonth = today.toISOString().split('T')[0];
      
      const trans1Ref = doc(collection(db, "transactions"));
      batch.set(trans1Ref, {
        title: "Gaji Bulanan",
        amount: formatRupiah(10000000),
        type: "income",
        user: "Suami",
        time: "08:00",
        date: thisMonth,
        target: "Tabungan Utama",
        createdAt: Date.now() - 3000
      });

      const trans2Ref = doc(collection(db, "transactions"));
      batch.set(trans2Ref, {
        title: "Alokasi Dana Makan",
        amount: formatRupiah(2000000),
        type: "transfer",
        user: "Suami",
        time: "08:15",
        date: thisMonth,
        target: "Tabungan Utama -> Makan",
        createdAt: Date.now() - 2800
      });

      const trans3Ref = doc(collection(db, "transactions"));
      batch.set(trans3Ref, {
        title: "Belanja Supermarket",
        amount: formatRupiah(1200000),
        type: "expense",
        user: "Istri",
        time: "10:30",
        date: thisMonth,
        target: "Makan",
        createdAt: Date.now() - 2600
      });

      const trans4Ref = doc(collection(db, "transactions"));
      batch.set(trans4Ref, {
        title: "Isi Bensin Pertalite",
        amount: formatRupiah(350000),
        type: "expense",
        user: "Suami",
        time: "14:20",
        date: thisMonth,
        target: "Transportasi",
        createdAt: Date.now() - 2400
      });

      const trans5Ref = doc(collection(db, "transactions"));
      batch.set(trans5Ref, {
        title: "Bayar Listrik PLN",
        amount: formatRupiah(800000),
        type: "expense",
        user: "Istri",
        time: "16:45",
        date: thisMonth,
        target: "Rumah Tangga",
        createdAt: Date.now() - 2200
      });

      const trans6Ref = doc(collection(db, "transactions"));
      batch.set(trans6Ref, {
        title: "Bayar IndiHome",
        amount: formatRupiah(500000),
        type: "expense",
        user: "Suami",
        time: "09:00",
        date: thisMonth,
        target: "Rumah Tangga",
        createdAt: Date.now() - 2000
      });

      const trans7Ref = doc(collection(db, "transactions"));
      batch.set(trans7Ref, {
        title: "Jajan Kopi",
        amount: formatRupiah(85000),
        type: "expense",
        user: "Suami",
        time: "15:30",
        date: thisMonth,
        target: "Makan",
        createdAt: Date.now() - 1800
      });

      const trans8Ref = doc(collection(db, "transactions"));
      batch.set(trans8Ref, {
        title: "Gocar ke Kantor",
        amount: formatRupiah(150000),
        type: "expense",
        user: "Istri",
        time: "07:15",
        date: thisMonth,
        target: "Transportasi",
        createdAt: Date.now() - 1600
      });

      const trans9Ref = doc(collection(db, "transactions"));
      batch.set(trans9Ref, {
        title: "Beli Popok Bayi",
        amount: formatRupiah(350000),
        type: "expense",
        user: "Istri",
        time: "11:00",
        date: thisMonth,
        target: "Anak",
        createdAt: Date.now() - 1400
      });

      const trans10Ref = doc(collection(db, "transactions"));
      batch.set(trans10Ref, {
        title: "Susu Formula",
        amount: formatRupiah(200000),
        type: "expense",
        user: "Istri",
        time: "13:20",
        date: thisMonth,
        target: "Anak",
        createdAt: Date.now() - 1200
      });

      await batch.commit();
      showToast?.("✅ Dummy data berhasil ditambahkan!", "success");
    } catch (e) { 
      showToast?.("Error: " + e.message, "error");
    }
    setLoading(false);
  }

  const loadDefaultCategories = async (setLoading) => {
    const confirmed = await showConfirm?.("Load kategori default untuk Wallet dan Budget?");
    if(!confirmed) return;
    setLoading(true);
    try {
      const batch = writeBatch(db);
      
      const defaultWallets = [
        { name: "Tabungan", description: "Cash, Muamalat, Seabank", color: "from-blue-800 to-blue-900 border-blue-700" },
        { name: "Emas", description: "Fisik, Pegadaian Digital", color: "from-yellow-700 to-yellow-900 border-yellow-700" },
        { name: "Saham", description: "Bibit, Stockbit", color: "from-emerald-800 to-emerald-900 border-emerald-700" }
      ];

      defaultWallets.forEach((w, idx) => {
        const ref = doc(collection(db, "wallets"));
        batch.set(ref, {
          ...w,
          amount: "0",
          type: "Rekening",
          createdAt: Date.now() + idx
        });
      });

      const defaultBudgets = [
        { name: "Makan", description: "Masak, Gofood, Galon, Jajan", limit: "0", color: "bg-red-900 text-red-200 border border-red-800", bar: "bg-red-500" },
        { name: "Rumah Tangga", description: "Vitamin, Sewa Rumah, Internet, Listrik, Lampu, Kebersihan", limit: "0", color: "bg-orange-900 text-orange-200 border border-orange-800", bar: "bg-orange-500" },
        { name: "Anak", description: "Baju, Popok, Skincare, Dokter", limit: "0", color: "bg-pink-900 text-pink-200 border border-pink-800", bar: "bg-pink-500" },
        { name: "Transportasi", description: "Bensin, Gocar, Service", limit: "0", color: "bg-blue-900 text-blue-200 border border-blue-800", bar: "bg-blue-500" },
        { name: "Lain-lain", description: "Nyumbang, Sedekan Ortu, Infaq", limit: "0", color: "bg-purple-900 text-purple-200 border border-purple-800", bar: "bg-purple-500" }
      ];

      defaultBudgets.forEach((b, idx) => {
        const ref = doc(collection(db, "budgets"));
        batch.set(ref, {
          ...b,
          amount: "0",
          limit: "0",
          createdAt: Date.now() + idx + 100
        });
      });

      await batch.commit();
      showToast?.("✅ Kategori default berhasil ditambahkan!", "success");
    } catch (e) { 
      showToast?.("Error: " + e.message, "error");
    }
    setLoading(false);
  }

  const resetFactory = async (wallets, budgets, transactions, setLoading) => {
    const confirmed1 = await showConfirm?.("⚠️ RESET PABRIK: Semua data akan dihapus permanen! Lanjutkan?");
    if(!confirmed1) return;
    const confirmed2 = await showConfirm?.("Yakin? Ini tidak bisa dibatalkan!");
    if(!confirmed2) return;
    
    setLoading(true);
    try {
      const batch = writeBatch(db);
      
      wallets.forEach(w => {
        batch.delete(doc(db, "wallets", w.id));
      });
      
      budgets.forEach(b => {
        batch.delete(doc(db, "budgets", b.id));
      });
      
      transactions.forEach(t => {
        batch.delete(doc(db, "transactions", t.id));
      });
      
      await batch.commit();
      showToast?.("✅ Reset pabrik berhasil! Semua data telah dihapus.", "success");
    } catch (e) { 
      showToast?.("Error: " + e.message, "error");
    }
    setLoading(false);
  }

  const clearTransactions = async (transactions, setLoading) => {
    const confirmed = await showConfirm?.("⚠️ Hapus semua transaksi? Wallet dan Budget tetap ada.");
    if(!confirmed) return;
    
    setLoading(true);
    try {
      const batch = writeBatch(db);
      
      transactions.forEach(t => {
        batch.delete(doc(db, "transactions", t.id));
      });
      
      await batch.commit();
      showToast?.("✅ Semua transaksi berhasil dihapus!", "success");
    } catch (e) { 
      showToast?.("Error: " + e.message, "error");
    }
    setLoading(false);
  }

  const monthlyRollover = async (wallets, budgets, transactions, user, setLoading, skipConfirm = false) => {
    if (!skipConfirm) {
      const confirmed = await showConfirm?.("🔄 Monthly Rollover: Reset semua budget ke 0 dan kembalikan sisa ke Wallet Utama?");
      if(!confirmed) return;
    }
    
    setLoading(true);
    try {
      const batch = writeBatch(db);
      let totalSisa = 0;
      
      // Hitung total sisa dari semua budgets
      budgets.forEach(b => {
        totalSisa += parseRupiah(b.amount);
      });
      
      // Reset semua budgets ke 0
      budgets.forEach(b => {
        batch.update(doc(db, "budgets", b.id), { 
          amount: "0",
          limit: "0"
        });
      });
      
      // Cari Wallet Utama (wallet pertama atau yang paling besar saldonya)
      const mainWallet = wallets.length > 0 ? 
        wallets.reduce((prev, current) => 
          parseRupiah(current.amount) > parseRupiah(prev.amount) ? current : prev
        ) : null;
      
      if (mainWallet && totalSisa > 0) {
        const newWalletBalance = parseRupiah(mainWallet.amount) + totalSisa;
        batch.update(doc(db, "wallets", mainWallet.id), { 
          amount: formatRupiah(newWalletBalance)
        });
        
        // Catat transaksi rollover
        const transRef = doc(collection(db, "transactions"));
        batch.set(transRef, {
          title: "Monthly Rollover - Sisa Budget Bulan Lalu",
          amount: formatRupiah(totalSisa),
          type: "income",
          user: "System",
          time: new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}),
          target: mainWallet.name,
          createdAt: Date.now()
        });
      }
      
      await batch.commit();
      showToast?.(`✅ Rollover berhasil! Rp ${formatRupiah(totalSisa)} dikembalikan ke ${mainWallet?.name || 'Wallet'}`, "success");
    } catch (e) { 
      showToast?.("Error: " + e.message, "error");
    }
    setLoading(false);
  }

  return {
    loadDummyData,
    loadDefaultCategories,
    resetFactory,
    clearTransactions,
    monthlyRollover
  };
};
