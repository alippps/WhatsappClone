import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'data.json');
const MAX_PER_ROOM = 100;

export const ROOMS = [
  { id: 'general', name: 'Umum',      description: 'Obrolan umum untuk semua' },
  { id: 'tech',    name: 'Teknologi', description: 'Diskusi dunia teknologi'   },
  { id: 'random',  name: 'Random',    description: 'Topik apapun bebas'        },
  { id: 'gaming',  name: 'Gaming',    description: 'Game & dunia hiburan'      },
  { id: 'music',   name: 'Musik',     description: 'Musik, lagu & playlist'    },
];

function load() {
  try {
    if (existsSync(DB_PATH)) return JSON.parse(readFileSync(DB_PATH, 'utf8'));
  } catch {}
  return { messages: {} };
}

function save(data) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function getMessages(roomId) {
  return load().messages[roomId] || [];
}

export function addMessage(msg) {
  const data = load();
  if (!data.messages[msg.roomId]) data.messages[msg.roomId] = [];
  data.messages[msg.roomId].push(msg);
  if (data.messages[msg.roomId].length > MAX_PER_ROOM) {
    data.messages[msg.roomId] = data.messages[msg.roomId].slice(-MAX_PER_ROOM);
  }
  save(data);
}

export function markDeleted(roomId, msgId) {
  const data = load();
  if (data.messages[roomId]) {
    data.messages[roomId] = data.messages[roomId].map(m =>
      m.id === msgId ? { ...m, text: 'Pesan ini telah dihapus', deleted: true } : m
    );
    save(data);
  }
}
