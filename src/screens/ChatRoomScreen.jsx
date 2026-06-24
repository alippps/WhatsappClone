import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft, Phone, Video, MoreVertical,
  Smile, Paperclip, Camera, Mic, Send,
  Reply, Trash2, Copy, ChevronDown, X,
  FileText, Image as ImageIcon, Music, MapPin, User,
} from "lucide-react";
import { COLORS } from "../constants/colors";
import { MESSAGES } from "../data/messages";
import Avatar from "../components/Avatar";
import Ticks from "../components/Ticks";

const CHAT_PATTERN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3Ccircle cx='60' cy='40' r='1.5'/%3E%3Ccircle cx='30' cy='60' r='2'/%3E%3Cpath d='M50 10l4 4-4 4-4-4z'/%3E%3C/g%3E%3C/svg%3E\")";

const EMOJIS = [
  "😀","😁","😂","🤣","😊","😍","🥰","🤩",
  "😎","🥳","😏","🙄","😢","😭","😤","😠",
  "🤔","😴","🤗","😜","👍","👎","❤️","🔥",
  "✨","💯","🎉","🙏","😮","👏","💪","🤞",
  "🫡","🥺","😩","😅","👋","✌️","💀","😈",
  "🤌","🫶","🥹","🎊","💫","⭐","🌟","💥",
];

const ATTACH_OPTIONS = [
  { icon: FileText,  label: "Dokumen", color: "#7f66ff" },
  { icon: Camera,    label: "Kamera",  color: "#ff2e74" },
  { icon: ImageIcon, label: "Galeri",  color: "#007bfc" },
  { icon: Music,     label: "Audio",   color: "#ff9500" },
  { icon: MapPin,    label: "Lokasi",  color: "#00a884" },
  { icon: User,      label: "Kontak",  color: "#ff2e74" },
];

const QUICK_REACTIONS = ["❤️", "😂", "😮", "😢", "🙏", "👍"];

const CONTACT_REPLIES = [
  "Ok sip! 👍",
  "Oke noted ya, makasih!",
  "Wah iya bener juga",
  "Haha bisa jadi 😄",
  "Hmm aku pikirin dulu ya",
  "Siap, nanti aku cek lagi",
  "Iya setuju banget!",
  "Mantap sih! 🔥",
];

