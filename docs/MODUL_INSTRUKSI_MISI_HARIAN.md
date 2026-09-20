# 📜 MODUL INSTRUKSI & BLUEPRINT TEKNIS: FITUR MISI HARIAN (DAILY MISSIONS)

Dokumen ini berisi spesifikasi kebutuhan sistem, arsitektur database, API Contract, alur UI/UX, serta rincian **Tiket Linear (Linear Board)** untuk implementasi **Fitur Misi Harian (Daily Missions)** pada aplikasi Multimedia in Action (MIA 2025).

---

## 🎯 1. RINGKASAN FITUR (FEATURE OVERVIEW)

Fitur **Misi Harian** bertujuan untuk meningkatkan keterlibatan peserta melalui *gamifikasi*. Peserta dapat menyelesaikan berbagai tugas harian yang ditentukan oleh Admin untuk mendapatkan **XP** (Leveling) dan **Diamonds** (Mata uang penukaran produk/hadiah).

### 👥 Peran Pengguna (User Roles) & Capability Matrix:
| Fitur / Kemampuan | Peserta (User) | Admin |
| :--- | :---: | :---: |
| Akses Menu "Misi Harian" dari Navbar Utama | ✅ | ✅ |
| Melihat Daftar & Detail Misi Harian | ✅ | ✅ |
| Mengakses Link Instruksi Google Docs | ✅ | ✅ |
| Mengunggah Link Pengumpulan Tugas/Misi | ✅ | ❌ |
| Melihat Status & Perolehan XP/Diamond Pengumpulan | ✅ | ❌ |
| Membuat (Create), Mengedit (Update), & Menghapus (Delete) Misi | ❌ | ✅ |
| Memeriksa (Review), ACC / Reject Pengumpulan Peserta | ❌ | ✅ |
| Menginputkan Jumlah Reward XP & Diamond saat ACC | ❌ | ✅ |

---

## 🗄️ 2. SKEMA DATABASE & MODEL (BACKEND DRIZZLE ORM)

### A. Enum Baru (`pgEnum`)
1. **`missionStatusEnum`**: `["ACTIVE", "EXPIRED", "DRAFT"]`
2. **`missionSubmissionStatusEnum`**: `["PENDING", "APPROVED", "REJECTED"]`

### B. Tabel Baru: `Mission`
```typescript
export const Mission = pgTable("Mission", {
  mission_id: text("mission_id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  deadline: timestamp("deadline").notNull(),
  min_xp: integer("min_xp").notNull(),
  max_xp: integer("max_xp").notNull(),
  min_diamond: integer("min_diamond").notNull(),
  max_diamond: integer("max_diamond").notNull(),
  google_docs_url: text("google_docs_url").notNull(),
  status: missionStatusEnum("status").default("ACTIVE").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
```

### C. Tabel Baru: `MissionSubmission`
```typescript
export const MissionSubmission = pgTable("MissionSubmission", {
  submission_id: text("submission_id").primaryKey(),
  mission_id: text("mission_id").notNull().references(() => Mission.mission_id, { onDelete: "cascade" }),
  user_id: text("user_id").notNull().references(() => User.users_id, { onDelete: "cascade" }),
  submission_url: text("submission_url").notNull(),
  notes: text("notes"),
  status: missionSubmissionStatusEnum("status").default("PENDING").notNull(),
  awarded_xp: integer("awarded_xp"),
  awarded_diamond: integer("awarded_diamond"),
  admin_feedback: text("admin_feedback"),
  reviewed_at: timestamp("reviewed_at"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
```

### D. Update Tabel `User`
```typescript
// Penambahan kolom XP (jika belum ada) dan penguatan poin/diamond
export const User = pgTable("User", {
  // ... existing fields ...
  xp: integer("xp").default(0).notNull(),
  points: integer("points").default(0).notNull(), // Poin / Diamonds untuk redeem
});
```

---

## 🌐 3. SPESIFIKASI API ENDPOINT (RESTful API CONTRACT)

### 🔓 A. Endpoint Peserta (Participant Routes)

