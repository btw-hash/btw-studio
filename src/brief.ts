import { appendFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

export interface Brief {
  who: 'studio' | 'team';
  what: string;
  when: string;
  reply: string;
  lang: string;
}

export type BriefError = 'what' | 'reply';

export function parseBrief(
  body: unknown
): { brief: Brief } | { error: BriefError } | { spam: true } {
  const b = (typeof body === 'object' && body !== null ? body : {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  // Honeypot: real visitors never see or fill this field.
  if (str(b.website)) return { spam: true };
  const what = str(b.what);
  const reply = str(b.reply);
  if (what.length < 10 || what.length > 2000) return { error: 'what' };
  if (reply.length < 5 || reply.length > 200 || !/[@.]/.test(reply)) return { error: 'reply' };
  return {
    brief: {
      who: b.who === 'team' ? 'team' : 'studio',
      what,
      when: str(b.when).slice(0, 120),
      reply,
      lang: b.lang === 'uk' ? 'uk' : 'en',
    },
  };
}

export interface DeliveryConfig {
  tgToken?: string;
  tgChatId?: string;
  logDir?: string;
  fetchImpl?: typeof fetch;
}

export function isConfigured(cfg: DeliveryConfig): boolean {
  return Boolean(cfg.tgToken && cfg.tgChatId);
}

export function formatBrief(brief: Brief): string {
  return [
    `New brief (${brief.who === 'team' ? 'product team' : 'studio or agency'}, ${brief.lang})`,
    '',
    brief.what,
    '',
    `By when: ${brief.when || 'not stated'}`,
    `Reply to: ${brief.reply}`,
  ].join('\n');
}

export async function deliverBrief(brief: Brief, cfg: DeliveryConfig): Promise<void> {
  if (cfg.logDir) {
    mkdirSync(cfg.logDir, { recursive: true });
    appendFileSync(
      join(cfg.logDir, 'briefs.jsonl'),
      JSON.stringify({ at: new Date().toISOString(), ...brief }) + '\n'
    );
  }
  const doFetch = cfg.fetchImpl ?? fetch;
  const res = await doFetch(`https://api.telegram.org/bot${cfg.tgToken}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      chat_id: cfg.tgChatId,
      text: formatBrief(brief),
      disable_web_page_preview: true,
    }),
  });
  if (!res.ok) throw new Error(`Telegram responded with ${res.status}`);
}

export class RateLimiter {
  private readonly seen = new Map<string, { count: number; resetAt: number }>();

  constructor(
    private readonly max: number,
    private readonly windowMs: number
  ) {}

  allow(key: string, now = Date.now()): boolean {
    const entry = this.seen.get(key);
    if (!entry || entry.resetAt < now) {
      this.seen.set(key, { count: 1, resetAt: now + this.windowMs });
      return true;
    }
    entry.count += 1;
    return entry.count <= this.max;
  }
}