export default function ChatRoomScreen({ chat, onBack }) {
  const [messages, setMessages]       = useState(MESSAGES);
  const [draft, setDraft]             = useState("");
  const [showEmoji, setShowEmoji]     = useState(false);
  const [showAttach, setShowAttach]   = useState(false);
  const [replyTo, setReplyTo]         = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [hoveredMsg, setHoveredMsg]   = useState(null);
  const [isTyping, setIsTyping]       = useState(false);
  const [reactions, setReactions]     = useState({});

  const scrollRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 150);
  };

  const scrollToBottom = () =>
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });

  const progressStatus = (msgId) => {
    setTimeout(() =>
      setMessages(m => m.map(msg => msg.id === msgId ? { ...msg, status: "delivered" } : msg)), 1200);
    setTimeout(() =>
      setMessages(m => m.map(msg => msg.id === msgId ? { ...msg, status: "read" } : msg)), 3500);
  };

  const simulateReply = () => {
    setIsTyping(true);
    const delay = 1800 + Math.random() * 1800;
    setTimeout(() => {
      setIsTyping(false);
      const now  = new Date();
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const text = CONTACT_REPLIES[Math.floor(Math.random() * CONTACT_REPLIES.length)];
      setMessages(m => [...m, { id: Date.now(), text, out: false, time }]);
    }, delay);
  };

  const send = () => {
    if (!draft.trim()) return;
    const now  = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const newMsg = {
      id: Date.now(),
      text: draft.trim(),
      out: true,
      time,
      status: "sent",
      replyToId: replyTo?.id ?? null,
    };
    setMessages(m => [...m, newMsg]);
    setDraft("");
    setReplyTo(null);
    setShowEmoji(false);
    progressStatus(newMsg.id);
    setTimeout(simulateReply, 600 + Math.random() * 400);
  };

  const addReaction = (msgId, emoji) => {
    setReactions(r => {
      const cur = r[msgId] || [];
      const already = cur.find(x => x.emoji === emoji);
      return {
        ...r,
        [msgId]: already ? cur.filter(x => x.emoji !== emoji) : [...cur, { emoji }],
      };
    });
    setContextMenu(null);
    setHoveredMsg(null);
  };

  const deleteMsg = (id) => {
    setMessages(m =>
      m.map(msg => msg.id === id ? { ...msg, text: "Pesan ini telah dihapus", deleted: true } : msg)
    );
    setContextMenu(null);
  };

  const copyMsg = (text) => {
    navigator.clipboard?.writeText(text);
    setContextMenu(null);
  };

  const handleRightClick = (e, msg) => {
    e.preventDefault();
    setContextMenu({ msgId: msg.id, msg, x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest("[data-overlay]")) {
        setContextMenu(null);
        setShowEmoji(false);
        setShowAttach(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getReplyMsg = (id) => messages.find(m => m.id === id);

  const inputBottom = replyTo ? 128 : 70;

  return (
    <div
      className="flex flex-col h-full relative"
      style={{ background: COLORS.chatBg }}
      onClick={() => setHoveredMsg(null)}
    >
      {/* ── Header ── */}
      <div
        style={{ background: COLORS.headerGreen }}
        className="text-white flex items-center gap-2 px-2 py-2 z-10 shadow-md shrink-0"
      >
        <button
          onClick={onBack}
          className="p-1 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <Avatar name={chat.name} size={40} group={chat.group} />
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{chat.name}</div>
          <div className="text-xs opacity-80">
            {isTyping
              ? <span className="animate-pulse">sedang mengetik...</span>
              : chat.online ? "online" : "terakhir dilihat hari ini 08:12"}
          </div>
        </div>
        <div className="flex items-center gap-3 pr-1">
          {[Video, Phone, MoreVertical].map((Icon, i) => (
            <button
              key={i}
              className="p-1 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
            >
              <Icon size={i === 1 ? 20 : 22} />
            </button>
          ))}
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 py-3 space-y-1"
        style={{ backgroundColor: COLORS.chatBg, backgroundImage: CHAT_PATTERN }}
      >
        <div className="flex justify-center my-2">
          <span
            className="text-xs px-3 py-1 rounded-md shadow-sm"
            style={{ background: "#fff", color: COLORS.textSecondary }}
          >
            HARI INI
          </span>
        </div>

        {messages.map((msg) => {
          const replyMsg   = msg.replyToId ? getReplyMsg(msg.replyToId) : null;
          const msgReacts  = reactions[msg.id] || [];
          const isHovered  = hoveredMsg === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex ${msg.out ? "justify-end" : "justify-start"} items-end gap-1`}
              onMouseEnter={() => setHoveredMsg(msg.id)}
              onMouseLeave={() => setHoveredMsg(null)}
            >
              {/* Hover action — outgoing side (left of bubble) */}
              {isHovered && msg.out && !msg.deleted && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setReplyTo(msg);
                    inputRef.current?.focus();
                    setHoveredMsg(null);
                  }}
                  className="p-1.5 rounded-full bg-white/80 shadow-sm hover:bg-white transition-colors shrink-0"
                >
                  <Reply size={13} style={{ color: COLORS.textSecondary }} />
                </button>
              )}

              <div className={`flex flex-col max-w-[78%] ${msg.out ? "items-end" : "items-start"}`}>
                {/* Bubble */}
                <div
                  className="relative px-2.5 py-1.5 shadow-sm select-text"
                  style={{
                    background: msg.out ? COLORS.bubbleOut : COLORS.bubbleIn,
                    borderRadius: 8,
                    borderTopRightRadius: msg.out ? 0 : 8,
                    borderTopLeftRadius:  msg.out ? 8 : 0,
                    opacity: msg.deleted ? 0.7 : 1,
                  }}
                  onContextMenu={(e) => handleRightClick(e, msg)}
                >
                  {/* Reply quote */}
                  {replyMsg && (
                    <div
                      className="mb-1.5 px-2 py-1 rounded text-xs border-l-4"
                      style={{
                        borderColor: COLORS.accentGreen,
                        background: msg.out ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.04)",
                      }}
                    >
                      <div className="font-semibold mb-0.5" style={{ color: COLORS.accentGreen }}>
                        {replyMsg.out ? "Kamu" : chat.name}
                      </div>
                      <div className="truncate" style={{ color: COLORS.textSecondary }}>
                        {replyMsg.text}
                      </div>
                    </div>
                  )}

                  <p
                    className="text-sm pr-12"
                    style={{
                      color:      msg.deleted ? COLORS.textSecondary : COLORS.textPrimary,
                      fontStyle:  msg.deleted ? "italic" : "normal",
                      lineHeight: 1.4,
                    }}
                  >
                    {msg.text}
                  </p>
                  <div className="flex items-center gap-1 justify-end -mt-1">
                    <span className="text-[10px]" style={{ color: COLORS.textSecondary }}>
                      {msg.time}
                    </span>
                    {msg.out && <Ticks status={msg.status} />}
                  </div>
                </div>

                {/* Reactions */}
                {msgReacts.length > 0 && (
                  <div className="flex gap-0.5 -mt-1 flex-wrap">
                    {msgReacts.map(({ emoji }, i) => (
                      <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); addReaction(msg.id, emoji); }}
                        className="text-sm bg-white rounded-full px-1.5 py-0.5 shadow-sm hover:scale-110 transition-transform active:scale-95"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Hover action — incoming side (right of bubble) */}
              {isHovered && !msg.out && !msg.deleted && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setReplyTo(msg);
                    inputRef.current?.focus();
                    setHoveredMsg(null);
                  }}
                  className="p-1.5 rounded-full bg-white/80 shadow-sm hover:bg-white transition-colors shrink-0"
                >
                  <Reply size={13} style={{ color: COLORS.textSecondary }} />
                </button>
              )}
            </div>
          );
        })}

        {/* Contact typing dots */}
        {isTyping && (
          <div className="flex justify-start">
            <div
              className="inline-flex items-center gap-1 px-4 py-2.5 shadow-sm"
              style={{
                background: COLORS.bubbleIn,
                borderRadius: 8,
                borderTopLeftRadius: 0,
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full inline-block animate-bounce"
                  style={{
                    background: COLORS.textSecondary,
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: "0.9s",
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Scroll-to-bottom FAB ── */}
      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="absolute right-4 z-20 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
          style={{ bottom: inputBottom + 8 }}
        >
          <ChevronDown size={20} style={{ color: COLORS.textSecondary }} />
        </button>
      )}

      {/* ── Context menu ── */}
      {contextMenu && (
        <div
          data-overlay
          className="fixed z-50 bg-white rounded-2xl shadow-2xl overflow-hidden"
          style={{
            minWidth: 180,
            top:  Math.min(contextMenu.y, 560),
            left: Math.max(8, Math.min(contextMenu.x - 90, 200)),
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Quick reactions */}
          <div
            className="flex justify-around px-3 py-2.5 border-b"
            style={{ borderColor: "#f0f0f0" }}
          >
            {QUICK_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => addReaction(contextMenu.msgId, emoji)}
                className="text-xl hover:scale-125 active:scale-95 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
          {/* Actions */}
          {[
            {
              show: true,
              icon: Reply,
              label: "Balas",
              onClick: () => { setReplyTo(contextMenu.msg); setContextMenu(null); inputRef.current?.focus(); },
              color: COLORS.textPrimary,
            },
            {
              show: !contextMenu.msg.deleted,
              icon: Copy,
              label: "Salin",
              onClick: () => copyMsg(contextMenu.msg.text),
              color: COLORS.textPrimary,
            },
            {
              show: contextMenu.msg.out && !contextMenu.msg.deleted,
              icon: Trash2,
              label: "Hapus",
              onClick: () => deleteMsg(contextMenu.msgId),
              color: "#ff3b30",
            },
          ].filter(a => a.show).map(({ icon: Icon, label, onClick, color }) => (
            <button
              key={label}
              onClick={onClick}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 active:bg-gray-100 transition-colors"
              style={{ color }}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>
      )}

      {/* ── Emoji picker ── */}
      {showEmoji && (
        <div
          data-overlay
          className="absolute left-2 right-2 z-30 bg-white rounded-2xl shadow-xl p-3"
          style={{ bottom: inputBottom + 4 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-8 gap-0.5">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => { setDraft(d => d + emoji); inputRef.current?.focus(); }}
                className="text-xl p-1 rounded-lg hover:bg-gray-100 active:scale-90 transition-all"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Attach menu ── */}
      {showAttach && (
        <div
          data-overlay
          className="absolute left-2 z-30 bg-white rounded-2xl shadow-xl p-4"
          style={{ bottom: inputBottom + 4, width: 220 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-3 gap-3">
            {ATTACH_OPTIONS.map(({ icon: Icon, label, color }) => (
              <button
                key={label}
                onClick={() => setShowAttach(false)}
                className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-gray-50 active:scale-95 transition-all"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: color }}
                >
                  <Icon size={21} color="white" />
                </div>
                <span className="text-[11px]" style={{ color: COLORS.textSecondary }}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Reply preview bar ── */}
      {replyTo && (
        <div
          className="flex items-center gap-2 px-3 py-2 shrink-0 border-l-4"
          style={{ borderColor: COLORS.accentGreen, background: "#f5f5f5" }}
        >
          <Reply size={16} style={{ color: COLORS.accentGreen, flexShrink: 0 }} />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold" style={{ color: COLORS.accentGreen }}>
              {replyTo.out ? "Kamu" : chat.name}
            </div>
            <div className="text-xs truncate" style={{ color: COLORS.textSecondary }}>
              {replyTo.text}
            </div>
          </div>
          <button
            onClick={() => setReplyTo(null)}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors shrink-0"
          >
            <X size={15} style={{ color: COLORS.textSecondary }} />
          </button>
        </div>
      )}

      {/* ── Input bar ── */}
      <div className="px-2 py-2 flex items-end gap-2 shrink-0" style={{ background: COLORS.chatBg }}>
        <div className="flex-1 flex items-center bg-white rounded-3xl px-3 py-2 shadow-sm gap-1">
          <button
            data-overlay
            onClick={(e) => { e.stopPropagation(); setShowEmoji(s => !s); setShowAttach(false); }}
            className="p-0.5 rounded-full hover:bg-gray-100 active:scale-90 transition-all shrink-0"
          >
            <Smile
              size={22}
              style={{ color: showEmoji ? COLORS.accentGreen : COLORS.textSecondary }}
            />
          </button>
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ketik pesan"
            className="flex-1 mx-1 outline-none text-sm bg-transparent"
            style={{ color: COLORS.textPrimary }}
          />
          <div className="flex items-center gap-2 shrink-0">
            <button
              data-overlay
              onClick={(e) => { e.stopPropagation(); setShowAttach(s => !s); setShowEmoji(false); }}
              className="p-0.5 rounded-full hover:bg-gray-100 active:scale-90 transition-all"
            >
              <Paperclip
                size={20}
                style={{ color: showAttach ? COLORS.accentGreen : COLORS.textSecondary }}
              />
            </button>
            <button className="p-0.5 rounded-full hover:bg-gray-100 active:scale-90 transition-all">
              <Camera size={20} style={{ color: COLORS.textSecondary }} />
            </button>
          </div>
        </div>
        <button
          onClick={send}
          className="w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0 active:scale-95 transition-transform shadow-md"
          style={{ background: COLORS.headerGreen }}
        >
          {draft.trim() ? <Send size={20} /> : <Mic size={22} />}
        </button>
      </div>
    </div>
  );
}
