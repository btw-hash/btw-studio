import { projects, ui, type Lang, type Project } from './content.js';

const ORIGIN = 'https://btwstudio.dev';
// Changes on every deploy, so a cached stylesheet never meets newer markup.
const V = Date.now().toString(36);
// The only inline script; its hash is allowed in the Content-Security-Policy.
export const INLINE_JS = "document.documentElement.className='js'";

export function esc(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c
  );
}

const prefix = (lang: Lang) => (lang === 'uk' ? '/uk' : '');
const other = (lang: Lang): Lang => (lang === 'uk' ? 'en' : 'uk');
const home = (lang: Lang) => prefix(lang) || '/';
const workPath = (lang: Lang, slug: string) => `${prefix(lang)}/work/${slug}`;

function layout(
  lang: Lang,
  opts: {
    title: string;
    desc: string;
    path: (l: Lang) => string;
    body: string;
    image?: string;
    head?: string;
  }
): string {
  const t = ui[lang];
  const image = `${ORIGIN}/media/${opts.image ?? 'crm-pro.webp'}`;
  return `<!doctype html>
<html lang="${t.htmlLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(opts.title)}</title>
<meta name="description" content="${esc(opts.desc)}">
<link rel="canonical" href="${ORIGIN}${opts.path(lang)}">
<link rel="alternate" hreflang="en" href="${ORIGIN}${opts.path('en')}">
<link rel="alternate" hreflang="uk" href="${ORIGIN}${opts.path('uk')}">
<link rel="alternate" hreflang="x-default" href="${ORIGIN}${opts.path('en')}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:title" content="${esc(opts.title)}">
<meta property="og:description" content="${esc(opts.desc)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${ORIGIN}${opts.path(lang)}">
<meta property="og:site_name" content="BTW Studio">
<meta property="og:image" content="${image}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${image}">
<link rel="preload" as="font" type="font/woff2" href="/fonts/bricolage-grotesque-latin.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/fonts/inter-tight-latin.woff2" crossorigin>
<link rel="stylesheet" href="/styles.css?v=${V}">
<script>${INLINE_JS}</script>${opts.head ?? ''}
</head>
<body>
<div class="progress" aria-hidden="true"></div>
<header class="in bar">
  <a class="mark" href="${home(lang)}">BTW Studio</a>
  <nav aria-label="Main">
    <a href="${home(lang)}#work">${esc(t.nav.work)}</a>
    <a href="${home(lang)}#method">${esc(t.nav.method)}</a>
    <a href="${opts.path(other(lang))}" hreflang="${other(lang)}" lang="${other(lang)}">${esc(t.langName)}</a>
    <a class="btn" href="${home(lang)}#brief">${esc(t.nav.brief)}</a>
  </nav>
</header>
<main>
${opts.body}
</main>
<footer class="in foot">
  <span>© 2026 ${esc(t.footer.rights)}</span>
  <a href="https://github.com/btw-hash">${esc(t.footer.github)}</a>
</footer>
<script src="/app.js?v=${V}" defer></script>
</body>
</html>`;
}

function media(p: Project, lang: Lang, id = ''): string {
  const alt = esc(p.text[lang].line);
  const idAttr = id ? ` id="${id}"` : '';
  if (p.video) {
    return `<video${idAttr} class="shot" src="/media/${p.slug}.mp4?v=${V}" poster="/media/${p.poster}?v=${V}" muted loop playsinline autoplay preload="metadata" aria-label="${alt}"></video>`;
  }
  return `<img${idAttr} class="shot" src="/media/${p.poster}?v=${V}" alt="${alt}" width="1600" height="1000">`;
}

function primaryLink(p: Project, lang: Lang): { href: string; label: string } {
  const t = ui[lang];
  return p.demo ? { href: p.demo, label: t.open } : { href: p.repo ?? '#', label: t.code };
}

