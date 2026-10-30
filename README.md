# Abdee Alfarizi — portfolio

Portfolio pribadi graphic designer & part-time coder (design termasuk carousel TikTok, fotografi, code) berbentuk feed sosial media: setiap karya adalah satu post, setiap post punya beberapa slide. Dibangun dengan Next.js 16, Tailwind v4, Motion, dan Keystatic. Tidak ada database: semua konten disimpan sebagai file di repo.

## Menjalankan

```bash
npm install
npm run dev
```

- `http://localhost:3000`: otomatis diarahkan ke `/id` atau `/en` (lihat bagian Bahasa)
- `/id` dan `/en`: beranda (profil + grid)
- `/id/feed`: feed vertikal (`/id/feed?post=<slug>&cat=design` untuk deep link)
- `/id/p/<slug>`: halaman satu post (untuk dibagikan)
- `/keystatic`: panel admin untuk menambah atau mengedit post (hanya saat `npm run dev`)

## Bahasa (Indonesia & English)

Website ini punya dua bahasa, dengan alamat terpisah: `/id/...` dan `/en/...`. Bahasa dipilih dengan urutan:

1. **Pilihan manual**: tombol `ID | EN` di header. Pilihan disimpan di cookie `locale` selama setahun
2. **Bahasa browser pengunjung** (header `Accept-Language`): Indonesia → `/id`, Inggris → `/en`, bahasa lain → `/en`
3. Kalau browser tidak mengirim bahasa apa pun, dipakai Indonesia

Logikanya ada di [src/proxy.ts](src/proxy.ts). Karena tiap bahasa punya URL sendiri, link yang dibagikan selalu terbuka dalam bahasa yang sama, dan Google tahu keduanya adalah halaman yang sama (tag `hreflang` sudah dipasang).

- **Teks antarmuka** (tombol, label, judul bagian) ada di `src/i18n/dictionaries/id.ts` dan `en.ts`. Kalau menambah teks baru, isi di kedua file; TypeScript akan menolak build kalau ada yang ketinggalan
- **Isi konten** (judul, caption, alt text, bio, skill) punya kolom Indonesia dan English di `/keystatic`. Kolom English boleh kosong: pengunjung berbahasa Inggris akan melihat versi Indonesia
- Gambar carousel TikTok tetap berbahasa Indonesia karena itu hasil desain aslinya

## CV

File CV ada di `public/cv/`. Tombol **Download CV** memberikan CV yang sesuai bahasa halaman: `/id` mengunduh versi Indonesia, `/en` versi Inggris. Di halaman About ada juga link ke versi bahasa lainnya.

Untuk mengganti CV, timpa file dengan nama yang sama di `public/cv/`. Kalau namanya berubah, sesuaikan `cvFile` di [src/i18n/config.ts](src/i18n/config.ts).

## Menambah post dari folder `bahan/` (cara cepat)

Taruh file mentah di `bahan/`, lalu jalankan:

```bash
npm run import
```

| Folder di `bahan/` | Jadi kategori | Catatan |
|---|---|---|
| `konten*` (mis. `konten-26`, `Konten 7`) | Design | 1 folder = 1 post, slide diurutkan berdasarkan nama file |
| `fotografi/` | Fotografi | 1 foto = 1 post. Subfolder di dalamnya = 1 album |
| `code*` | Code | |
| folder lain (mis. `lattefolk design`) | Design | |
| `profile.png` | Foto profil | |

Script ini mengompres gambar (PNG 15MB jadi sekitar 300KB), menebak rasio dan warna aksen, membaca `caption.txt` (baris `#tag` jadi tags) dan `konten.json` (jadi alt text). Post yang sudah ada **tidak ditimpa**, jadi editanmu aman. Pakai `npm run import -- --force` kalau ingin mengulang semuanya.

Supaya views dan link TikTok ikut ter-import, tambahkan `info.json` di folder konten:

```json
{ "views": 125000, "source": "https://www.tiktok.com/@kreativa.dev/photo/123", "featured": true }
```

Field lain yang bisa dipakai: `title`, `caption`, `date`, `tags`, `stack`, `accent`, dan `ratio`. Post hasil import belum punya terjemahan Inggris; isi lewat `/keystatic` (kolom English). Untuk satu foto, pakai `<nama-foto>.json` di sebelah fotonya. Post diurutkan: yang di-pin dulu, lalu views terbanyak, lalu yang terbaru.

Folder `bahan/` tidak ikut di-commit (ada di `.gitignore`). Yang masuk repo hanya versi teroptimasi di `public/posts/`.

## Menambah atau mengedit post lewat admin

1. Buka `http://localhost:3000/keystatic`, lalu pilih **Posts → Create**
2. Isi judul, kategori, warna aksen, dan rasio slide. Upload cover, lalu tambahkan slide (wajib isi alt text). Isi juga kolom **English** (judul, caption, alt text) supaya pengunjung berbahasa Inggris melihat teks yang sesuai
3. Simpan. Keystatic akan menulis:
   - `content/posts/<slug>.yaml`: data post
   - `public/posts/<slug>/...`: gambar
4. Commit dan push. Vercel akan otomatis build ulang

Tips gambar: export JPG/PNG sekitar 1080px lebar (4:5 = 1080×1350). `next/image` akan mengubahnya ke AVIF/WebP dengan ukuran yang pas untuk tiap layar.

## Panel admin di production (opsional)

Secara default Keystatic memakai mode `local`, yang hanya berfungsi saat `npm run dev`. Supaya bisa edit langsung dari website yang sudah online:

1. Push repo ke GitHub, lalu set env `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO=username/repo` di Vercel
2. Buka `/keystatic` di production dan ikuti wizard pembuatan GitHub App. Wizard akan memberi `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, dan `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`. Masukkan semuanya ke env Vercel
3. Setiap kali kamu menyimpan di admin, perubahan menjadi commit dan Vercel akan redeploy

Set juga `NEXT_PUBLIC_SITE_URL=https://domain-kamu.com` supaya link OG/share benar.

## Struktur

```
keystatic.config.ts      skema konten (posts + profil, kolom Indonesia & English)
content/                 data YAML
public/posts/<slug>/     gambar slide
public/cv/               file CV (ID dan EN)
src/proxy.ts             memilih bahasa dan mengarahkan ke /id atau /en
src/i18n/                config bahasa, kamus teks (dictionaries/), provider untuk client component
src/lib/content.ts       pembaca konten (server, di-cache dengan "use cache", satu cache per bahasa)
src/app/[lang]/          semua halaman (beranda, feed, about, post), satu salinan per bahasa
src/components/feed/     Feed, FeedPost, SlideCarousel, ActionRail, CaptionSheet
src/components/home/     ProfileHeader, PostGrid
src/components/ui/       BrutalButton, Sticker, CategoryTabs, Marquee, LanguageToggle, header/footer
src/app/globals.css      design token (warna, shadow, radius)
```

## Catatan desain

- Warna dan shadow didefinisikan di `@theme` pada `globals.css`. Shadow dibuat tanpa blur supaya ringan
- Latar titik-titik (`bg-dots-soft`) hanya dipakai di section Selected Work supaya nama dan deskripsi di hero tetap terbaca
- Teks di atas `blue` memakai warna putih karena teks ink tidak lolos kontras 4.5:1
- Like disimpan di `localStorage` pengunjung, jadi tidak butuh backend
- Animasi otomatis dikurangi kalau pengunjung mengaktifkan *reduce motion*
