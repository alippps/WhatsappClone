import { useState, useRef, useEffect } from "react";
import {
  Search, MoreVertical, Camera, MessageSquarePlus,
  Phone as PhoneIcon, PhoneIncoming, PhoneMissed, PhoneOutgoing,
  Plus, X, Check,
} from "lucide-react";
import { COLORS } from "../constants/colors";
import { CHATS } from "../data/chats";
import Avatar from "../components/Avatar";
import Ticks from "../components/Ticks";

const STATUS_ITEMS = [
  { id: 1, name: "Rangga Wijaya",  time: "09:41", seen: false },
  { id: 2, name: "Dewi Lestari",   time: "10:20", seen: false },
  { id: 3, name: "Tim Frontend",   time: "11:05", seen: true  },
  { id: 4, name: "Sinam Coffee",   time: "12:30", seen: true  },
  { id: 5, name: "Budi Santoso",   time: "Kemarin", seen: true },
];

const CALL_LOG = [
  { id: 1, name: "Rangga Wijaya", type: "outgoing", video: false, time: "09:41", duration: "3:21" },
  { id: 2, name: "Dewi Lestari",  type: "incoming", video: true,  time: "Kemarin", duration: "12:04" },
  { id: 3, name: "Mama",          type: "missed",   video: false, time: "Kemarin", duration: null },
  { id: 4, name: "Budi Santoso",  type: "outgoing", video: false, time: "Senin",   duration: "0:47" },
  { id: 5, name: "Tim Frontend",  type: "incoming", video: true,  time: "Senin",   duration: "28:10" },
  { id: 6, name: "Sinam Coffee",  type: "missed",   video: false, time: "12/06",   duration: null },
];

const CALL_ICON = { outgoing: PhoneOutgoing, incoming: PhoneIncoming, missed: PhoneMissed };
const CALL_COLOR = { outgoing: COLORS.accentGreen, incoming: COLORS.accentGreen, missed: "#ff3b30" };

