import { RateLimiter, type Brief } from './brief.js';
import { ui, type Lang } from './content.js';

interface TgUser {
  id: number;
  username?: string;
  language_code?: string;
}

interface TgMessage {
  chat: { id: number; type: string };
  from?: TgUser;
  text?: string;
}

export interface TgUpdate {
  update_id: number;
  message?: TgMessage;
  callback_query?: { id: string; from: TgUser; data?: string; message?: TgMessage };
}

type Step = 'what' | 'when' | 'reply';

interface Session {
  step: Step;
  lang: Lang;
  what: string;
  when: string;
}

export interface BotConfig {
  token: string;
  deliver: (brief: Brief) => Promise<void>;
  fetchImpl?: typeof fetch;
}

type Button = [label: string, data: string];

const langOf = (code: string | undefined): Lang =>
  code === 'uk' || code === 'ru' || code === 'be' ? 'uk' : 'en';

export function createBot(cfg: BotConfig) {
  const doFetch = cfg.fetchImpl ?? fetch;
  const sessions = new Map<number, Session>();
  const limiter = new RateLimiter(3, 60 * 60_000);

  async function call<T = unknown>(method: string, payload: object): Promise<T> {
    const res = await doFetch(`https://api.telegram.org/bot${cfg.token}/${method}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Telegram ${method} responded with ${res.status}`);
    return ((await res.json()) as { result: T }).result;
  }

  const say = (chatId: number, text: string, rows: Button[][] = []) =>
    call('sendMessage', {
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
      ...(rows.length
        ? {
            reply_markup: {
              inline_keyboard: rows.map((row) =>
                row.map(([label, data]) => ({ text: label, callback_data: data }))
              ),
            },
          }
        : {}),
    });

  function askWhen(chatId: number, s: Session) {
    const t = ui[s.lang].bot;
    s.step = 'when';
    return say(chatId, t.when, [
      [
        [t.whenMonth, 'when:month'],
        [t.whenQuarter, 'when:quarter'],
      ],
      [[t.whenOpen, 'when:open']],
    ]);
  }

  // The reply goes to the Telegram account that wrote, so nobody is asked for an address
  // unless that account has no public username.
  async function finish(chatId: number, s: Session, reply: string) {
    const t = ui[s.lang];
    if (!limiter.allow(String(chatId))) {
      await say(chatId, t.brief.errors.rate);
      return;
    }
    try {
      await cfg.deliver({ what: s.what, when: s.when, reply, lang: s.lang, via: 'telegram' });
      sessions.delete(chatId);
      await say(chatId, t.bot.done);
    } catch (error) {
      console.error(error);
      await say(chatId, t.brief.errors.fail);
    }
  }

  function afterWhen(chatId: number, s: Session, username: string | undefined) {
    if (username) return finish(chatId, s, `@${username} (Telegram)`);
    s.step = 'reply';
    return say(chatId, ui[s.lang].bot.replyNoHandle);
  }

  function start(chatId: number, lang: Lang) {
    sessions.set(chatId, { step: 'what', lang, what: '', when: '' });
    return say(chatId, ui[lang].bot.hello);
  }

  async function onMessage(msg: TgMessage) {
    const chatId = msg.chat.id;
    const text = (msg.text ?? '').trim();
    const command = text.split(/[\s@]/)[0];
    if (command === '/id') {
      await say(chatId, `chat id: ${chatId}`);
      return;
    }
    if (msg.chat.type !== 'private') return;
    if (command === '/start') {
      const arg = text.split(/\s+/)[1];
      await start(chatId, arg === 'uk' || arg === 'en' ? arg : langOf(msg.from?.language_code));
      return;
    }
    // People write the task straight away, without /start.
    let s = sessions.get(chatId);
    if (!s) {
      s = { step: 'what', lang: langOf(msg.from?.language_code), what: '', when: '' };
      sessions.set(chatId, s);
    }
    const t = ui[s.lang];
    if (!text) {
      await say(chatId, t.bot.textOnly);
    } else if (s.step === 'what') {
      if (text.length < 10 || text.length > 2000) {
        await say(chatId, t.brief.errors.what);
        return;
      }
      s.what = text;
      await askWhen(chatId, s);
    } else if (s.step === 'when') {
      s.when = text.slice(0, 120);
      await afterWhen(chatId, s, msg.from?.username);
    } else {
      if (text.length < 5 || text.length > 200 || !/[@.]/.test(text)) {
        await say(chatId, t.brief.errors.reply);
        return;
      }
      await finish(chatId, s, text);
    }
  }

  async function onButton(q: NonNullable<TgUpdate['callback_query']>) {
    await call('answerCallbackQuery', { callback_query_id: q.id });
    const chatId = q.message?.chat.id;
    if (chatId === undefined || q.message?.chat.type !== 'private') return;
    const s = sessions.get(chatId);
    const [kind, value] = (q.data ?? '').split(':');
    if (!s || kind !== 'when' || s.step !== 'when') {
      await start(chatId, s?.lang ?? langOf(q.from.language_code));
      return;
    }
    const t = ui[s.lang].bot;
    s.when = value === 'month' ? t.whenMonth : value === 'quarter' ? t.whenQuarter : t.whenOpen;
    await afterWhen(chatId, s, q.from.username);
  }

  async function handle(update: TgUpdate): Promise<void> {
    if (update.callback_query) await onButton(update.callback_query);
    else if (update.message) await onMessage(update.message);
  }

  async function poll(signal?: AbortSignal): Promise<void> {
    let offset = 0;
    while (!signal?.aborted) {
      try {
        const updates = await call<TgUpdate[]>('getUpdates', {
          offset,
          timeout: 25,
          allowed_updates: ['message', 'callback_query'],
        });
        for (const update of updates) {
          offset = update.update_id + 1;
          await handle(update).catch((error) => console.error(error));
        }
      } catch (error) {
        console.error(error);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }

  const username = async () => (await call<{ username: string }>('getMe', {})).username;

  return { handle, poll, username };
}
