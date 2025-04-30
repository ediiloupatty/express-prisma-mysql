# Sistem Informasi Akademik Politeknik

![Express.js](https://img.shields.io/badge/Express.js-4.x-blue)
![Prisma](https://img.shields.io/badge/Prisma-latest-brightgreen)
![MySQL](https://img.shields.io/badge/MySQL-8.x-orange)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple)

Sistem Informasi Akademik berbasis Express.js, Prisma, dan MySQL. Sistem ini dirancang untuk mengelola data mahasiswa, jurusan, dan program studi pada institusi pendidikan secara efisien.

## 📋 Deskripsi

Sistem Informasi Akademik ini merupakan aplikasi web yang memudahkan pengelolaan data akademik dengan fitur CRUD (Create, Read, Update, Delete) yang lengkap. Dibangun dengan stack teknologi modern, aplikasi ini menawarkan antarmuka yang responsif dan pengolahan data yang cepat.

## ✨ Fitur Utama

- **Manajemen User/Mahasiswa**: Tambah, lihat, edit, dan hapus data mahasiswa
- **Manajemen Jurusan**: Tambah dan hapus data jurusan
- **Manajemen Program Studi**: Tambah dan hapus data program studi
- **Relasi Data**: Tampilan terstruktur dengan relasi antara mahasiswa, jurusan, dan program studi
- **Antarmuka Responsif**: Tampilan yang mudah digunakan di berbagai perangkat

## 🛠️ Teknologi

- **Backend**: Express.js
- **Database ORM**: Prisma
- **Database**: MySQL
- **Frontend**: HTML, JavaScript, Bootstrap 5
- **Icons**: Font Awesome

## 📦 Prasyarat

Sebelum menginstal aplikasi ini, pastikan Anda telah menginstal:

- Node.js (v14 atau lebih baru)
- MySQL Server
- npm atau yarn

## 🚀 Instalasi

1. **Clone repositori**
   ```bash
   git clone https://github.com/ediiloupatty/express-prisma-mysql.git
   cd express-prisma-mysql
   ```

2. **Instal dependensi**
   ```bash
   npm install
   ```

3. **Konfigurasi database**
   
   Buat file `.env` di direktori root dan tambahkan konfigurasi database:
   ```
   DATABASE_URL="mysql://username:password@localhost:3306/polimdo_db"
   ```
   
   Ganti `username` dan `password` dengan kredensial MySQL Anda.

4. **Migrasi database**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

6. **Jalankan aplikasi**
   ```bash
   npm start
   ```

   Aplikasi akan berjalan di `http://localhost:5000`

## 🗄️ Struktur Database

Sistem ini menggunakan tiga model utama:

### Jurusan
```prisma
model Jurusan {
  id            Int      @id @default(autoincrement())
  nama_jurusan  String   @unique
  ketua_jurusan String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relations
  prodi         Prodi[]
  user          User[]
}
```

### Program Studi
```prisma
model Prodi {
  id          Int      @id @default(autoincrement())
  nama_prodi  String   @unique
  ketua_prodi String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  jurusanId   Int
  jurusan     Jurusan  @relation(fields: [jurusanId], references: [id])
  user        User[]
}
```

### User/Mahasiswa
```prisma
model User {
  id        Int      @id @default(autoincrement())
  kode      String   @unique
  nama      String
  no_telp   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  jurusanId Int
  jurusan   Jurusan  @relation(fields: [jurusanId], references: [id])
  prodiId   Int?
  prodi     Prodi?   @relation(fields: [prodiId], references: [id])
}
```

## 🔌 API Endpoints

### Endpoints Jurusan
- `GET /jurusan`: Mendapatkan semua data jurusan
- `POST /jurusan`: Menambah jurusan baru

### Endpoints Prodi
- `GET /prodi`: Mendapatkan semua data prodi
- `POST /prodi`: Menambah prodi baru

### Endpoints User
- `GET /users`: Mendapatkan semua data user
- `GET /users/:id`: Mendapatkan data user berdasarkan ID
- `POST /users`: Menambah user baru
- `PUT /users/:id`: Mengupdate data user
- `DELETE /users/:id`: Menghapus user

## 💻 Struktur Proyek

```
express-prisma-mysql/
├── prisma/
│   └── schema.prisma      # Skema database Prisma
├── public/
│   ├── index.html         # Halaman frontend utama
│   └── script.js          # JavaScript frontend
├── index.js               # File utama server Express
├── .env                   # Konfigurasi environment (tidak disertakan di git)
├── package.json           # Dependensi dan skrip npm
└── README.md              # Dokumentasi proyek
```

## 🔍 Cara Penggunaan

1. Akses aplikasi di browser melalui `http://localhost:5000`
2. Gunakan tab navigasi untuk beralih antara manajemen User, Jurusan, dan Prodi
3. Klik tombol "Tambah" untuk menambahkan data baru
4. Klik ikon edit (✏️) untuk mengubah data
5. Klik ikon hapus (🗑️) untuk menghapus data

## 🚧 Pengembangan Lebih Lanjut

Beberapa fitur yang dapat ditambahkan untuk pengembangan masa depan:
- Autentikasi dan otorisasi user
- Dashboard analitik data akademik
- Manajemen mata kuliah dan jadwal kuliah
- Sistem penilaian dan transkrip nilai
- Eksport data ke format PDF atau Excel
- Notifikasi dan pengumuman

## 👥 Kontribusi

Kontribusi untuk perbaikan dan pengembangan sangat diterima. Jika Anda ingin berkontribusi:

1. Fork repositori
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat `LICENSE` untuk informasi lebih lanjut.

## 📧 Kontak

Edi Loupatty - [GitHub Profile](https://github.com/ediiloupatty)

Link Repositori: [https://github.com/ediiloupatty/express-prisma-mysql](https://github.com/ediiloupatty/express-prisma-mysql)

---

⭐ Politeknik Negeri Manado ⭐
