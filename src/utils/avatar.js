import { AVATAR_COLORS } from "../constants/colors";

/* ============================================================
   HELPER AVATAR
   Fungsi murni (pure functions): input sama -> output sama.
   Dipisah dari komponen biar gampang dites & dipakai ulang.
   ============================================================ */

// Pilih warna yang konsisten per nama (orang yang sama selalu warna sama)
export const colorFromName = (name) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

// Ambil maksimal 2 huruf depan sebagai inisial: "Rangga Wijaya" -> "RW"
export const initials = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