export function renderHome(lang: Lang, botUsername?: string): string {
  const t = ui[lang];
  const stage = projects.filter((p) => p.onStage);
  const first = stage[0]!;
  const stageData = stage.map((p) => ({
    slug: p.slug,
    video: p.video ? `/media/${p.slug}.mp4?v=${V}` : '',
    poster: `/media/${p.poster}?v=${V}`,
    text: p.text[lang].stage,
    href: primaryLink(p, lang).href,
    label: primaryLink(p, lang).label,
    more: workPath(lang, p.slug),
  }));
  const link = primaryLink(first, lang);

  const body = `<div class="in">
  <h1 class="h rise">${esc(t.hero[0])} <span>${esc(t.hero[1])}</span></h1>
  <p class="sub rise" style="--i:1">${esc(t.sub)}</p>
  <section class="stage rise" style="--i:2" id="work" data-stage='${esc(JSON.stringify(stageData))}'>
    <div class="screen" id="screen">${media(first, lang)}</div>
    <div class="chan" role="group" aria-label="${esc(t.stageGroup)}">
      ${stage
        .map(
          (p, i) =>
            `<button type="button" data-i="${i}" aria-pressed="${i === 0}"><b>${esc(p.text[lang].name)}</b><span>${esc(t.kind[p.kind])}</span></button>`
        )
        .join('\n      ')}
    </div>
    <div class="now">
      <div class="says" id="stage-text">
        ${stage.map((p, i) => `<p${i === 0 ? ' class="on"' : ' aria-hidden="true"'}>${esc(p.text[lang].stage)}</p>`).join('\n        ')}
      </div>
      <span class="links">
        <a class="pill ghost" id="stage-more" href="${workPath(lang, first.slug)}">${esc(t.how)}</a>
        <a class="pill says" id="stage-link" href="${link.href}">${[t.open, t.code].map((l) => `<span${l === link.label ? ' class="on"' : ' aria-hidden="true"'} data-label="${esc(l)}">${esc(l)} ↗</span>`).join('')}</a>
      </span>
    </div>
  </section>

  <section class="doors">
    <div class="d rv"><h2>${esc(t.doors.agency.title)}</h2><ul>${t.doors.agency.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
    <div class="d thin rv" style="--i:1"><h2>${esc(t.doors.other.title)}</h2><p>${esc(t.doors.other.text)}</p></div>
  </section>

  <section id="method">
    <h2 class="lab">${esc(t.methodTitle)}</h2>
    <div class="how">
      ${t.method.map(([h, p], i) => `<div class="rv" style="--i:${i}"><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('\n      ')}
    </div>
  </section>

  <section>
    <h2 class="lab">${esc(t.allWork)}</h2>
    <div class="list">
      ${projects
        .map(
          (p, i) => `<a class="item rv" style="--i:${i % 3}" href="${workPath(lang, p.slug)}">
        <span class="tag">${esc(t.kind[p.kind])}</span>
        <b>${esc(p.text[lang].title.join(' '))}</b>
        <span>${esc(p.text[lang].line)}</span>
        <i>${esc(p.text[lang].name)} · ${esc(t.more)} →</i>
      </a>`
        )
        .join('\n      ')}
    </div>
  </section>

  <section class="brief rv" id="brief">
    <div><h2>${esc(t.brief.title)}</h2><p class="promise">${esc(t.brief.promise)}</p></div>
    <form id="brief-form" novalidate data-lang="${lang}" data-msg='${esc(JSON.stringify({ sending: t.brief.sending, ok: t.brief.ok, ...t.brief.errors }))}'>
      <label for="f-what">${esc(t.brief.what)}</label>
      <textarea id="f-what" name="what" rows="5" maxlength="2000" required placeholder="${esc(t.brief.whatPh)}"></textarea>
      <label for="f-reply">${esc(t.brief.reply)}</label>
      <input id="f-reply" name="reply" type="text" maxlength="200" required autocomplete="email" placeholder="${esc(t.brief.replyPh)}">
      <div class="hp" aria-hidden="true"><label for="f-website">Website</label><input id="f-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
      <button type="submit" class="btn acc">${esc(t.brief.send)}</button>
      <p class="status" id="brief-status" role="status" aria-live="polite"></p>${
        botUsername
          ? `
      <p class="alt"><a href="https://t.me/${esc(botUsername)}?start=${lang}" rel="noopener">${esc(t.brief.tg)} →</a></p>`
          : ''
      }
    </form>
  </section>
