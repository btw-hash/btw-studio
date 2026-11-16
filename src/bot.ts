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

type Step = 'who' | 'what' | 'when' | 'reply' | 'confirm';

interface Session {
  step: Step;
  lang: Lang;
  who: Brief['who'];
  what: string;
  when: string;
  reply: string;
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

  function askReply(chatId: number, s: Session, username: string | undefined) {
    const t = ui[s.lang].bot;
    s.step = 'reply';
    return username
      ? say(chatId, t.reply, [[[`${t.replyHere} @${username}`, 'reply:here']]])
      : say(chatId, t.replyNoHandle);
  }

  function confirm(chatId: number, s: Session) {
    const t = ui[s.lang];
    s.step = 'confirm';
    const summary = [
      t.bot.check,
      '',
      `${t.brief.who}: ${s.who === 'team' ? t.brief.team : t.brief.studio}`,
      `${t.brief.what}: ${s.what}`,
      `${t.brief.when}: ${s.when}`,
      `${t.brief.reply}: ${s.reply}`,
    ].join('\n');
    return say(chatId, summary, [
      [
        [t.bot.send, 'send:yes'],
        [t.bot.redo, 'send:redo'],
      ],
    ]);
  }

  function start(chatId: number, lang: Lang) {
    const t = ui[lang];
    sessions.set(chatId, { step: 'who', lang, who: 'studio', what: '', when: '', reply: '' });
    return say(chatId, `${t.bot.hello}\n\n${t.brief.who}?`, [
      [
        [t.brief.studio, 'who:studio'],
        [t.brief.team, 'who:team'],
      ],
    ]);
  }

  async function onText(msg: TgMessage) {
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
    const s = sessions.get(chatId);
    if (!s) {
      await say(chatId, ui[langOf(msg.from?.language_code)].bot.idle);
      return;
    }
    const t = ui[s.lang];
    if (s.step === 'what') {
      if (text.length < 10 || text.length > 2000) {
        await say(chatId, t.brief.errors.what);
        return;
      }
      s.what = text;
      await askWhen(chatId, s);
    } else if (s.step === 'when') {
      s.when = text.slice(0, 120);
      await askReply(chatId, s, msg.from?.username);
    } else if (s.step === 'reply') {
      if (text.length < 5 || text.length > 200 || !/[@.]/.test(text)) {
        await say(chatId, t.brief.errors.reply);
        return;
      }
      s.reply = text;
      await confirm(chatId, s);
    } else {
      await say(chatId, t.bot.useButtons);
    }
  }

  async function onButton(q: NonNullable<TgUpdate['callback_query']>) {
    await call('answerCallbackQuery', { callback_query_id: q.id });
    const chatId = q.message?.chat.id;
    if (chatId === undefined || q.message?.chat.type !== 'private') return;
    const s = sessions.get(chatId);
    const [kind, value] = (q.data ?? '').split(':');
    if (!s || s.step !== (kind === 'send' ? 'confirm' : kind)) {
      await say(chatId, ui[s?.lang ?? langOf(q.from.language_code)].bot.idle);
      return;
    }
    const t = ui[s.lang];
    if (kind === 'who') {
      s.who = value === 'team' ? 'team' : 'studio';
      s.step = 'what';
      await say(chatId, `${t.brief.what}?\n\n${t.bot.whatHint}`);
    } else if (kind === 'when') {
      s.when =
        value === 'month'
          ? t.bot.whenMonth
          : value === 'quarter'
            ? t.bot.whenQuarter
            : t.bot.whenOpen;
      await askReply(chatId, s, q.from.username);
    } else if (kind === 'reply' && q.from.username) {
      s.reply = `@${q.from.username} (Telegram)`;
      await confirm(chatId, s);
    } else if (kind === 'send' && value === 'redo') {
      await start(chatId, s.lang);
    } else if (kind === 'send') {
      if (!limiter.allow(String(chatId))) {
        await say(chatId, t.brief.errors.rate);
        return;
      }
      try {
        await cfg.deliver({
          who: s.who,
          what: s.what,
          when: s.when,
          reply: s.reply,
          lang: s.lang,
          via: 'telegram',
        });
        sessions.delete(chatId);
        await say(chatId, t.brief.ok);
      } catch (error) {
        console.error(error);
        await say(chatId, t.brief.errors.fail);
      }
    }
  }

  async function handle(update: TgUpdate): Promise<void> {
    if (update.callback_query) await onButton(update.callback_query);
    else if (update.message?.text) await onText(update.message);
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
