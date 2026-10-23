# Catatan perubahan

## 2.0.0 — 23 Oktober 2026 · Serumah

- Aplikasi menjadi **Serumah**, dasbor data keluarga. Tumbuh kini menjadi salah satu hub.
- Halaman baru: **Beranda**, **Anggota**, **Dokumen**, **Kontak**, **Tagihan**.
- Pencarian global di beranda; pengingat dokumen kedaluwarsa, tagihan jatuh tempo, dan ulang tahun.
- Nomor dokumen disembunyikan sampai diketuk, bisa disalin sekali ketuk, dan otomatis tersembunyi lagi saat aplikasi ditinggal.
- Anggota anak bisa dihubungkan ke profil Tumbuh.
- **Keamanan:** tautan lihat-saja hanya membawa data Tumbuh; server membuang data keluarga sebelum mengirim.
- **Perbaikan sinkronisasi:** pemeriksaan "ada data atau tidak" kini menghitung data keluarga juga, sehingga data keluarga tanpa profil anak tidak tertimpa saat sinkronisasi pertama.
- Impor/ekspor cadangan mencakup data keluarga.
- Data lama dari Tumbuh 1.x tetap terbaca tanpa perlu migrasi manual.

## 1.2.0 — 23 Oktober 2026

- **Mode offline sungguhan.** README menjanjikan aplikasi bisa dipakai offline, tetapi belum ada service worker sehingga halaman gagal dimuat tanpa internet. Ditambahkan `sw.js`.
- **Bisa dipasang di ponsel.** Ditambahkan `manifest.webmanifest`, ikon aplikasi (`icons/`), dan `apple-touch-icon` untuk iPhone.
- **Batas ukuran data diselaraskan.** Server menerima data keluarga sampai 3,5 MB, tetapi batas isi permintaan hanya 1 MB, sehingga sinkronisasi gagal untuk data 1–3,5 MB. Batas permintaan dinaikkan ke 4,5 MB dan pesan galatnya diperjelas.
- **Teks lebih mudah dibaca.** Ukuran huruf terkecil (7,5–9,5 px) dinaikkan menjadi 9,5–11 px.
- **Input tidak lagi memicu zoom otomatis di iPhone** (ukuran huruf input 16 px di layar ≤ 760 px).
- **Folder `TUMBUH/` dihapus.** Isinya salinan identik dari berkas di root (hanya beda akhiran baris) dan tidak punya `.env.example`/`.gitignore`, sehingga membingungkan.
- Build, header Netlify (CSP, cache `sw.js`, tipe manifest), dan README diperbarui.
- Kode tak terpakai dibersihkan (`validateDateField`, dua variabel).
