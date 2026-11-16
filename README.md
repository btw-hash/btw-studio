# BTW Studio site

The studio's website: a showroom where the first screen plays recordings of live demos, a page per project, and a written brief form instead of a "book a call" button. English and Ukrainian.

## Run it

```bash
npm install
npm run dev        # http://localhost:3480
```

`npm run verify` runs the typecheck and the tests.

## How it is built

```
src/
  content.ts   every project and every interface string, in both languages
  render.ts    server-side HTML: layout, home, project page, 404
  brief.ts     brief validation, Telegram delivery, rate limiter
  bot.ts       the same brief taken as a Telegram conversation
  app.ts       Express routes
  server.ts    entry point, reads the environment
public/
  styles.css   one stylesheet, no framework
  app.js       stage switching and the brief form
  media/       demo recordings (mp4) and posters (webp)
```

Pages are rendered on the server from `content.ts`, so adding a project is one object in one file. The browser script only switches the stage and submits the form; the site reads fine without it.

## The brief form

`POST /api/brief` validates the brief, drops honeypot submissions, limits each address to five briefs per ten minutes, and sends the brief to a Telegram chat.

| Variable | Purpose |
|---|---|
| `BRIEF_TG_BOT_TOKEN` | Token of the bot that delivers briefs |
| `BRIEF_TG_CHAT_ID` | Chat that receives them |
| `BRIEF_LOG_DIR` | Optional folder for a JSONL copy of every brief |

Without the first two the endpoint answers `503` and the page tells the visitor the form is not connected. It never reports success for a brief that went nowhere.

## The brief bot

The same bot also takes briefs in Telegram. `/start` asks who the client is, what to build, by when and where to reply, shows the brief back and sends it to the same chat only after the client confirms. It runs inside this service by long polling, so there is no webhook to register; the page links to it under the form once the bot's name is known.

`/id` in any chat answers with that chat's id, which is the value for `BRIEF_TG_CHAT_ID`. Outside private chats the bot answers nothing else. One chat can send three briefs an hour.

## Deploy

```bash
docker build -t btw-studio .
docker run -p 3480:3480 -e BRIEF_TG_BOT_TOKEN=... -e BRIEF_TG_CHAT_ID=... btw-studio
```
