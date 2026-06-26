import Anthropic from '@anthropic-ai/sdk';

export const BOT_NAME = 'Asisten AI';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// roomId → setTimeout handle (debounce)
const botTimers = new Map();

// roomId → timestamp of last bot reply (cooldown)
const lastReply = new Map();
const COOLDOWN_MS = 5000;
const DEBOUNCE_MS = 2000;

export function scheduleBotReply(roomId, roomName, getHistory, onTyping, onReply) {
  if (botTimers.has(roomId)) clearTimeout(botTimers.get(roomId));

  botTimers.set(roomId, setTimeout(async () => {
    botTimers.delete(roomId);

    const now = Date.now();
    if (now - (lastReply.get(roomId) || 0) < COOLDOWN_MS) return;

    onTyping(true);
    try {
      const reply = await generateReply(roomName, getHistory());
      if (reply) {
        lastReply.set(roomId, Date.now());
        onReply(reply);
      }
    } catch (err) {
      console.error('[bot] error:', err.message);
    } finally {
      onTyping(false);
    }
  }, DEBOUNCE_MS));
}

async function generateReply(roomName, messages) {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your-api-key-here') {
    console.warn('[bot] ANTHROPIC_API_KEY belum diset — lewati balasan bot');
    return null;
  }

  const context = messages
    .filter(m => m.type === 'message' && !m.deleted && m.sender !== BOT_NAME)
    .slice(-8)
    .map(m => `${m.sender}: ${m.text}`)
    .join('\n');

  if (!context) return null;

  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 200,
    system: `Kamu adalah asisten AI yang ramah di grup chat "${roomName}". Balas dengan singkat (1-2 kalimat), natural, dan dalam Bahasa Indonesia. Jangan sebut namamu sendiri. Jangan terlalu formal.`,
    messages: [{
      role: 'user',
      content: `Percakapan terbaru:\n${context}\n\nBerikan satu balasan singkat yang natural.`,
    }],
  });

  return response.content[0]?.text?.trim() || null;
}
