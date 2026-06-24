/* ============================================================
   DATA DUMMY - PESAN DALAM SATU RUANG CHAT
   out: true  -> pesan dari kita (gelembung hijau, rata kanan)
   out: false -> pesan lawan bicara (gelembung putih, rata kiri)
   status     -> sent | delivered | read (untuk centang)
   ============================================================ */
export const MESSAGES = [
  { id: 1, text: "Halo, lagi sibuk gak?", out: false, time: "09:30" },
  { id: 2, text: "Engga kok, kenapa?", out: true, time: "09:31", status: "read" },
  { id: 3, text: "Mau tanya soal desain landing page yang kemarin", out: false, time: "09:32" },
  { id: 4, text: "Boleh banget, bagian mana?", out: true, time: "09:33", status: "read" },
  { id: 5, text: "Yang section hero-nya. Aku rasa tipografinya kurang nendang", out: false, time: "09:35" },
  { id: 6, text: "Setuju sih. Aku coba pakai display font yang lebih tegas ya", out: true, time: "09:36", status: "read" },
  { id: 7, text: "Mantap \uD83D\uDD25 Kira-kira kelar kapan?", out: false, time: "09:40" },
  { id: 8, text: "Oke siap, besok ketemu ya \uD83D\uDC4D", out: false, time: "09:41" },
  { id: 9, text: "testing aplikasi wangsaf", out: false, time: "12:11", status: "delivered" }
];
