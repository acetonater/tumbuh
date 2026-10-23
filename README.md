# Serumah

Web app data keluarga: anggota, nomor dokumen penting, kontak, dan tagihan rutin, dengan **Tumbuh** (monitoring tumbuh kembang anak) sebagai salah satu hub. Bisa dibuka dari HP saat di luar rumah, tetap bisa dipakai tanpa internet, lalu disinkronkan antarperangkat lewat **Netlify Functions + Netlify Blobs**.

Model aksesnya:

- **Satu akun keluarga** — semua perangkat yang boleh mengedit masuk dengan kata sandi keluarga yang sama.
- **Tautan lihat-saja** — hanya membagikan catatan Tumbuh (anak). Data keluarga **tidak pernah** ikut dibagikan.
- **Tanpa layanan database tambahan** — cukup Netlify.

## Fitur

### Rumah keluarga

- **Beranda** dengan pencarian cepat (NIK, BPJS, dokter, PLN, golongan darah, dll.), kontak darurat sekali ketuk, dan daftar “Perlu perhatian”: dokumen yang habis dalam 90 hari, tagihan dekat jatuh tempo, serta ulang tahun 30 hari ke depan.
- **Anggota**: nama, hubungan, tempat & tanggal lahir, golongan darah, alergi, kondisi kesehatan, kontak. Anggota anak bisa dihubungkan ke profil Tumbuh.
- **Dokumen**: KK, NIK, akta, BPJS, paspor, SIM, NPWP, polis, STNK/BPKB, dll. Nomor disembunyikan sampai diketuk, ada tombol salin, tanggal kedaluwarsa, dan catatan lokasi dokumen asli. Hanya teks, bukan foto.
- **Kontak**: kategori darurat, kesehatan, sekolah, kantor, rumah & servis; tombol telepon dan WhatsApp.
- **Tagihan**: nomor pelanggan, atas nama, tanggal jatuh tempo, perkiraan nominal, cara bayar, autodebet, dan tanda lunas per bulan.

### Hub Tumbuh kembang


- Profil beberapa anak, usia otomatis.
- Grafik berat, tinggi, dan lingkar kepala.
- Checklist milestone 0–6 tahun dengan ide stimulasi.
- Jadwal imunisasi dasar 0–18 bulan.
- Jurnal dengan kategori, filter, dan pencarian.
- Ekspor/impor cadangan JSON.
- Bisa dibuka tanpa internet (service worker) dan dipasang ke layar utama ponsel seperti aplikasi.
- Sinkronisasi otomatis setelah data disimpan, plus pemeriksaan tiap 20 detik.
- Deteksi konflik: bila perangkat dan server sama-sama berubah, pengguna diminta memilih versi.
- Tautan lihat-saja yang bisa dinonaktifkan atau diganti kapan saja.

## Struktur berkas

```text
index.html                 Halaman utama
styles.css                 Tampilan desktop & mobile
app.js                     Logika aplikasi, auth UI, sinkronisasi
sw.js                      Service worker untuk mode offline
manifest.webmanifest       Data aplikasi agar bisa dipasang di ponsel
icons/                     Ikon aplikasi (SVG + PNG)
robots.txt                 Menolak pengindeksan mesin pencari
netlify.toml               Build, redirect API, header keamanan
package.json               Dependensi fungsi
scripts/build.mjs          Menyalin berkas statis ke dist/
netlify/functions/         API login, state, share, shared
netlify/lib/cloud.mjs      Sesi, cookie, Blobs, rate limit
.env.example               Contoh variabel lokal
README.md                  Panduan ini
```

## Deploy ke Netlify

> GitHub **tidak wajib**. Pilih salah satu: deploy langsung dengan Netlify CLI, atau hubungkan repository Git agar deploy otomatis. Netlify Drop bisa mencoba mendeteksi build, tetapi untuk Functions + Blobs cara yang paling pasti adalah CLI atau Git.

### Opsi A — langsung lewat Netlify CLI (tanpa GitHub)

Dari folder proyek ini (folder yang berisi `package.json`):

```bash
npm install
npm install -g netlify-cli
netlify login
netlify init
```

Saat `netlify init`, pilih **Create & configure a new site**, lalu ikuti prompt. Setelah site dibuat, atur environment variables dan deploy:

```bash
netlify env:set TUMBUH_EDIT_PASSWORD "kata-sandi-keluarga-yang-kuat"
netlify env:set TUMBUH_SESSION_SECRET "teks-acak-minimal-32-karakter"
netlify deploy --build --prod
```

Netlify CLI akan menjalankan build dari `netlify.toml`, mengunggah `dist/`, serta ikut mengunggah `netlify/functions`.

### Opsi B — lewat GitHub (auto-deploy)

Unggah folder ini ke repository GitHub/GitLab, lalu pilih **Add new site → Import an existing project** di Netlify.

