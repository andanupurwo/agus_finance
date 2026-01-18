# 👨‍👩‍👧‍👦 Panduan Manajemen Keluarga - Agus Finance

## Gambaran Singkat

Agus Finance sekarang sudah **family-ready**! Satu keluarga = satu budget bersama. Semua anggota keluarga bisa lihat, mencatat, dan kelola pengeluaran bersama dalam satu aplikasi.

---

## 🚀 CARA SETUP KELUARGA (SUPERADMIN)

### Step 1: Login Pertama Kali
```
1. Buka https://agus-finance.web.app
2. Klik "Login dengan Google"
3. Login dengan email: andanupurwo@gmail.com
4. ✅ Sistem otomatis membuat "Keluarga Baru"
```

### Step 2: Tambah Anggota Keluarga
```
Settings (tab bawah)
  ↓
Lihat section "Tambah Anggota Keluarga"
  ↓
Masukkan email istri: ashrinurhida@gmail.com
  ↓
Pilih role: Admin (recommended untuk istri)
  ↓
Klik "Kirim Undangan"
```

### Step 3: Istri Login & Auto-Join
```
Istri membuka: https://agus-finance.web.app
  ↓
Klik "Login dengan Google"
  ↓
Login dengan: ashrinurhida@gmail.com
  ↓
✅ Otomatis join keluarga Purwo
  ↓
Istri langsung lihat semua data keluarga!
```

---

## 👥 MANAJEMEN ANGGOTA KELUARGA

### Lihat Daftar Anggota
```
Settings → Bagian "Anggota Keluarga (X)"
```

Setiap member akan menampilkan:
- ✅ Nama & Email
- ✅ Role (Superadmin, Admin, Member, Viewer)
- ✅ Tanggal bergabung
- ✅ Tombol ubah role (untuk admin)
- ✅ Tombol hapus (untuk admin)

### Ubah Role Anggota
```
Pilih member → Klik dropdown role
  ↓
Pilih: Superadmin / Admin / Member / Viewer
  ↓
Perubahan langsung berlaku!
```

### Hapus Anggota dari Keluarga
```
Pilih member → Klik tombol Trash (merah)
  ↓
Konfirmasi 2x
  ↓
✅ Member di-kick out
   (Tidak bisa akses data keluarga lagi)
```

---

## 👑 PENJELASAN ROLE & PERMISSIONS

### 👑 SUPERADMIN (Purwo)
**Apa yang bisa dilakukan:**
- ✅ Lihat SEMUA data keluarga
- ✅ Buat, edit, hapus wallet
- ✅ Buat, edit, hapus budget
- ✅ Buat, edit, hapus transaksi
- ✅ **Kelola anggota keluarga (add/remove/change role)**
- ✅ Hapus keluarga seluruhnya

**Akses:** Penuh kontrol

---

### ⚙️ ADMIN (Istri)
**Apa yang bisa dilakukan:**
- ✅ Lihat SEMUA data keluarga
- ✅ Buat wallet
- ✅ Edit wallet miliknya/keluarga
- ✅ Hapus wallet (dengan warning)
- ✅ Buat budget
- ✅ Edit budget miliknya/keluarga
- ✅ Hapus budget (dengan warning)
- ✅ Buat transaksi apapun
- ✅ Edit transaksi miliknya/keluarga
- ✅ Hapus transaksi miliknya/keluarga

**Akses:** Penuh akses data, TIDAK bisa kelola member

---

### 👤 MEMBER (Anak-anak)
**Apa yang bisa dilakukan:**
- ✅ Lihat SEMUA data keluarga
- ✅ Lihat wallet & budget milik keluarga
- ✅ Buat transaksi (catat pengeluaran)
- ✅ Edit transaksi yang MEREKA BUAT
- ✅ Hapus transaksi yang MEREKA BUAT

**Tidak bisa:**
- ❌ Hapus transaksi milik orang lain
- ❌ Edit budget
- ❌ Hapus wallet

**Akses:** Terbatas untuk input data, lihat penuh

---

### 👁️ VIEWER (Guest/Keluarga Besar)
**Apa yang bisa dilakukan:**
- ✅ Lihat SEMUA data keluarga (read-only)

**Tidak bisa:**
- ❌ Buat transaksi
- ❌ Edit apapun
- ❌ Hapus apapun

**Akses:** View only

---

## 💡 REKOMENDASI ROLE DISTRIBUTION

