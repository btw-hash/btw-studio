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
import { renderHome, renderNotFound, renderProject } from './render.js';

export function createApp(
  root: string,
  delivery: DeliveryConfig,
  options: { noindex?: boolean } = {}
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
  app.use(express.json({ limit: '8kb' }));
  app.use(express.static(join(root, 'public'), { maxAge: '1h' }));

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
      res.type('html').send(renderHome(lang));
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
