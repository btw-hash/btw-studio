import type { AddressInfo } from 'node:net';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from './app.js';
import { formatBrief, parseBrief, RateLimiter } from './brief.js';
import { projects, ui } from './content.js';
import { renderHome } from './render.js';

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

  it('leads to the brief from the first screen and keeps the accent for that button', async () => {
    for (const lang of ['en', 'uk'] as const) {
      const html = await (await fetch(`${base}${lang === 'uk' ? '/uk' : '/'}`)).text();
      expect(html).toContain(`<a class="btn acc" href="#brief">${ui[lang].cta.label}</a>`);
      expect(html).toContain(ui[lang].workNote);
      expect(html).toContain(`<b>${ui[lang].task.citewise}</b>`);
      expect(html).not.toContain('downTg');
    }
  });

  it('shows the promises, the questions and a privacy page linked from the form', async () => {
    for (const lang of ['en', 'uk'] as const) {
      const base2 = `${base}${lang === 'uk' ? '/uk' : ''}`;
      const html = await (await fetch(`${base2}/`)).text();
      expect(html).toContain(ui[lang].promises.title);
      expect(html.match(/<details>/g)).toHaveLength(ui[lang].faq.items.length);
      expect(html).toContain(`<a href="${lang === 'uk' ? '/uk' : ''}/privacy">`);
      const res = await fetch(`${base2}/privacy`);
      expect(res.status).toBe(200);
      expect(await res.text()).toContain(ui[lang].privacy.items[4][0]);
    }
    expect(await (await fetch(`${base}/sitemap.xml`)).text()).toContain('/uk/privacy');
  });

  it('points a failed form at Telegram only when the bot link is on the page', () => {
    expect(renderHome('en')).toContain(ui.en.brief.errors.down);
    expect(renderHome('en', 'some_bot')).toContain(ui.en.brief.errors.downTg);
    expect(renderHome('en', 'some_bot')).not.toContain(ui.en.brief.errors.down);
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

  it('lists every page in the sitemap and names it in robots.txt', async () => {
    const map = await (await fetch(`${base}/sitemap.xml`)).text();
    expect(map.match(/<loc>/g)?.length).toBe((projects.length + 2) * 2);
    expect(await (await fetch(`${base}/robots.txt`)).text()).toContain('/sitemap.xml');
  });

  it('sends a visitor who came over http to https', async () => {
    const res = await fetch(`${base}/work/nox?a=1`, {
      redirect: 'manual',
      headers: { 'cf-visitor': '{"scheme":"http"}' },
    });
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toBe('https://127.0.0.1/work/nox?a=1');
    expect(
      (await fetch(`${base}/`, { headers: { 'cf-visitor': '{"scheme":"https"}' } })).status
    ).toBe(200);
  });

  it('gives each project page its own preview image and the site an icon', async () => {
    const html = await (await fetch(`${base}/work/citewise`)).text();
    expect(html).toContain('og:image" content="https://btwstudio.dev/media/citewise.webp"');
    expect((await fetch(`${base}/favicon.svg`)).status).toBe(200);
    expect((await fetch(`${base}/apple-touch-icon.png`)).status).toBe(200);
  });

  it('puts only projects with media on the stage', () => {
    for (const p of projects.filter((x) => x.onStage)) {
      expect(p.poster, p.slug).toBeTruthy();
      expect(p.text.en.stage.length, p.slug).toBeGreaterThan(20);
    }
  });

  it('shows every clip of a project with its caption, in both languages', async () => {
    const nox = projects.find((x) => x.slug === 'nox')!;
    expect(nox.clips?.length).toBe(10);
    for (const [path, lang] of [
      ['/work/nox', 'en'],
      ['/uk/work/nox', 'uk'],
    ] as const) {
      const html = await (await fetch(`${base}${path}`)).text();
      expect(html).toContain(`/media/${nox.tour!.file}.mp4`);
      expect(html).toContain(nox.tour!.label[lang]);
      expect((await fetch(`${base}/media/${nox.tour!.file}.mp4`, { method: 'HEAD' })).status).toBe(
        200
      );
      for (const c of nox.clips!) {
        expect(html).toContain(`/media/${c.file}.mp4`);
        expect(html).toContain(c.label[lang]);
        expect((await fetch(`${base}/media/${c.file}.mp4`, { method: 'HEAD' })).status).toBe(200);
      }
    }
  });

  it('renders every project as a layered case study, plain words before architecture', async () => {
    for (const p of projects) {
      for (const lang of ['en', 'uk'] as const) {
        const study = p.text[lang].study;
        expect(study, `${p.slug} ${lang}`).toBeTruthy();
        const path = `${lang === 'uk' ? '/uk' : ''}/work/${p.slug}`;
        const html = await (await fetch(`${base}${path}`)).text();
        expect(html).toContain(ui[lang].project.plain);
        expect(html).toContain(ui[lang].project.hood);
        const alts = study!.flow.filter((n) => n.or).length;
        expect(html.match(/class="node/g)?.length, path).toBe(study!.flow.length + alts);
        expect(html.indexOf('class="plain')).toBeLessThan(html.indexOf('class="hood'));
      }
    }
  });

  it('escapes content when rendering', async () => {
    const html = await (await fetch(`${base}/work/citewise`)).text();
    expect(html).toContain('&quot;lose my laptop&quot;');
  });
});

describe('brief validation', () => {
  it('accepts a complete brief', () => {
    expect(parseBrief(good)).toMatchObject({ brief: { when: 'January', lang: 'en' } });
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
    const parsed = parseBrief(good);
    if (!('brief' in parsed)) throw new Error('expected a brief');
    expect(formatBrief(parsed.brief)).toContain('By when: January');
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

  it('still delivers when the copy of the brief cannot be written', async () => {
    const before = sent.length;
    const broken = start({
      tgToken: 'TEST',
      tgChatId: '42',
      fetchImpl,
      logDir: join(root, 'package.json', 'nope'),
    });
    const res = await post(broken.base, good);
    broken.server.close();
    expect(res.status).toBe(200);
    expect(sent).toHaveLength(before + 1);
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

describe('hardening', () => {
  it('sends a policy that allows only its own files and the one inline script', async () => {
    const { server, base } = start({});
    const res = await fetch(`${base}/`);
    const html = await res.text();
    const font = await fetch(`${base}/fonts/inter-tight-latin.woff2`, { method: 'HEAD' });
    server.close();
    const csp = res.headers.get('content-security-policy') ?? '';
    expect(csp).toContain("default-src 'self'");
    expect(csp).toMatch(/script-src 'self' 'sha256-[A-Za-z0-9+/=]+'/);
    expect(html.match(/<script>/g)).toHaveLength(1);
    expect(html).not.toContain('fonts.googleapis.com');
    expect(html).not.toMatch(/ on[a-z]+="/);
    expect(font.status).toBe(200);
    expect(font.headers.get('cache-control')).toContain('immutable');
  });

  it('gives every project page a picture or a recording', () => {
    for (const p of projects) expect(p.poster, p.slug).toBeTruthy();
  });
});

describe('www', () => {
  it('sends the www host to the bare domain', async () => {
    const { server, base } = start({});
    const res = await fetch(`${base}/work/nox?x=1`, {
      redirect: 'manual',
      headers: { 'x-forwarded-host': 'www.btwstudio.dev' },
    });
    server.close();
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toBe('https://btwstudio.dev/work/nox?x=1');
  });
});