| Person | Role | Alasan |
|--------|------|--------|
| Purwo | Superadmin | Owner, kelola keluarga |
| Istri | Admin | Managerial, bisa kelola wallet & budget |
| Anak 1 (15th) | Member | Bisa catat pengeluaran pribadi |
| Anak 2 (12th) | Member | Bisa catat pengeluaran pribadi |
| Tante/Paman | Viewer | Lihat finansial keluarga, tidak edit |

---

## 📊 CONTOH WORKFLOW HARIAN

### Pagi (Purwo)
```
1. Login ke Agus Finance
2. Lihat summary wallet & budget
3. Buat budget baru: "Tuition"
4. Unduh laporan keuangan
```

### Siang (Istri)
```
1. Login (sudah auto-join keluarga Purwo)
2. Lihat wallet: Rp 50 juta
3. Buat transaksi: "Beli groceries Rp 500k"
4. Transfer ke wallet: Rp 2 juta
```

### Sore (Anak 1)
```
1. Login
2. Lihat budget keluarga
3. Catat pengeluaran: "Beli buku Rp 150k" → Budget "Sekolah"
4. Lihat total pengeluaran hari ini
```

### Malam (Anak 2)
```
1. Login
2. Lihat budget: Masih ada Rp 5 juta
3. Jika ada pengeluaran, catat langsung
4. Lihat progress budget keluarga
```

---

## 🔒 SECURITY

### Data Privacy
- ✅ Hanya keluarga yang bisa lihat data keluarga
- ✅ User lain TIDAK bisa lihat wallet/transaksi keluarga Anda
- ✅ Firestore rules enforce semua ini

### Account Security
- ✅ Login via Google (2FA, password auto-managed)
- ✅ Tidak perlu simpan password
- ✅ Setiap user punya UID unik

### Data Integritas
- ✅ Hanya yang punya role "superadmin" bisa hapus data
- ✅ Activity log akan show: "Siapa, Kapan, Apa"
- ✅ Member tidak bisa delete transaksi orang lain

---

## ⚠️ HAL-HAL PENTING

### ❌ Jangan Hapus Akun
- Jika hapus akun dari Superadmin, member tidak bisa akses keluarga lagi
- Sebaiknya ubah role ke "Viewer" jika tidak aktif

### ❌ Jangan Berbagi Password
- Login via Google (tidak ada password)
- Share link ini saja: https://agus-finance.web.app

### ✅ Selalu Update Status
- Superadmin perlu clear & update member list
- Jika ada member yang pindah/resign, hapus dari list

### ✅ Backup Data Regularly
- Setting → "Import Data" untuk export
- Save Excel file setiap bulan

---

## 🆘 TROUBLESHOOTING

### Q: Istri login tapi tidak ada data keluarga?
**A:** 
- Pastikan Purwo sudah undang istri (cek Settings → Family Management)
- Refresh browser (F5)
- Jika masih tidak ada, coba logout & login lagi

### Q: Tidak bisa ubah role member?
**A:**
- Hanya Superadmin & Admin yang bisa ubah role
- Jika Anda Member, minta Admin untuk ubah

### Q: Member lain delete transaksi saya?
**A:**
- Hanya bisa delete transaksi mereka sendiri (atau di-set Admin)
- Jika ada yang salah, hubungi Superadmin

### Q: Lupa password?
**A:**
- Tidak ada password! Login via Google
- Klik "Login dengan Google" → Masukkan email Google Anda

### Q: Ingin leave keluarga?
**A:**
- Hubungi Superadmin untuk remove dari family
- Atau buat family baru (jika Superadmin di keluarga lain)

---

## 📞 TIPS

1. **Set family name yang jelas**
   - Contoh: "Keluarga Purwo Hadi" bukan "Family 1"

2. **Review member list setiap bulan**
   - Siapa masih aktif?
   - Ada yang baru?

3. **Backup data setiap quarter**
   - Export ke Excel
   - Save di cloud (Google Drive, etc)

4. **Discuss budget limits dengan keluarga**
   - Sepakati bersama
   - Update di aplikasi

5. **Use activity log untuk tracking**
   - Siapa buat apa
   - Kapan transaksi dibuat

---

## 🎯 NEXT STEPS

1. **Setup sekarang:**
   - Login → Tambah istri → Done!

2. **Train anggota keluarga:**
   - Tunjukkan cara login
   - Explain roles & permissions
   - Demo buat transaksi

3. **Set budget bulanan:**
   - Home → Manage → Create Budget
   - Set limit per kategori

4. **Monitor regularly:**
   - Check weekly di Home
   - Review monthly di Activity
   - Export di Settings

---

Selamat menggunakan Agus Finance untuk keluarga Anda! 🎉