Netlify akan membaca `netlify.toml`:

- Build command: `node scripts/build.mjs`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

### Netlify Drop?

Bisa dicoba dengan menjatuhkan **seluruh folder proyek** (bukan hanya `dist`), termasuk `netlify.toml` dan `netlify/functions`. Jika setelah deploy muncul pesan **“Functions belum tersedia”**, pindah ke Netlify CLI atau Git—kedua cara itu paling pasti untuk Functions + Blobs.

### 2. Atur environment variables (kedua opsi)

Di **Project configuration → Environment variables**, tambahkan:

| Nama | Nilai |
|---|---|
| `TUMBUH_EDIT_PASSWORD` | Kata sandi keluarga yang panjang dan kuat (minimal 8 karakter; disarankan 16+). |
| `TUMBUH_SESSION_SECRET` | Teks acak minimal 32 karakter. |

Buat secret dengan salah satu cara:

```bash
openssl rand -base64 32
```

atau gunakan password manager untuk membuat teks acak panjang.

**Jangan pernah** menaruh password atau session secret di `app.js`, `index.html`, atau berkas yang di-commit ke repository.

### 3. Deploy

Jalankan deploy. Setelah selesai:

1. Buka situs Netlify.
2. Masuk ke menu **Keluarga**.
3. Masukkan kata sandi keluarga.
4. Salin **tautan lihat-saja** dan bagikan hanya kepada orang yang boleh melihat.

Jika situs menampilkan “Functions belum tersedia”, berarti deploy tidak membawa folder `netlify/functions`. Hubungkan repository lewat Git atau deploy dengan Netlify CLI.

## Menjalankan lokal

Prasyarat: Node.js 22.12+ dan Netlify CLI.

```bash
npm install
cp .env.example .env
# isi TUMBUH_EDIT_PASSWORD dan TUMBUH_SESSION_SECRET di .env
npm run build
npx netlify dev
```

Buka alamat yang ditampilkan Netlify CLI (biasanya `http://localhost:8888`).

> `.env` hanya untuk lokal dan sudah masuk `.gitignore`. Jangan mengunggahnya.

## Mode offline & pasang di ponsel

Setelah situs dibuka sekali lewat internet, berkas tampilannya disimpan oleh *service worker* (`sw.js`), sehingga aplikasi tetap bisa dibuka saat tidak ada sinyal. Data yang dicatat saat offline disimpan di perangkat dan dikirim otomatis begitu koneksi kembali.

Untuk memasang ke layar utama:

- **Android (Chrome):** menu ⋮ → **Tambahkan ke layar utama** / **Instal aplikasi**.
- **iPhone (Safari):** tombol Bagikan → **Tambah ke Layar Utama**.

Permintaan ke `/api/` tidak pernah disimpan oleh service worker, jadi data keluarga selalu diambil langsung dari server. Bila mengubah `sw.js`, naikkan nama cache (`tumbuh-shell-v1` → `v2`) agar perangkat lama memuat versi baru.

## Cara kerja sinkronisasi

1. Aplikasi menyimpan data di `localStorage` agar tetap cepat dan bisa offline.
2. Setiap perubahan lokal ditandai sebagai `pending`.
3. Setelah 1,2 detik, aplikasi mengirim snapshot data ke `/api/state`.
4. Server menyimpan data di Netlify Blobs dan menaikkan nomor versi.
5. Perangkat lain memeriksa `/api/state` tiap 20 detik dan saat tab kembali aktif.
6. Bila versi server dan versi lokal sama-sama berubah, muncul pilihan:
   - **Pakai data Netlify**, atau
   - **Timpa dengan data perangkat**.

Tautan lihat-saja memakai endpoint publik `/api/shared?token=...`. Endpoint ini hanya mengembalikan data jika token cocok dan tautan sedang aktif, dan **membuang seluruh data keluarga** (`household`) sebelum mengirim, sehingga yang terlihat hanya catatan Tumbuh. Tidak ada endpoint publik untuk menulis.

### Login dan sesi

- Login hanya memakai satu kata sandi keluarga.
- Server membandingkan kata sandi dengan `TUMBUH_EDIT_PASSWORD` memakai perbandingan waktu-konstan.
- Sesi berupa cookie `HttpOnly`, `Secure` (di HTTPS), `SameSite=Strict`, berlaku 30 hari.
- Token sesi ditandatangani HMAC-SHA256 dengan `TUMBUH_SESSION_SECRET`.
- Percobaan login dibatasi 8 kali per 15 menit per alamat IP.
- Mengganti `TUMBUH_SESSION_SECRET` akan mengakhiri semua sesi lama. Mengganti kata sandi saja tidak membatalkan cookie yang sudah ditandatangani.

### Tautan lihat-saja

