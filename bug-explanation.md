# Laporan Investigasi & Perbaikan Bug: ReferenceError formatMediumShortDate

**Kode Branch:** `fix/qa-05-format-date-error`  
**Repository:** `multimediamia-fe`  
**Tanggal:** 26 Oktober 2026  

---

## 1. Deskripsi Bug (Bug Overview)

Saat pengguna (khususnya dengan peran **Juri**) membuka detail karya di rute `/juri/manage-submission/[submissionId]`, aplikasi web mengalami crash total pada client-side Next.js App Router dengan pesan error di konsol browser:

```text
error-73e42cee166068d7.js:1 Unhandled client error in App Router: ReferenceError: formatMediumShortDate is not defined
    at A (page-4d9aa9fbde40a1b1.js:1:13110)
    at l9 (4bd1b696-100b9d70ed4e49c1.js:1:51130)
    at o_ (4bd1b696-100b9d70ed4e49c1.js:1:70990)
    ...
```

Error serupa juga mengintai pada tabel pendaftar admin (`/admin/pendaftar`) dan tabel redeem reward (`/admin/manage-redeem`).

---

## 2. Akar Masalah (Root Cause Analysis)

Setelah dilakukan pelacakan kode, ditemukan tiga akar permasalahan:

1. **Fungsi `formatMediumShortDate` Belum Di-import:**
   Pada file `src/app/juri/manage-submission/[submissionId]/page.jsx` dan `src/app/admin/pendaftar/pendaftar-table-config.jsx`, helper `formatMediumShortDate` dipanggil saat me-render tanggal, tetapi lupa di-import dari `@/lib/utils`.
2. **Typo Nama Properti (`created_at_at`):**
   Terdapat kesalahan ketik penamaan field objek `created_at_at` alih-alih `created_at` pada:
   - `src/app/juri/manage-submission/[submissionId]/page.jsx` (baris 334)
   - `src/app/admin/pendaftar/pendaftar-table-config.jsx` (baris 43)
   - `src/app/admin/manage-redeem/reddem-table-config.jsx` (baris 85)
3. **Variabel Fallback Tidak Terdefinisi pada `utils.js`:**
   Pada fungsi `formatMediumShortDate(date)` di `src/lib/utils.js`, blok `catch` mengembalikan `dateString` padahal nama parameternya adalah `date`. Hal ini berisiko memicu `ReferenceError: dateString is not defined` jika parsing tanggal gagal.

---

## 3. Langkah-Langkah Perbaikan (Steps Taken to Fix)

### Langkah 1: Memperbaiki Halaman Detail Submission Juri
**File:** `src/app/juri/manage-submission/[submissionId]/page.jsx`
- Menambahkan import:
  ```javascript
  import { formatMediumShortDate } from "@/lib/utils";
  ```
- Mengoreksi penulisan `submission.created_at_at` menjadi `submission.created_at`.

### Langkah 2: Memperbaiki Tabel Admin Pendaftar
**File:** `src/app/admin/pendaftar/pendaftar-table-config.jsx`
- Menambahkan import:
  ```javascript
  import { formatMediumShortDate } from "@/lib/utils";
  ```
- Mengoreksi penulisan `row.original.created_at_at` menjadi `row.original.created_at`.

### Langkah 3: Memperbaiki Tabel Admin Redeem
**File:** `src/app/admin/manage-redeem/reddem-table-config.jsx`
- Mengoreksi penulisan `row.original.created_at_at` menjadi `row.original.created_at`.

### Langkah 4: Mengamankan Fallback di `utils.js`
**File:** `src/lib/utils.js`
- Mengubah blok catch dari `return dateString;` menjadi `return String(date);` agar tidak menyebabkan ReferenceError.

---

## 4. Daftar File yang Diubah

| No | File Path | Jenis Perubahan |
|---|---|---|
| 1 | `src/app/juri/manage-submission/[submissionId]/page.jsx` | Import helper + perbaikan typo `created_at_at` |
| 2 | `src/app/admin/pendaftar/pendaftar-table-config.jsx` | Import helper + perbaikan typo `created_at_at` |
| 3 | `src/app/admin/manage-redeem/reddem-table-config.jsx` | Perbaikan typo `created_at_at` |
| 4 | `src/lib/utils.js` | Koreksi fallback identifier pada exception catch |

---

## 5. Hasil Verifikasi & Pengujian

1. **Linting Check (`npm run lint`):**
   - Menghasilkan `0 warning` dan `0 error`.
2. **Pengujian Halaman Juri:**
   - Membuka halaman `/juri/manage-submission/[submissionId]` berhasil me-render seluruh konten karya, alur aplikasi, thumbnail, dan link eksternal dengan format tanggal yang valid (`id-ID`) tanpa crash.
3. **Pengujian Tabel Admin:**
   - Halaman pendaftar dan redeem berhasil menampilkan tanggal pendaftaran dengan benar.
