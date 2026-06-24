import { Users } from "lucide-react";
import { colorFromName, initials } from "../utils/avatar";

/* ============================================================
   AVATAR
   Avatar berbasis inisial - tanpa perlu file gambar.
   Kalau group=true, tampilkan ikon orang banyak.

   Props:
   - name  : nama untuk inisial & warna
   - size  : diameter dalam px (default 48)
   - group : boolean, true untuk chat grup
   ============================================================ */
export default function Avatar({ name, size = 48, group }) {
  return (
    <div
      className="flex items-center justify-center font-semibold text-white shrink-0 select-none"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: colorFromName(name),
        fontSize: size * 0.36,
      }}
    >
      {group ? <Users size={size * 0.5} /> : initials(name)}
    </div>
  );
}