</div>`;

  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BTW Studio',
    url: ORIGIN,
    logo: `${ORIGIN}/apple-touch-icon.png`,
    sameAs: ['https://github.com/btw-hash'],
  };
  return layout(lang, {
    title: t.siteTitle,
    desc: t.siteDesc,
    path: home,
    body,
    head: `\n<script type="application/ld+json">${JSON.stringify(org)}</script>`,
  });
}

export function renderProject(lang: Lang, p: Project): string {
  const t = ui[lang];
  const x = p.text[lang];
  const study = x.study;
  const index = projects.indexOf(p);
  const next = projects[(index + 1) % projects.length]!;
  const buttons = [
    p.demo ? `<a class="btn acc" href="${p.demo}">${esc(t.open)} ↗</a>` : '',
    p.repo ? `<a class="btn" href="${p.repo}">${esc(t.code)}</a>` : '',
  ].join('');

  const body = `<div class="in">
  <a class="crumb" href="${home(lang)}#work">← ${esc(t.project.back)}</a>
  <div class="ptop">
    <div><h1 class="h">${esc(x.title[0])} <span>${esc(x.title[1])}</span></h1><p class="sub">${esc(x.line)}</p></div>
    <span class="links">${buttons}</span>
  </div>
  ${p.poster ? `<div class="stage solo"><div class="screen">${media(p, lang)}</div></div>` : ''}
  ${
    p.clips
      ? `<div class="clips">${p.clips
          .map(
            (c) =>
              `<figure class="rv"><video src="/media/${c.file}.mp4?v=${V}" poster="/media/${c.file}.webp?v=${V}" muted loop playsinline preload="none" data-lazy aria-label="${esc(c.label[lang])}"></video><figcaption>${esc(c.label[lang])}</figcaption></figure>`
          )
          .join('')}</div>`
      : ''
  }
  ${
    p.tour
      ? `<figure class="tour rv"><video src="/media/${p.tour.file}.mp4?v=${V}" poster="/media/${p.tour.file}.webp?v=${V}" controls playsinline preload="none" aria-label="${esc(p.tour.label[lang])}"></video><figcaption>${esc(p.tour.label[lang])}</figcaption></figure>`
      : ''
  }
  ${
    study
      ? `<section class="plain rv">
    <h2 class="lab">${esc(t.project.plain)}</h2>
    <p class="lead">${esc(study.plain)}</p>
  </section>
  <section>
    <h2 class="lab">${esc(t.project.steps)}</h2>
    <ol class="steps">
      ${study.steps.map(([h, d], i) => `<li class="rv" style="--i:${i}"><h3>${esc(h)}</h3><p>${esc(d)}</p></li>`).join('\n      ')}
    </ol>
  </section>`
      : ''
  }
  <div class="pcols rv">
    <div>
      <h2>${esc(t.project.problem)}</h2>
      <p>${esc(x.problem)}</p>
      <h2>${esc(t.project.built)}</h2>
      <p>${esc(x.built)}</p>
      <h2>${esc(t.project.proof)}</h2>
      <table class="proof">
        ${x.proof.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('\n        ')}
      </table>
      ${x.proofNote ? `<p class="pnote">${esc(x.proofNote)}</p>` : ''}
    </div>
    <dl class="side">
      ${x.facts.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('\n      ')}
    </dl>
  </div>
  ${
    study
      ? `<section class="hood rv">
    <h2>${esc(t.project.hood)}</h2>
    <ol class="flow" style="--n:${study.flow.length}">
      ${study.flow
        .map(
          (n, i) =>
            `<li style="--i:${i}"><div class="node"><b>${esc(n.label)}</b><span>${esc(n.note)}</span></div>${n.or ? `<em>${esc(t.project.or)}</em><div class="node alt"><b>${esc(n.or.label)}</b><span>${esc(n.or.note)}</span></div>` : ''}</li>`
        )
        .join('\n      ')}
    </ol>
    ${study.flowNote ? `<p class="fnote">${esc(study.flowNote)}</p>` : ''}
    <h3 class="lab">${esc(t.project.decisions)}</h3>
    <div class="dec">
      ${study.decisions.map(([h, d], i) => `<div class="rv" style="--i:${i % 2}"><h4>${esc(h)}</h4><p>${esc(d)}</p></div>`).join('\n      ')}
    </div>
  </section>`
      : ''
  }
  <div class="next">
    <a href="${workPath(lang, next.slug)}"><b>${esc(t.project.next)}:</b> ${esc(next.text[lang].title.join(' '))} →</a>
    <a class="btn acc" href="${home(lang)}#brief">${esc(t.project.cta)}</a>
  </div>
</div>`;

  return layout(lang, {
    title: `${x.title.join(' ')} — BTW Studio`,
    desc: x.line,
    path: (l) => workPath(l, p.slug),
    body,
    image: p.poster,
  });
}

export function renderSitemap(): string {
  const entry = (path: (l: Lang) => string) =>
    (['en', 'uk'] as const)
      .map(
        (l) =>
          `<url><loc>${ORIGIN}${path(l)}</loc><xhtml:link rel="alternate" hreflang="en" href="${ORIGIN}${path('en')}"/><xhtml:link rel="alternate" hreflang="uk" href="${ORIGIN}${path('uk')}"/></url>`
      )
      .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[entry(home), ...projects.map((p) => entry((l) => workPath(l, p.slug)))].join('\n')}
</urlset>`;
}

export function renderNotFound(lang: Lang): string {
  const t = ui[lang];
  return layout(lang, {
    title: `404 — BTW Studio`,
    desc: t.siteDesc,
    path: home,
    body: `<div class="in nf"><h1 class="h">${esc(t.notFound.title)}</h1><a class="btn acc" href="${home(lang)}#work">${esc(t.notFound.back)}</a></div>`,
  });
}
