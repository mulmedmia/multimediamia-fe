# Multimedia In Action (MIA) Frontend

Ini adalah proyek [Next.js](https://nextjs.org) untuk aplikasi kompetisi "Multimedia In Action". Proyek ini menggunakan [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) dan React, dengan integrasi berbagai fitur seperti pendaftaran, pengumpulan karya, gamifikasi, dan dashboard admin.

## Fitur Utama

- **Pendaftaran Peserta**: Form registrasi dengan validasi, OTP email, dan kategori lomba.
- **Pengumpulan Karya**: Upload karya, deskripsi, dan link (GitHub, YouTube, demo).
- **Dashboard Peserta**: Melihat status verifikasi, progress, dan bantuan.
- **Gamifikasi**: Sistem poin, leaderboard, dan penukaran hadiah.
- **Admin Panel**: Kelola peserta, submission, juri, produk, dan gamifikasi.
- **Juri Panel**: Review submission, beri skor dan feedback.
- **Responsif**: Tampilan mobile, tablet, dan desktop.
- **Integrasi API**: Menggunakan React Query untuk data fetching dan mutation.

## Struktur Folder

- `src/app/` - Halaman utama (Next.js App Router)
- `src/components/` - Komponen UI dan form
- `src/hooks/` - Custom hooks untuk data dan logika
- `src/services/` - Service API untuk komunikasi backend
- `src/providers/` - Context provider (auth, theme, dll)
- `public/` - Asset statis (logo, gambar, dll)

## Instalasi & Pengembangan

1. **Clone repo:**
   ```bash
   git clone https://github.com/mulmedmia/multimediamia-fe.git
   cd multimediamia-fe
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Konfigurasi Lingkungan:**
   Salin `.env.example` ke `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Isi `NEXT_PUBLIC_API_URL` mengarah ke URL backend Anda (default lokal: `http://localhost:5000/api/v1`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   ```

4. **Jalankan server development:**
   ```bash
   npm run dev
   ```

5. **Buka di browser:**
   [http://localhost:3000](http://localhost:3000)

## Skrip Penting

- `dev` - Jalankan server development
- `build` - Build aplikasi untuk produksi
- `start` - Jalankan server produksi
- `lint` - Cek kode dengan ESLint

## Teknologi yang Digunakan

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [React Query](https://tanstack.com/query/latest)
- [Zod](https://zod.dev/) (validasi form)
- [Tailwind CSS](https://tailwindcss.com/)
- [Sonner](https://sonner.emilkowal.com/) (toast notification)
- [Lucide Icons](https://lucide.dev/)
- [Radix UI](https://www.radix-ui.com/)

## Panduan Pengembangan

- Edit halaman utama di `src/app/page.jsx`.
- Komponen dapat ditemukan di `src/components/`.
- Untuk menambah API endpoint, edit file di `src/services/`.
- Gunakan React Query untuk data fetching dan mutation.

## Deployment

Deploy mudah di [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Lihat [dokumentasi Next.js deployment](https://nextjs.org/docs/app/building-your-application/deploying) untuk detail.

## 🌿 Git & GitHub Workflow

1. **Branch Strategy**: Gunakan branch `dev` untuk pengujian dan branch `feature/nama-fitur` untuk pengerjaan fitur baru.
2. **Commit Standard**: Gunakan prefix `feat:`, `fix:`, `docs:`, `style:`.
3. **Pull Request**: Buat PR dari `feature/nama-fitur` ke `dev` atau `main` dan minta code review dari anggota tim sebelum merge.

---

## Kontribusi

Pull request dan issue sangat diterima! Silakan fork repo ini dan ajukan PR untuk perbaikan atau fitur baru.

## Kontributor
    1. Muhammad Dihya Al Qalby
    2. Muhammad Haikal Bintang
    3. Rafly Aziz Abdillah
    4. Ahmad Santoso
