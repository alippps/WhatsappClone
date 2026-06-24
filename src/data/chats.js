/* ============================================================
   DATA DUMMY - DAFTAR CHAT
   Di app nyata, data ini datang dari API/database.
   Dipisah ke sini supaya komponen UI tetap bersih.
   ============================================================ */
export const CHATS = [
  { id: 1, name: "Rangga Wijaya", last: "Oke siap, besok ketemu ya \uD83D\uDC4D", time: "09:41", unread: 2, online: true, status: "sent" },
  { id: 2, name: "Tim Frontend", last: "Sigit: PR-nya udah aku review", time: "08:15", unread: 0, online: false, status: "read", group: true },
  { id: 3, name: "Mama", last: "Udah makan belum nak?", time: "Kemarin", unread: 0, online: false, status: "read" },
  { id: 4, name: "Dewi Lestari", last: "Makasih banyak ya \uD83D\uDE4F", time: "Kemarin", unread: 0, online: true, status: "read" },
  { id: 5, name: "Sinam Coffee", last: "Pesanan kamu sudah dikirim \u2615", time: "Senin", unread: 1, online: false, status: "delivered" },
  { id: 6, name: "Budi Santoso", last: "Voice message (0:34)", time: "Senin", unread: 0, online: false, status: "read" },
  { id: 7, name: "Kelas React 2026", last: "Kamu: nanti aku coba dulu", time: "12/06", unread: 0, online: false, status: "delivered", group: true },
  { id: 8, name: "Budiono Siregar", last: "walah gw lupa loh ya", time: "Today", unread: 14, online: true, status: "read" }
];
