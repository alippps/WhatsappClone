import { Check, CheckCheck } from "lucide-react";
import { COLORS } from "../constants/colors";

/* ============================================================
   TICKS - INDIKATOR STATUS PESAN
   sent      -> satu centang abu-abu (terkirim ke server)
   delivered -> dua centang abu-abu (sampai ke perangkat)
   read      -> dua centang biru (sudah dibaca)
   ============================================================ */
export default function Ticks({ status }) {
  if (status === "sent")
    return <Check size={15} style={{ color: COLORS.textSecondary }} />;
  if (status === "delivered")
    return <CheckCheck size={15} style={{ color: COLORS.textSecondary }} />;
  if (status === "read")
    return <CheckCheck size={15} style={{ color: COLORS.tickBlue }} />;
  return null;
}
