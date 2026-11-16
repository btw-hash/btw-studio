import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';
import { createBot } from './bot.js';
import { deliverBrief, isConfigured, type DeliveryConfig } from './brief.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const delivery: DeliveryConfig = {
  tgToken: process.env.BRIEF_TG_BOT_TOKEN,
  tgChatId: process.env.BRIEF_TG_CHAT_ID,
  logDir: process.env.BRIEF_LOG_DIR,
};
const site: { botUsername?: string } = {};
const app = createApp(root, delivery, { noindex: process.env.SITE_NOINDEX === '1', site });

// The intake bot answers as soon as the token is set, so the owner can ask it for the
// chat id (/id) before BRIEF_TG_CHAT_ID exists; briefs are delivered once both are set.
if (delivery.tgToken) {
  const bot = createBot({
    token: delivery.tgToken,
    deliver: async (brief) => {
      if (!isConfigured(delivery)) throw new Error('BRIEF_TG_CHAT_ID is not set');
      await deliverBrief(brief, delivery);
    },
  });
  bot
    .username()
    .then((name) => {
      site.botUsername = name;
      console.log(`brief bot @${name} is polling`);
      void bot.poll();
    })
    .catch((error) => console.error('brief bot did not start', error));
}

const port = Number(process.env.PORT ?? 3480);
app.listen(port, () => {
  console.log(`btw-studio listening on http://localhost:${port}`);
});
