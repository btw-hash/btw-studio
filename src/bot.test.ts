import type { AddressInfo } from 'node:net';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createApp } from './app.js';
import { createBot, type TgUpdate } from './bot.js';
import { formatBrief, type Brief } from './brief.js';
import { ui } from './content.js';

interface Call {
  method: string;
  body: {
    chat_id?: number;
    text?: string;
    reply_markup?: { inline_keyboard: { text: string; callback_data: string }[][] };
  };
}

function harness(options: { failDelivery?: boolean } = {}) {
  const calls: Call[] = [];
  const briefs: Brief[] = [];
  const fetchImpl = (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({
      method: String(url).split('/').pop()!,
      body: JSON.parse(String(init?.body)),
    });
    return new Response(JSON.stringify({ ok: true, result: { username: 'btw_brief_bot' } }));
  }) as typeof fetch;
  const bot = createBot({
    token: 'TEST',
    fetchImpl,
    deliver: async (brief) => {
      if (options.failDelivery) throw new Error('down');
      briefs.push(brief);
    },
  });
  let id = 0;
  const from = (username?: string, language_code = 'en') => ({ id: 7, username, language_code });
  const text = (value: string, user = from('anna'), chat = { id: 7, type: 'private' }) =>
    bot.handle({ update_id: ++id, message: { chat, from: user, text: value } });
  const press = (data: string, user = from('anna')) =>
    bot.handle({
      update_id: ++id,
      callback_query: {
        id: 'q',
        from: user,
        data,
        message: { chat: { id: 7, type: 'private' } },
      },
    } satisfies TgUpdate);
  const said = () => calls.filter((c) => c.method === 'sendMessage');
  const last = () => said().at(-1)!.body;
  const buttons = () =>
    (last().reply_markup?.inline_keyboard ?? []).flat().map((b) => b.callback_data);
  return { bot, briefs, text, press, said, last, buttons, from };
}

describe('brief bot', () => {
  const task = 'An assistant that answers from our help center.';

  it('takes one message and one question, then delivers', async () => {
    const h = harness();
    await h.text('/start');
    expect(h.last().text).toBe(ui.en.bot.hello);
    expect(h.buttons()).toEqual([]);

    await h.text(task);
    expect(h.last().text).toBe(ui.en.bot.when);
    expect(h.buttons()).toEqual(['when:month', 'when:quarter', 'when:open']);
    expect(h.briefs).toHaveLength(0);

    await h.press('when:quarter');
    expect(h.briefs).toEqual([
      {
        what: task,
        when: ui.en.bot.whenQuarter,
        reply: '@anna (Telegram)',
        lang: 'en',
        via: 'telegram',
      },
    ]);
    expect(h.last().text).toBe(ui.en.bot.done);
    expect(formatBrief(h.briefs[0]!)).toContain('via the Telegram bot');
  });

  it('accepts the task without /start', async () => {
    const h = harness();
    await h.text(task);
    expect(h.last().text).toBe(ui.en.bot.when);
    await h.text('end of January');
    expect(h.briefs[0]).toMatchObject({ what: task, when: 'end of January' });
  });

  it('speaks Ukrainian when the link asks for it', async () => {
    const h = harness();
    await h.text('/start uk');
    expect(h.last().text).toBe(ui.uk.bot.hello);
    await h.text('Бот, який приймає замовлення і передає їх у CRM.');
    await h.text('до кінця січня');
    expect(h.briefs[0]).toMatchObject({ when: 'до кінця січня', lang: 'uk' });
    expect(h.last().text).toBe(ui.uk.bot.done);
  });

  it('rejects a one-word task and keeps the step', async () => {
    const h = harness();
    await h.text('/start');
    await h.text('a bot');
    expect(h.last().text).toBe(ui.en.brief.errors.what);
    await h.text(task);
    expect(h.last().text).toBe(ui.en.bot.when);
  });

  it('asks for a contact only when the account has no username', async () => {
    const h = harness();
    const nobody = h.from(undefined);
    await h.text(task, nobody);
    await h.press('when:month', nobody);
    expect(h.last().text).toBe(ui.en.bot.replyNoHandle);
    expect(h.briefs).toHaveLength(0);
    await h.text('call me', nobody);
    expect(h.last().text).toBe(ui.en.brief.errors.reply);
    await h.text('anna@studio.example', nobody);
    expect(h.briefs[0]).toMatchObject({ reply: 'anna@studio.example' });
  });

  it('tells the client when delivery failed and keeps the brief for a retry', async () => {
    const h = harness({ failDelivery: true });
    await h.text(task);
    await h.press('when:month');
    expect(h.last().text).toBe(ui.en.brief.errors.fail);
    await h.press('when:month');
    expect(h.last().text).toBe(ui.en.brief.errors.fail);
  });

  it('answers a stale button with the way in', async () => {
    const h = harness();
    await h.press('send:yes');
    expect(h.last().text).toBe(ui.en.bot.hello);
  });

  it('asks for text when a file arrives', async () => {
    const h = harness();
    await h.bot.handle({
      update_id: 900,
      message: { chat: { id: 7, type: 'private' }, from: h.from('anna') },
    });
    expect(h.last().text).toBe(ui.en.bot.textOnly);
  });

  it('reports the chat id anywhere and stays silent in groups otherwise', async () => {
    const h = harness();
    const group = { id: -100123, type: 'supergroup' };
    await h.text('/id@btw_brief_bot', h.from('owner'), group);
    expect(h.last()).toMatchObject({ chat_id: -100123, text: 'chat id: -100123' });
    const before = h.said().length;
    await h.text('/start', h.from('owner'), group);
    await h.text('hello', h.from('owner'), group);
    expect(h.said()).toHaveLength(before);
  });

  it('stops after three briefs an hour from one chat', async () => {
    const h = harness();
    for (let i = 0; i < 4; i += 1) {
      await h.text(task);
      await h.press('when:month');
    }
    expect(h.briefs).toHaveLength(3);
    expect(h.last().text).toBe(ui.en.brief.errors.rate);
  });
});

describe('bot link on the site', () => {
  const root = join(import.meta.dirname, '..');
  const home = async (site: { botUsername?: string }, path: string) => {
    const server = createApp(root, {}, { site }).listen(0);
    const html = await (
      await fetch(`http://127.0.0.1:${(server.address() as AddressInfo).port}${path}`)
    ).text();
    server.close();
    return html;
  };

  it('offers the bot under the form once its name is known, in the page language', async () => {
    const site = { botUsername: 'btw_brief_bot' };
    expect(await home(site, '/')).toContain('href="https://t.me/btw_brief_bot?start=en"');
    expect(await home(site, '/uk')).toContain('href="https://t.me/btw_brief_bot?start=uk"');
  });

  it('shows no Telegram link while the bot is not connected', async () => {
    expect(await home({}, '/')).not.toContain('t.me/');
  });
});
