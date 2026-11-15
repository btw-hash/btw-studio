import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const app = createApp(
  root,
  {
    tgToken: process.env.BRIEF_TG_BOT_TOKEN,
    tgChatId: process.env.BRIEF_TG_CHAT_ID,
    logDir: process.env.BRIEF_LOG_DIR,
  },
  { noindex: process.env.SITE_NOINDEX === '1' }
);

const port = Number(process.env.PORT ?? 3480);
app.listen(port, () => {
  console.log(`btw-studio listening on http://localhost:${port}`);
});