#### 1. `GET /api/missions`
- **Auth**: Required (`USER` / `ADMIN`)
- **Deskripsi**: Mengambil seluruh daftar misi harian yang aktif beserta status pengumpulan user yang sedang login.
- **Response `200 OK`**:
```json
{
  "status": "success",
  "data": [
    {
      "mission_id": "cuid_misi_1",
      "title": "Misi 1: Upload Feed Instagram MIA 2025",
      "description": "Unggah twibbon dan poster official MIA 2025 di Instagram feed pribadi.",
      "deadline": "2026-09-10T23:59:59.000Z",
      "min_xp": 50,
      "max_xp": 100,
      "min_diamond": 10,
      "max_diamond": 20,
      "google_docs_url": "https://docs.google.com/document/d/example1",
      "status": "ACTIVE",
      "my_submission": {
        "submission_id": "sub_cuid_123",
        "submission_url": "https://instagram.com/p/example",
        "status": "APPROVED",
        "awarded_xp": 100,
        "awarded_diamond": 20,
        "admin_feedback": "Karya sangat sesuai kriteria!",
        "created_at": "2026-09-05T10:00:00.000Z"
      }
    }
  ]
}
```

#### 2. `POST /api/missions/:id/submit`
- **Auth**: Required (`USER`)
- **Payload**:
```json
{
  "submission_url": "https://drive.google.com/file/d/xxxx/view",
  "notes": "Sudah diunggah sesuai format PDF."
}
```
- **Validasi**:
  - `submission_url` wajib format URL valid.
  - Misi belum melewati `deadline`.
  - Peserta belum mengunggah misi ini yang berstatus `PENDING` atau `APPROVED`.

---

### 🔑 B. Endpoint Admin (Admin Management & Review Routes)

#### 1. `POST /api/admin/missions`
- **Auth**: Required (`ADMIN`)
- **Payload**:
```json
{
  "title": "Misi 2: Share Video TikTok MIA",
  "description": "Buat konten kreatif 15 detik tentang persiapan kompetisi.",
  "deadline": "2026-09-15T23:59:00.000Z",
  "min_xp": 100,
  "max_xp": 200,
  "min_diamond": 20,
  "max_diamond": 40,
  "google_docs_url": "https://docs.google.com/document/d/example2",
  "status": "ACTIVE"
}
```

#### 2. `PUT /api/admin/missions/:id`
- **Auth**: Required (`ADMIN`)
- **Deskripsi**: Mengedit data misi harian.

#### 3. `DELETE /api/admin/missions/:id`
- **Auth**: Required (`ADMIN`)
- **Deskripsi**: Menghapus data misi harian.

#### 4. `GET /api/admin/missions/:id/submissions`
- **Auth**: Required (`ADMIN`)
- **Query Params**: `status` (`PENDING`/`APPROVED`/`REJECTED`), `page`, `limit`, `search`.
- **Deskripsi**: Mengambil daftar pengumpulan peserta pada misi tertentu.

#### 5. `POST /api/admin/submissions/:submissionId/review`
- **Auth**: Required (`ADMIN`)
- **Payload**:
```json
{
  "status": "APPROVED", // atau "REJECTED"
  "awarded_xp": 150,
  "awarded_diamond": 30,
  "admin_feedback": "Sangat baik!"
}
```
- **Aturan Bisnis (Atomic Transaction)**:
  - Jika `status === "APPROVED"`, jalankan transaksi atomik DB:
    1. Update status `MissionSubmission` menjadi `APPROVED`, set `awarded_xp` & `awarded_diamond`.
    2. Tambahkan `awarded_xp` ke `User.xp`.
    3. Tambahkan `awarded_diamond` ke `User.points`.

---

## 🎨 4. INTEGRASI NAVIGASI & SPESIFIKASI FRONTEND

