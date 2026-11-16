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
  it('walks a client from /start to a delivered brief', async () => {
    const h = harness();
    await h.text('/start');
    expect(h.last().text).toContain(ui.en.bot.hello);
    expect(h.buttons()).toEqual(['who:studio', 'who:team']);

    await h.press('who:team');
    expect(h.last().text).toContain(ui.en.brief.what);

    await h.text('An assistant that answers from our help center.');
    expect(h.buttons()).toEqual(['when:month', 'when:quarter', 'when:open']);

    await h.press('when:quarter');
    expect(h.buttons()).toEqual(['reply:here']);

    await h.press('reply:here');
    expect(h.last().text).toContain('help center');
    expect(h.last().text).toContain('@anna');
    expect(h.buttons()).toEqual(['send:yes', 'send:redo']);
    expect(h.briefs).toHaveLength(0);

    await h.press('send:yes');
    expect(h.briefs).toEqual([
      {
        who: 'team',
        what: 'An assistant that answers from our help center.',
        when: ui.en.bot.whenQuarter,
        reply: '@anna (Telegram)',
        lang: 'en',
        via: 'telegram',
      },
    ]);
    expect(h.last().text).toBe(ui.en.brief.ok);
    expect(formatBrief(h.briefs[0]!)).toContain('via the Telegram bot');
  });

  it('accepts typed answers and speaks Ukrainian when the link asks for it', async () => {
    const h = harness();
    await h.text('/start uk');
    expect(h.last().text).toContain(ui.uk.bot.hello);
    await h.press('who:studio');
    await h.text('Бот, який приймає замовлення і передає їх у CRM.');
    await h.text('до кінця січня');
    await h.text('anna@studio.example');
    await h.press('send:yes');
    expect(h.briefs[0]).toMatchObject({
      who: 'studio',
      when: 'до кінця січня',
      reply: 'anna@studio.example',
      lang: 'uk',
    });
  });

  it('rejects a one-word task and a reply with no address, and keeps the step', async () => {
    const h = harness();
    await h.text('/start');
    await h.press('who:studio');
    await h.text('a bot');
    expect(h.last().text).toBe(ui.en.brief.errors.what);
    await h.text('A bot that takes orders and passes them to the CRM.');
    await h.press('when:open');
    await h.text('call me');
    expect(h.last().text).toBe(ui.en.brief.errors.reply);
    await h.text('anna@studio.example');
    expect(h.buttons()).toEqual(['send:yes', 'send:redo']);
  });

  it('asks for a typed contact when the account has no username', async () => {
    const h = harness();
    const nobody = h.from(undefined);
    await h.text('/start', nobody);
    await h.press('who:studio', nobody);
    await h.text('A bot that takes orders and passes them to the CRM.', nobody);
    await h.press('when:month', nobody);
    expect(h.last().text).toBe(ui.en.bot.replyNoHandle);
    expect(h.buttons()).toEqual([]);
  });

  it('tells the client when delivery failed and keeps the brief for a retry', async () => {
    const h = harness({ failDelivery: true });
    await h.text('/start');
    await h.press('who:studio');
    await h.text('A bot that takes orders and passes them to the CRM.');
    await h.press('when:month');
    await h.press('reply:here');
    await h.press('send:yes');
    expect(h.last().text).toBe(ui.en.brief.errors.fail);
    expect(h.buttons()).toEqual([]);
    await h.press('send:yes');
    expect(h.last().text).toBe(ui.en.brief.errors.fail);
  });

  it('answers a stale button and a stray message with the way in', async () => {
    const h = harness();
    await h.press('send:yes');
    expect(h.last().text).toBe(ui.en.bot.idle);
    await h.text('hello');
    expect(h.last().text).toBe(ui.en.bot.idle);
  });

  it('starts over on request', async () => {
    const h = harness();
    await h.text('/start');
    await h.press('who:team');
    await h.text('A bot that takes orders and passes them to the CRM.');
    await h.press('when:month');
    await h.press('reply:here');
    await h.press('send:redo');
    expect(h.buttons()).toEqual(['who:studio', 'who:team']);
    expect(h.briefs).toHaveLength(0);
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
      await h.text('/start');
      await h.press('who:studio');
      await h.text('A bot that takes orders and passes them to the CRM.');
      await h.press('when:month');
      await h.press('reply:here');
      await h.press('send:yes');
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
