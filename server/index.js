import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { ROOMS, getMessages, addMessage, markDeleted } from './db.js';
import { BOT_NAME, scheduleBotReply } from './bot.js';

const app = express();
app.use(cors());
app.get('/', (_, res) => res.json({ message: 'WhatsApp Clone API berjalan', clientUrl: 'http://localhost:5173', rooms: ROOMS.length }));
app.get('/health', (_, res) => res.json({ ok: true, rooms: ROOMS.length }));

const server = createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] },
});

// socketId → { username, socketId }
const onlineUsers = new Map();

// roomId → Set<username>
const typingInRoom = new Map();

function formatTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function getRoomOnlineCounts() {
  const counts = Object.fromEntries(ROOMS.map(r => [r.id, 0]));
  for (const [, user] of onlineUsers) {
    const sock = io.sockets.sockets.get(user.socketId);
    if (!sock) continue;
    for (const room of sock.rooms) {
      if (room !== user.socketId && counts[room] !== undefined) counts[room]++;
    }
  }
  return counts;
}

function roomsWithCounts() {
  const counts = getRoomOnlineCounts();
  return ROOMS.map(r => ({ ...r, onlineCount: counts[r.id] || 0 }));
}

function userList() {
  return [...onlineUsers.values()].map(u => u.username);
}

io.on('connection', (socket) => {
  // ── User joins server ──
  socket.on('user:join', ({ username }) => {
    onlineUsers.set(socket.id, { username, socketId: socket.id });
    socket.emit('init', { rooms: roomsWithCounts(), onlineUsers: userList() });
    io.emit('users:update', userList());
    io.emit('rooms:update', roomsWithCounts());
  });

  // ── User enters a chat room ──
  socket.on('room:join', ({ roomId }) => {
    socket.join(roomId);
    socket.emit('room:history', { roomId, messages: getMessages(roomId) });
    io.emit('rooms:update', roomsWithCounts());

    const user = onlineUsers.get(socket.id);
    if (user) {
      const sysMsg = {
        id: uuidv4(), roomId, sender: 'system', type: 'system',
        text: `${user.username} bergabung ke ruangan`,
        time: formatTime(), timestamp: Date.now(),
      };
      io.to(roomId).emit('message:new', { roomId, message: sysMsg });
    }
  });

  // ── User leaves a chat room ──
  socket.on('room:leave', ({ roomId }) => {
    socket.leave(roomId);
    io.emit('rooms:update', roomsWithCounts());
    const user = onlineUsers.get(socket.id);
    const typing = typingInRoom.get(roomId);
    if (typing && user) {
      typing.delete(user.username);
      io.to(roomId).emit('typing:update', { roomId, typingUsers: [...typing] });
    }
  });

  // ── Send message ──
  socket.on('message:send', ({ roomId, text, replyToId }) => {
    const user = onlineUsers.get(socket.id);
    if (!user || !text?.trim()) return;

    const msg = {
      id: uuidv4(), roomId, sender: user.username, type: 'message',
      text: text.trim(), time: formatTime(), timestamp: Date.now(),
      replyToId: replyToId || null, deleted: false,
    };

    addMessage(msg);
    io.to(roomId).emit('message:new', { roomId, message: msg });

    const typing = typingInRoom.get(roomId);
    if (typing) {
      typing.delete(user.username);
      io.to(roomId).emit('typing:update', { roomId, typingUsers: [...typing] });
    }

    const room = ROOMS.find(r => r.id === roomId);
    scheduleBotReply(
      roomId,
      room?.name || roomId,
      () => getMessages(roomId),
      (isTyping) => {
        if (!typingInRoom.has(roomId)) typingInRoom.set(roomId, new Set());
        const t = typingInRoom.get(roomId);
        isTyping ? t.add(BOT_NAME) : t.delete(BOT_NAME);
        io.to(roomId).emit('typing:update', { roomId, typingUsers: [...t] });
      },
      (text) => {
        const botMsg = {
          id: uuidv4(), roomId, sender: BOT_NAME, type: 'message',
          text, time: formatTime(), timestamp: Date.now(),
          replyToId: null, deleted: false,
        };
        addMessage(botMsg);
        io.to(roomId).emit('message:new', { roomId, message: botMsg });
      },
    );
  });

  // ── Delete message ──
  socket.on('message:delete', ({ roomId, msgId }) => {
    const user = onlineUsers.get(socket.id);
    if (!user) return;
    markDeleted(roomId, msgId);
    io.to(roomId).emit('message:deleted', { roomId, msgId });
  });

  // ── Typing indicators ──
  socket.on('typing:start', ({ roomId }) => {
    const user = onlineUsers.get(socket.id);
    if (!user) return;
    if (!typingInRoom.has(roomId)) typingInRoom.set(roomId, new Set());
    typingInRoom.get(roomId).add(user.username);
    socket.to(roomId).emit('typing:update', { roomId, typingUsers: [...typingInRoom.get(roomId)] });
  });

  socket.on('typing:stop', ({ roomId }) => {
    const user = onlineUsers.get(socket.id);
    if (!user) return;
    const typing = typingInRoom.get(roomId);
    if (typing) {
      typing.delete(user.username);
      socket.to(roomId).emit('typing:update', { roomId, typingUsers: [...typing] });
    }
  });

  // ── Disconnect ──
  socket.on('disconnect', () => {
    const user = onlineUsers.get(socket.id);
    onlineUsers.delete(socket.id);
    if (user) {
      for (const [roomId, typing] of typingInRoom) {
        if (typing.has(user.username)) {
          typing.delete(user.username);
          io.to(roomId).emit('typing:update', { roomId, typingUsers: [...typing] });
        }
      }
    }
    io.emit('users:update', userList());
    io.emit('rooms:update', roomsWithCounts());
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`\x1b[32m[server]\x1b[0m Running on http://localhost:${PORT}`));
