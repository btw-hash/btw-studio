import type { AddressInfo } from 'node:net';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from './app.js';
import { formatBrief, parseBrief, RateLimiter } from './brief.js';
import { projects, ui } from './content.js';

const root = join(import.meta.dirname, '..');

function start(delivery: Parameters<typeof createApp>[1]) {
  const server = createApp(root, delivery).listen(0);
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  return { server, base };
}

const post = (base: string, body: unknown) =>
  fetch(`${base}/api/brief`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

const good = {
  who: 'studio',
  what: 'An assistant that answers from our help center.',
  when: 'January',
  reply: 'anna@studio.example',
};

describe('pages', () => {
  const { server, base } = start({});
  afterAll(() => server.close());

  it('serves the home page in both languages with the other language linked', async () => {
    const en = await (await fetch(`${base}/`)).text();
    const uk = await (await fetch(`${base}/uk`)).text();
    expect(en).toContain(ui.en.hero[0]);
    expect(en).toContain('hreflang="uk"');
    expect(uk).toContain(ui.uk.hero[0]);
    expect(uk).toContain('<html lang="uk">');
  });

  it('serves every project page in both languages', async () => {
    for (const p of projects) {
      for (const lang of ['en', 'uk'] as const) {
        const res = await fetch(`${base}${lang === 'uk' ? '/uk' : ''}/work/${p.slug}`);
        expect(res.status, `${lang} ${p.slug}`).toBe(200);
        const html = await res.text();
        expect(html).toContain(p.text[lang].built.slice(0, 40).replace(/'/g, '&#39;'));
      }
    }
  });

  it('answers an unknown project and an unknown path with 404', async () => {
    expect((await fetch(`${base}/work/nope`)).status).toBe(404);
    const res = await fetch(`${base}/uk/whatever`);
    expect(res.status).toBe(404);
    expect(await res.text()).toContain(ui.uk.notFound.title);
  });

  it('puts only projects with media on the stage', () => {
    for (const p of projects.filter((x) => x.onStage)) {
      expect(p.poster, p.slug).toBeTruthy();
      expect(p.text.en.stage.length, p.slug).toBeGreaterThan(20);
    }
  });

  it('shows every clip of a project with its caption, in both languages', async () => {
    const nox = projects.find((x) => x.slug === 'nox')!;
    expect(nox.clips?.length).toBe(5);
    for (const [path, lang] of [
      ['/work/nox', 'en'],
      ['/uk/work/nox', 'uk'],
    ] as const) {
      const html = await (await fetch(`${base}${path}`)).text();
      for (const c of nox.clips!) {
        expect(html).toContain(`/media/${c.file}.mp4`);
        expect(html).toContain(c.label[lang]);
        expect((await fetch(`${base}/media/${c.file}.mp4`, { method: 'HEAD' })).status).toBe(200);
      }
    }
  });

  it('renders a case study in layers when a project has one, and the plain page when not', async () => {
    const citewise = projects.find((x) => x.slug === 'citewise')!;
    for (const [path, lang] of [
      ['/work/citewise', 'en'],
      ['/uk/work/citewise', 'uk'],
    ] as const) {
      const study = citewise.text[lang].study!;
      const html = await (await fetch(`${base}${path}`)).text();
      expect(html).toContain(ui[lang].project.plain);
      expect(html).toContain(ui[lang].project.hood);
      for (const n of study.flow) expect(html).toContain(`<b>${n.label}</b>`);
      expect(html.match(/class="node/g)?.length).toBe(study.flow.length + 1);
      expect(html.indexOf('class="plain')).toBeLessThan(html.indexOf('class="hood'));
    }
    const plain = await (await fetch(`${base}/work/benchmark-cc`)).text();
    expect(plain).not.toContain('class="hood');
    expect(plain).toContain(ui.en.project.problem);
  });

  it('escapes content when rendering', async () => {
    const html = await (await fetch(`${base}/work/citewise`)).text();
    expect(html).toContain('&quot;lose my laptop&quot;');
  });
});

describe('brief validation', () => {
  it('accepts a complete brief', () => {
    expect(parseBrief(good)).toMatchObject({ brief: { who: 'studio', lang: 'en' } });
  });
  it('rejects a brief without a real description', () => {
    expect(parseBrief({ ...good, what: 'hi' })).toEqual({ error: 'what' });
  });
  it('rejects a brief with no way to reply', () => {
    expect(parseBrief({ ...good, reply: 'anna' })).toEqual({ error: 'reply' });
  });
  it('treats a filled honeypot as spam', () => {
    expect(parseBrief({ ...good, website: 'http://spam.example' })).toEqual({ spam: true });
  });
  it('formats the message for the studio', () => {
    const parsed = parseBrief({ ...good, who: 'team' });
    if (!('brief' in parsed)) throw new Error('expected a brief');
    expect(formatBrief(parsed.brief)).toContain('product team');
    expect(formatBrief(parsed.brief)).toContain('Reply to: anna@studio.example');
  });
  it('limits repeated submissions', () => {
    const limiter = new RateLimiter(2, 1000);
    expect([limiter.allow('a', 0), limiter.allow('a', 1), limiter.allow('a', 2)]).toEqual([
      true,
      true,
      false,
    ]);
    expect(limiter.allow('a', 2000)).toBe(true);
  });
});

describe('brief delivery', () => {
  const sent: { url: string; body: { chat_id: string; text: string } }[] = [];
  let status = 200;
  const fetchImpl = (async (url: string, init: { body: string }) => {
    sent.push({ url, body: JSON.parse(init.body) });
    return new Response('{}', { status });
  }) as unknown as typeof fetch;

  let on: ReturnType<typeof start>;
  let off: ReturnType<typeof start>;
  beforeAll(() => {
    on = start({ tgToken: 'TEST', tgChatId: '42', fetchImpl });
    off = start({});
  });
  afterAll(() => {
    on.server.close();
    off.server.close();
  });

  it('sends a valid brief to the configured chat', async () => {
    const res = await post(on.base, good);
    expect(res.status).toBe(200);
    expect(sent).toHaveLength(1);
    expect(sent[0]?.url).toContain('/botTEST/sendMessage');
    expect(sent[0]?.body.chat_id).toBe('42');
    expect(sent[0]?.body.text).toContain('help center');
  });

  it('returns 422 for an invalid brief and sends nothing', async () => {
    const before = sent.length;
    const res = await post(on.base, { ...good, reply: '' });
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({ error: 'reply' });
    expect(sent).toHaveLength(before);
  });

  it('accepts a honeypot submission silently and sends nothing', async () => {
    const before = sent.length;
    const res = await post(on.base, { ...good, website: 'x' });
    expect(res.status).toBe(200);
    expect(sent).toHaveLength(before);
  });

  it('reports a delivery failure instead of pretending', async () => {
    status = 500;
    const res = await post(on.base, good);
    status = 200;
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: 'fail' });
  });

  it('says the form is down when delivery is not configured', async () => {
    const res = await post(off.base, good);
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: 'down' });
    expect(await (await fetch(`${off.base}/api/health`)).json()).toEqual({
      ok: true,
      briefs: false,
    });
  });
});

describe('preview mode', () => {
  it('asks search engines to stay away when the flag is set', async () => {
    const server = createApp(root, {}, { noindex: true }).listen(0);
    const res = await fetch(`http://127.0.0.1:${(server.address() as AddressInfo).port}/`);
    server.close();
    expect(res.headers.get('x-robots-tag')).toBe('noindex, nofollow');
  });
});
