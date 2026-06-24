import { useState } from "react";
import ChatListScreen from "./screens/ChatListScreen";
import ChatRoomScreen from "./screens/ChatRoomScreen";

/* ============================================================
   APP - PENGATUR NAVIGASI ANTAR LAYAR
   activeChat === null -> tampilkan daftar chat
   activeChat ada isi  -> tampilkan ruang chat
   (Untuk app besar, ganti pola ini dengan React Router.)
   ============================================================ */
export default function App() {
  const [activeChat, setActiveChat] = useState(null);

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center p-4"
      style={{ background: "#d1d7db" }}
    >
      {/* Bingkai ponsel - supaya terasa seperti aplikasi mobile */}
      <div
        className="relative overflow-hidden bg-white shadow-2xl"
        style={{ width: 390, height: 760, borderRadius: 32, border: "8px solid #111" }}
      >
        {activeChat ? (
          <ChatRoomScreen chat={activeChat} onBack={() => setActiveChat(null)} />
        ) : (
          <ChatListScreen onOpenChat={setActiveChat} />
        )}
      </div>
    </div>
  );
}