- Token dibuat acak 24 byte dan disimpan di Blobs.
- Tautan bisa **dinonaktifkan** tanpa menghapus data.
- **Ganti tautan** membuat token baru; tautan lama langsung tidak berlaku.
- Penerima tautan dapat melihat seluruh catatan Tumbuh, **termasuk jurnal**, tetapi tidak bisa melihat anggota, dokumen, kontak, atau tagihan. Tetap bagikan hanya kepada orang yang dipercaya.
- Halaman `?share=...` memuat data langsung dari API dan tidak menulis ke `localStorage`.

## Keamanan & privasi

**Penting untuk data dokumen (NIK, KK, paspor, dll.):** data dilindungi oleh kata sandi keluarga, tetapi tidak dienkripsi end-to-end. Artinya, keamanan data bergantung pada tiga hal: kata sandi keluarga yang kuat (16+ karakter, tidak dipakai di tempat lain), akun Netlify yang aman (aktifkan verifikasi dua langkah), dan HP yang terkunci. Jangan simpan PIN, password, atau nomor kartu kredit/rekening lengkap di sini — gunakan password manager untuk itu.

Nomor dokumen otomatis disembunyikan lagi saat aplikasi ditinggal ke latar belakang.


- Data disimpan di Netlify Blobs milik project Netlify Anda, bukan di browser pengunjung tautan.
- Data tidak dienkripsi end-to-end. Netlify sebagai penyedia infrastruktur secara teknis dapat mengakses data; ini bukan pengganti aplikasi dengan enkripsi sisi klien.
- Jangan memakai kata sandi yang sama dengan akun email atau bank.
- Jika perangkat hilang, ganti `TUMBUH_EDIT_PASSWORD` **dan** `TUMBUH_SESSION_SECRET`, lalu redeploy.
- Ekspor cadangan JSON secara berkala dari halaman Pengaturan.
- Saat sedang masuk, **Hapus semua data** juga menghapus data keluarga di Netlify dan memengaruhi semua perangkat. Baca konfirmasinya dengan saksama.
- Aplikasi memakai header CSP, `X-Frame-Options: DENY`, `X-Robots-Tag: noindex`, dan `robots.txt` yang menolak pengindeksan.

## Batasan yang perlu diketahui

- Model ini sengaja memakai **satu akun bersama**, jadi tidak ada pemisahan hak akses per anggota atau audit “siapa mengubah apa”. Jika nanti dibutuhkan akun per anggota, arsitektur autentikasinya perlu diubah.
- Netlify Blobs memakai model *last write wins*. Pemeriksaan versi menangkap konflik pada umumnya, tetapi dua penulisan yang benar-benar bersamaan dalam milidetik yang sama masih mungkin saling menimpa. Untuk keluarga dengan dua editor, ini biasanya dapat diterima; untuk kebutuhan audit ketat, gunakan database dengan transaksi/optimistic concurrency yang atomik.
- Tautan lihat-saja adalah kapabilitas: siapa pun yang memiliki URL dapat melihat data sampai tautan diganti atau dinonaktifkan.
- Fungsi ini membutuhkan paket Netlify yang mendukung Functions dan Blobs. Kuota tergantung paket Netlify Anda.
- Aplikasi ini **bukan alat diagnosis medis**. Grafik menampilkan tren pengukuran anak sendiri, bukan kurva persentil WHO. Checklist milestone adalah panduan stimulasi umum. Ikuti buku KIA dan anjuran dokter, bidan, atau posyandu.

## Troubleshooting

| Masalah | Penyebab & solusi |
|---|---|
| “Functions belum tersedia” | Situs di-deploy lewat Netlify Drop. Deploy ulang lewat Git/Netlify CLI. |
| “Sinkronisasi belum diatur” | `TUMBUH_EDIT_PASSWORD` / `TUMBUH_SESSION_SECRET` belum diisi atau kurang panjang. |
| “Sesi berakhir” | Cookie 30 hari habis atau secret berubah. Masuk kembali. |
| Tautan 404 | Tautan sudah diganti/dinonaktifkan, atau token salah. Buat tautan baru dari halaman Keluarga. |
| Data tidak muncul di perangkat lain | Pastikan perangkat masuk dengan akun keluarga yang sama, lalu tekan **Sinkronkan sekarang**. |
| Lupa kata sandi | Ganti kedua environment variable, redeploy, lalu masuk dengan kata sandi baru. |

## Berkembang lebih lanjut

Kalau nanti ingin akun terpisah per anggota, hak akses owner/member, atau berbagi hanya untuk sebagian data, langkah berikutnya adalah mengganti satu-kata-sandi dengan autentikasi per pengguna dan aturan akses di server. Struktur UI saat ini sudah menyediakan tempat untuk halaman **Keluarga** dan status sinkronisasi.