### A. Navigasi Utama (Header Navigation)
- Penambahan item menu **`Misi Harian`** (`/misi-harian`) di sebelah **kiri** menu **`Hadiah`** (Tukar Produk) pada:
  1. [`src/components/layout/Header.jsx`](file:///C:/Users/bobyj/Documents/Kuliah/ksm_multimedia/MIA2026/multimediamia-fe/src/components/layout/Header.jsx)
  2. [`src/components/layout/DashboardHeader.jsx`](file:///C:/Users/bobyj/Documents/Kuliah/ksm_multimedia/MIA2026/multimediamia-fe/src/components/layout/DashboardHeader.jsx)
- **Urutan Navigasi**: `Beranda` -> `Kategori Lomba` -> `Timeline` -> `FAQ` -> `Show It` -> `Leaderboard` -> **`Misi Harian`** 🎯 -> **`Hadiah`** 🎁.

### B. Halaman Peserta (`/src/app/misi-harian/page.jsx`)
- **Elemen UI**:
  - Banner Header bertema MIA 2025 (`#0A0D14`, aksen `#E01C20` & `#FED700`).
  - Card Misi Harian:
    - Badge Deadline (Format: `Senin, 10 Sep 2026 - 23:59 WIB`).
    - Judul & Deskripsi Misi.
    - Reward Badge Range: `50 - 100 XP` ⚡ & `10 - 20 Diamonds` 💎.
    - Tombol **"Buka Instruksi Google Docs"** (Buka di tab baru `target="_blank"`).
    - Tombol **"Kirim Pengumpulan"** / **"Lihat Status Pengumpulan"**.
  - Modal Form Upload Link Pengumpulan (`submission_url` & `notes`).

### C. Halaman Admin (`/src/app/admin/misi/page.jsx`)
- Penambahan menu sidebar admin **`Misi Harian`** pada [`src/app/admin/layout.jsx`](file:///C:/Users/bobyj/Documents/Kuliah/ksm_multimedia/MIA2026/multimediamia-fe/src/app/admin/layout.jsx).
- **Tabel Kelola Misi**:
  - Tombol **"+ Tambah Misi Harian"**.
  - Tabel berisi: Judul, Deadline, Range Reward, Total Submission, Status, Aksi (Edit, Delete, Review Submission).
- **Modal Form Create/Edit Misi**.
- **Halaman/Modal Review Pengumpulan Peserta**:
  - List pengumpulan peserta.
  - Link Karya Pengumpulan.
  - Modal Penilaian ACC: Input XP yang Diberikan, Input Diamond yang Diberikan, Catatan Feedback Admin, Tombol "ACC & Transfer Point" & "Tolak".

---

## 🎫 5. RINCIAN TIKET LINEAR (LINEAR BOARD TICKETS)

Anda dapat langsung membuat tiket di **Linear** menggunakan struktur di bawah ini:

### ⚙️ BACKEND TICKETS (MIA-BE)

#### 📌 Ticket BE-01: Skema Database & Migrasi Misi Harian
- **Title**: `[BE] Database Schema & Migration for Daily Missions`
- **Description**: Buat tabel `Mission`, `MissionSubmission`, dan enum pendukung menggunakan Drizzle ORM.
- **Tasks**:
  1. Tambah `missionStatusEnum` dan `missionSubmissionStatusEnum` di `schema.js`.
  2. Deklarasikan tabel `Mission` dan `MissionSubmission`.
  3. Jalankan `npm run db:generate` dan `npm run db:migrate`.
- **Acceptance Criteria**: Tabel `Mission` dan `MissionSubmission` berhasil terbuat di database PostgreSQL tanpa error migration.

#### 📌 Ticket BE-02: Service & Controller CRUD Misi Harian (Admin)
- **Title**: `[BE] Admin CRUD API for Daily Missions`
- **Description**: Buat endpoint `POST`, `PUT`, `DELETE`, `GET` untuk manajemen misi harian oleh Admin.
- **Tasks**:
  1. Buat `mission.service.js` & `admin-mission.controller.js`.
  2. Implementasi validasi Zod untuk payload input misi (Title, Deadline, XP range, Diamond range, Google Docs URL).
  3. Daftarkan router `/api/admin/missions` dengan middleware auth `ADMIN`.
- **Acceptance Criteria**: Admin dapat membuat, memperbarui, menghapus, dan melihat daftar misi.

#### 📌 Ticket BE-03: Service Submission Misi & Fetch User Missions
- **Title**: `[BE] Participant Mission Submission & Fetch APIs`
- **Description**: Sediakan API bagi peserta untuk mengambil daftar misi aktif dan mengunggah link tugas.
- **Tasks**:
  1. Implementasi `GET /api/missions` (include status pengumpulan milik user).
  2. Implementasi `POST /api/missions/:id/submit` dengan validasi deadline & cegah duplicate submission.
- **Acceptance Criteria**: User dapat melihat misi aktif dan mengunggah link pengumpulan sebelum deadline.

#### 📌 Ticket BE-04: API Review Admin & Atomic Reward Credit (XP & Diamonds)
- **Title**: `[BE] Admin Submission Review & Atomic Gamification Reward System`
- **Description**: Implementasi API peninjauan pengumpulan peserta oleh Admin dengan kalkulasi penambahan XP & Diamond secara atomik.
- **Tasks**:
  1. Buat `POST /api/admin/submissions/:submissionId/review`.
  2. Gunakan `db.transaction` untuk memperbarui status submission dan menambah `User.xp` & `User.points`.
- **Acceptance Criteria**: Saat Admin menyetujui pengumpulan (ACC) dengan input misal +100 XP & +20 Diamonds, saldo XP & Poin user di database bertambah secara real-time tanpa race condition.

---

### 💻 FRONTEND TICKETS (MIA-FE)

#### 📌 Ticket FE-01: Integration Menu "Misi Harian" pada Navbar Main Header
- **Title**: `[FE] Add "Misi Harian" Navigation Link to Header Components`
- **Description**: Tambahkan menu "Misi Harian" pada navbar utama disamping kiri menu "Hadiah".
- **Tasks**:
  1. Update [`src/components/layout/Header.jsx`](file:///C:/Users/bobyj/Documents/Kuliah/ksm_multimedia/MIA2026/multimediamia-fe/src/components/layout/Header.jsx).
  2. Update [`src/components/layout/DashboardHeader.jsx`](file:///C:/Users/bobyj/Documents/Kuliah/ksm_multimedia/MIA2026/multimediamia-fe/src/components/layout/DashboardHeader.jsx).
  3. Pastikan posisi persis di sebelah kiri menu "Hadiah" (Tukar Produk).
- **Acceptance Criteria**: Menu "Misi Harian" muncul dengan rapi di desktop & mobile drawer, serta dapat diklik menuju `/misi-harian`.

#### 📌 Ticket FE-02: Halaman List & Detail Misi Harian Peserta (`/misi-harian`)
- **Title**: `[FE] Participant Daily Missions Page & Submission Modal`
- **Description**: Buat halaman `/misi-harian` untuk peserta melihat daftar misi harian dan mengunggah tugas.
- **Tasks**:
  1. Buat custom hook `useMissions()` di `src/hooks/user-use-missions.js`.
  2. Buat UI Card Misi: Judul, Deadline, Deskripsi, Range XP & Diamond, Tombol Google Docs.
  3. Buat Modal Form Submit Link Pengumpulan & Badge Status (`Pending`, `Approved (+XP/+💎)`, `Rejected`).
- **Acceptance Criteria**: Peserta dapat melihat info misi lengkap, membuka link Google Docs, dan mengirimkan link pengumpulan karya.

#### 📌 Ticket FE-03: Sidebar & Halaman Kelola Misi Admin (`/admin/misi`)
- **Title**: `[FE] Admin Daily Missions Management & CRUD UI`
- **Description**: Tambahkan menu Misi Harian di sidebar admin dan buat halaman CRUD Misi.
- **Tasks**:
  1. Update `sidebarItems` di [`src/app/admin/layout.jsx`](file:///C:/Users/bobyj/Documents/Kuliah/ksm_multimedia/MIA2026/multimediamia-fe/src/app/admin/layout.jsx).
  2. Buat halaman [`src/app/admin/misi/page.jsx`](file:///C:/Users/bobyj/Documents/Kuliah/ksm_multimedia/MIA2026/multimediamia-fe/src/app/admin/misi/page.jsx).
  3. Buat Modal Form Tambah & Edit Misi (Title, Deadline DateTime Picker, Min/Max XP, Min/Max Diamond, Google Docs URL).
- **Acceptance Criteria**: Admin dapat menambah, mengubah, dan menghapus misi dari dashboard admin.

#### 📌 Ticket FE-04: Halaman/Modal Review & Grading Submissions Misi (Admin)
- **Title**: `[FE] Admin Mission Submission Review & Grading Modal`
- **Description**: Buat UI untuk Admin memeriksa pengumpulan peserta dan memberikan ACC + XP & Diamond.
- **Tasks**:
  1. Buat tabel daftar pengumpulan peserta per misi.
  2. Buat Modal Penilaian ACC: Input XP yang Diberikan, Input Diamond yang Diberikan, Admin Feedback, Tombol ACC / Tolak.
  3. Integrasikan ke API Review Admin.
- **Acceptance Criteria**: Admin dapat meninjau link pengumpulan, mengklik ACC, dan memasukkan nilai XP/Diamond yang langsung dikreditkan ke peserta.

---
*Dokumen ini dibuat otomatis sebagai blueprint resmi pengerjaan fitur Misi Harian MIA 2025.*
