import { createHash } from 'node:crypto';
import { join } from 'node:path';
import express, { type Express } from 'express';
import {
  deliverBrief,
  isConfigured,
  parseBrief,
  RateLimiter,
  type DeliveryConfig,
} from './brief.js';
import { findProject, type Lang } from './content.js';
import { INLINE_JS, renderHome, renderNotFound, renderProject, renderSitemap } from './render.js';

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'sha256-${createHash('sha256').update(INLINE_JS).digest('base64')}'`,
  "style-src 'self'",
  "style-src-attr 'unsafe-inline'",
  "img-src 'self' data:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

export function createApp(
  root: string,
  delivery: DeliveryConfig,
  options: { noindex?: boolean; site?: { botUsername?: string } } = {}
): Express {
  const app = express();
  const limiter = new RateLimiter(5, 10 * 60_000);

  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  if (options.noindex) {
    app.use((_req, res, next) => {
      res.setHeader('X-Robots-Tag', 'noindex, nofollow');
      next();
    });
  }
  app.use((req, res, next) => {
    // Cloudflare reports the visitor's scheme here; the tunnel itself always reaches us over http.
    if (String(req.headers['cf-visitor'] ?? '').includes('"scheme":"http"')) {
      res.redirect(301, `https://${req.hostname}${req.originalUrl}`);
      return;
    }
    res.setHeader('Strict-Transport-Security', 'max-age=15552000');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Content-Security-Policy', CSP);
    next();
  });
  app.use(express.json({ limit: '8kb' }));
  app.get('/robots.txt', (_req, res) => {
    res
      .type('text/plain')
      .send(
        options.noindex
          ? 'User-agent: *\nDisallow: /\n'
          : 'User-agent: *\nAllow: /\nSitemap: https://btwstudio.dev/sitemap.xml\n'
      );
  });
  app.get('/sitemap.xml', (_req, res) => {
    res.type('application/xml').send(renderSitemap());
  });
  app.get('/favicon.ico', (_req, res) => {
    res.redirect(301, '/favicon.svg');
  });
  app.use(
    express.static(join(root, 'public'), {
      maxAge: '1h',
      setHeaders(res, file) {
        // media, styles and scripts carry a per-deploy version in the URL; a changed font gets a new name
        if (/[\\/](media|fonts)[\\/]|\.(css|js)$/.test(file)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      },
    })
  );

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, briefs: isConfigured(delivery) });
  });

  app.post('/api/brief', async (req, res) => {
    if (!limiter.allow(req.ip ?? 'unknown')) {
      res.status(429).json({ error: 'rate' });
      return;
    }
    const parsed = parseBrief(req.body);
    if ('spam' in parsed) {
      res.json({ ok: true });
      return;
    }
    if ('error' in parsed) {
      res.status(422).json({ error: parsed.error });
      return;
    }
    if (!isConfigured(delivery)) {
      res.status(503).json({ error: 'down' });
      return;
    }
    try {
      await deliverBrief(parsed.brief, delivery);
      res.json({ ok: true });
    } catch (error) {
      console.error(error);
      res.status(502).json({ error: 'fail' });
    }
  });

  const page = (lang: Lang) => {
    const base = lang === 'uk' ? '/uk' : '';
    app.get(base || '/', (_req, res) => {
      res.type('html').send(renderHome(lang, options.site?.botUsername));
    });
    app.get(`${base}/work/:slug`, (req, res) => {
      const project = findProject(req.params.slug);
      if (!project) {
        res.status(404).type('html').send(renderNotFound(lang));
        return;
      }
      res.type('html').send(renderProject(lang, project));
    });
  };
  page('en');
  page('uk');

  app.use((req, res) => {
    res
      .status(404)
      .type('html')
      .send(renderNotFound(req.path.startsWith('/uk') ? 'uk' : 'en'));
  });

  return app;
}
