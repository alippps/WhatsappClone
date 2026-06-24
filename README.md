# WhatsApp Clone 

Clone tampilan WhatsApp murni UI/UX (tanpa backend)
Dua layar: **Daftar Chat** dan **Ruang Chat**, dengan beberapa interaksi
nyata (kirim pesan, ganti tab, auto-scroll).

langsung saja king di clone buat coba 🤓

## Struktur Folder

```
whatsapp-clone/
├── index.html              # entry HTML Vite
├── package.json
├── vite.config.js          # plugin React + Tailwind v4
└── src/
    ├── main.jsx            # titik masuk React (render <App/>)
    ├── App.jsx             # mengatur perpindahan antar layar
    ├── index.css           # import Tailwind + reset dasar
    ├── constants/
    │   └── colors.js       # design tokens (palet warna)
    ├── data/
    │   ├── chats.js        # data dummy daftar chat
    │   └── messages.js     # data dummy pesan
    ├── utils/
    │   └── avatar.js       # helper inisial & warna avatar
    ├── components/         # komponen kecil reusable
    │   ├── Avatar.jsx
    │   └── Ticks.jsx       # centang status (sent/delivered/read)
    └── screens/            # layar utuh
        ├── ChatListScreen.jsx
        └── ChatRoomScreen.jsx
```

## Alur Import (siapa pakai siapa)

```
main.jsx
  └─ App.jsx
       ├─ screens/ChatListScreen.jsx
       │    ├─ data/chats.js
       │    ├─ components/Avatar.jsx ─ utils/avatar.js ─ constants/colors.js
       │    └─ components/Ticks.jsx  ─ constants/colors.js
       └─ screens/ChatRoomScreen.jsx
            ├─ data/messages.js
            ├─ components/Avatar.jsx
            └─ components/Ticks.jsx
```

## Cara run

```bash
npm install
npm run dev
```

## Catatan

- Memakai **Tailwind CSS v4** (cukup `@import "tailwindcss";` di `index.css`
  + plugin `@tailwindcss/vite`, tanpa file `tailwind.config.js`).
- Warna brand pakai inline style dari `constants/colors.js`; Tailwind hanya
  untuk layout/spacing. Pola campuran ini sengaja agar mudah dipelajari.
- Memakai avatar inisial dan ikon generik (lucide-react), bukan aset resmi
  WhatsApp — ini latihan pola UI, bukan menyalin merek.

## Ide Lanjutan (kalo ngga mager wkwk)

- Dark mode (tinggal tambah set warna kedua di `colors.js`).
- Isi layar Status & Calls.
- Pisah tiap chat punya daftar pesan sendiri.
- Pindah ke React Router untuk navigasi sungguhan.
```