export default function ChatListScreen({ onOpenChat }) {
  const [tab, setTab]           = useState("chats");
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery]       = useState("");
  const [seenStatus, setSeenStatus] = useState({});
  const searchRef               = useRef(null);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const closeSearch = () => { setSearchOpen(false); setQuery(""); };

  const filteredChats = CHATS.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.last.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full" style={{ background: "#fff" }}>
      {/* ── Header ── */}
      <div style={{ background: COLORS.headerGreen }} className="text-white shrink-0">
        {searchOpen ? (
          /* Search bar */
          <div className="flex items-center gap-2 px-3 py-2.5">
            <button onClick={closeSearch} className="p-1">
              <ArrowLeftSearch size={22} />
            </button>
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari..."
              className="flex-1 bg-transparent outline-none text-white placeholder-white/60 text-sm"
            />
            {query && (
              <button onClick={() => setQuery("")} className="p-1">
                <X size={18} />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <h1 className="text-xl font-semibold tracking-wide">WhatsApp</h1>
            <div className="flex items-center gap-4">
              <button className="hover:opacity-80 active:opacity-60 transition-opacity">
                <Camera size={22} />
              </button>
              <button
                onClick={() => { setSearchOpen(true); setTab("chats"); }}
                className="hover:opacity-80 active:opacity-60 transition-opacity"
              >
                <Search size={22} />
              </button>
              <button className="hover:opacity-80 active:opacity-60 transition-opacity">
                <MoreVertical size={22} />
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex text-sm font-medium">
          {[
            { key: "chats",  label: "CHATS"  },
            { key: "status", label: "STATUS" },
            { key: "calls",  label: "CALLS"  },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); closeSearch(); }}
              className="flex-1 py-3 relative transition-opacity"
              style={{ opacity: tab === t.key ? 1 : 0.65 }}
            >
              {t.label}
              {tab === t.key && (
                <span
                  className="absolute left-1/2 -translate-x-1/2 bottom-0 h-0.75 rounded-t-full transition-all"
                  style={{ width: 56, background: "#fff" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto">

        {/* CHATS tab */}
        {tab === "chats" && (
          <>
            {filteredChats.length === 0 ? (
              <div className="p-8 text-center" style={{ color: COLORS.textSecondary }}>
                <Search size={36} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Tidak ada chat ditemukan</p>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onOpenChat(chat)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                >
                  <div className="relative shrink-0">
                    <Avatar name={chat.name} group={chat.group} />
                    {chat.online && (
                      <span
                        className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white"
                        style={{ background: COLORS.accentGreen }}
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 border-b pb-3" style={{ borderColor: "#f0f0f0" }}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium truncate" style={{ color: COLORS.textPrimary }}>
                        {query
                          ? highlightMatch(chat.name, query)
                          : chat.name}
                      </span>
                      <span
                        className="text-xs ml-2 shrink-0"
                        style={{ color: chat.unread ? COLORS.accentGreen : COLORS.textSecondary }}
                      >
                        {chat.time}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="flex items-center gap-1 min-w-0">
                        {chat.status && !chat.last.startsWith("Voice") && (
                          <span className="shrink-0"><Ticks status={chat.status} /></span>
                        )}
                        <span className="text-sm truncate" style={{ color: COLORS.textSecondary }}>
                          {chat.last}
                        </span>
                      </div>
                      {chat.unread > 0 && (
                        <span
                          className="ml-2 shrink-0 text-xs text-white font-medium flex items-center justify-center"
                          style={{
                            background: COLORS.unread,
                            minWidth: 20, height: 20,
                            borderRadius: 10, padding: "0 6px",
                          }}
                        >
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </>
        )}

        {/* STATUS tab */}
        {tab === "status" && (
          <div>
            {/* My status */}
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer border-b" style={{ borderColor: "#f0f0f0" }}>
              <div className="relative shrink-0">
                <Avatar name="Saya" size={48} />
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white"
                  style={{ background: COLORS.accentGreen }}
                >
                  <Plus size={11} color="white" strokeWidth={3} />
                </div>
              </div>
              <div>
                <div className="font-medium text-sm" style={{ color: COLORS.textPrimary }}>Status saya</div>
                <div className="text-xs" style={{ color: COLORS.textSecondary }}>Ketuk untuk tambah status</div>
              </div>
            </div>

            {/* Unseen */}
            {STATUS_ITEMS.filter(s => !s.seen).length > 0 && (
              <>
                <div className="px-4 py-2 text-xs font-semibold" style={{ color: COLORS.textSecondary }}>
                  Update terbaru
                </div>
                {STATUS_ITEMS.filter(s => !s.seen).map(s => (
                  <StatusItem
                    key={s.id}
                    item={s}
                    seen={!!seenStatus[s.id]}
                    onView={() => setSeenStatus(p => ({ ...p, [s.id]: true }))}
                  />
                ))}
              </>
            )}

            {/* Seen */}
            {STATUS_ITEMS.filter(s => s.seen).length > 0 && (
              <>
                <div className="px-4 py-2 text-xs font-semibold" style={{ color: COLORS.textSecondary }}>
                  Sudah dilihat
                </div>
                {STATUS_ITEMS.filter(s => s.seen).map(s => (
                  <StatusItem
                    key={s.id}
                    item={s}
                    seen={!!seenStatus[s.id] || s.seen}
                    onView={() => setSeenStatus(p => ({ ...p, [s.id]: true }))}
                  />
                ))}
              </>
            )}
          </div>
        )}

        {/* CALLS tab */}
        {tab === "calls" && (
          <div>
            <div className="px-4 py-2 text-xs font-semibold" style={{ color: COLORS.textSecondary }}>
              Terbaru
            </div>
            {CALL_LOG.map((call) => {
              const Icon = CALL_ICON[call.type];
              return (
                <div
                  key={call.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="shrink-0">
                    <Avatar name={call.name} size={48} />
                  </div>
                  <div className="flex-1 min-w-0 border-b pb-3" style={{ borderColor: "#f0f0f0" }}>
                    <div className="flex justify-between items-start">
                      <div className="min-w-0">
                        <div className="font-medium truncate text-sm" style={{ color: COLORS.textPrimary }}>
                          {call.name}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Icon size={13} style={{ color: CALL_COLOR[call.type], flexShrink: 0 }} />
                          <span className="text-xs" style={{ color: CALL_COLOR[call.type] }}>
                            {call.type === "missed" ? "Tidak terjawab" : call.type === "incoming" ? "Masuk" : "Keluar"}
                            {call.video ? " · Video" : ""}
                            {call.duration ? ` · ${call.duration}` : ""}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs ml-2 shrink-0" style={{ color: COLORS.textSecondary }}>
                        {call.time}
                      </span>
                    </div>
                  </div>
                  <button
                    className="shrink-0 p-2 rounded-full hover:bg-gray-100 active:scale-90 transition-all"
                    style={{ color: COLORS.headerGreen }}
                  >
                    {call.video ? <Camera size={20} /> : <PhoneIcon size={20} />}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── FAB ── */}
      <button
        className="absolute right-5 bottom-5 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg text-white active:scale-95 transition-transform"
        style={{ background: COLORS.accentGreen }}
      >
        <MessageSquarePlus size={24} />
      </button>
    </div>
  );
}

/* ── StatusItem subcomponent ── */
function StatusItem({ item, seen, onView }) {
  return (
    <button
      onClick={onView}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
    >
      <div className="shrink-0">
        <StatusRing seen={seen}>
          <Avatar name={item.name} size={48} />
        </StatusRing>
      </div>
      <div className="flex-1 min-w-0 border-b pb-3" style={{ borderColor: "#f0f0f0" }}>
        <div className="font-medium text-sm truncate" style={{ color: COLORS.textPrimary }}>
          {item.name}
        </div>
        <div className="text-xs" style={{ color: COLORS.textSecondary }}>
          {item.time}
        </div>
      </div>
    </button>
  );
}

/* ── Story ring around avatar ── */
function StatusRing({ seen, children }) {
  return (
    <div
      className="rounded-full p-[2.5px]"
      style={{
        background: seen
          ? COLORS.textSecondary
          : `conic-gradient(${COLORS.accentGreen} 0% 100%)`,
      }}
    >
      <div className="rounded-full p-0.5 bg-white">
        {children}
      </div>
    </div>
  );
}

/* ── Highlight matching text in search ── */
function highlightMatch(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 rounded-sm">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

/* ArrowLeft inline icon to avoid import collision */
function ArrowLeftSearch({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M5 12l7-7M5 12l7 7" />
    </svg>
  );
}
