export type Lang = 'en' | 'uk';
export const LANGS: Lang[] = ['en', 'uk'];

export interface ProjectText {
  name: string;
  title: [string, string];
  line: string;
  stage: string;
  problem: string;
  built: string;
  proof: [string, string][];
  proofNote?: string;
  facts: [string, string][];
}

export interface Project {
  slug: string;
  kind: 'live' | 'code' | 'private';
  demo?: string;
  repo?: string;
  video: boolean;
  poster?: string;
  onStage: boolean;
  text: Record<Lang, ProjectText>;
}

export const projects: Project[] = [
  {
    slug: 'crm-pro',
    kind: 'live',
    demo: 'https://crm-pro.btwstudio.dev',
    repo: 'https://github.com/btw-hash/crm-pro',
    video: true,
    poster: 'crm-pro.webp',
    onStage: true,
    text: {
      en: {
        name: 'crm-pro',
        title: ['A sales CRM with', 'an AI assistant.'],
        line: 'A CRM for a B2B sales department: six role workspaces, a deal board, analytics and an assistant that reads the same numbers the team does.',
        stage:
          'A sales CRM with an AI assistant: six role workspaces, a deal board, analytics and an ERP layer.',
        problem:
          'A sales team that lives in spreadsheets and an accounting system. Managers cannot see stalled deals, and nobody trusts a chatbot that invents figures.',
        built:
          'A full CRM with role-based workspaces from head of sales to logistics. The assistant answers from deterministic calculations over the same data the screens show. The accounting system and the model both sit behind interfaces, so a stub can be swapped for the real thing in one place.',
        proof: [
          ['Automated tests', '1,031'],
          ['Role workspaces', '6'],
          ['Checks before every merge', 'types, lint, tests, build'],
        ],
        facts: [
          ['Built with', 'Next.js 16, React 19, Prisma, PostgreSQL'],
          ['Model', 'Behind an interface; provider is replaceable'],
          ['Runs as', 'Docker Compose: app, database, mock ERP'],
          ['Good fit for', 'Sales teams, distributors, internal back offices'],
        ],
      },
      uk: {
        name: 'crm-pro',
        title: ['CRM для відділу продажів', 'з ШІ-асистентом.'],
        line: 'CRM для B2B-продажів: шість рольових кабінетів, дошка угод, аналітика й асистент, який бачить ті самі цифри, що й команда.',
        stage:
          'CRM для продажів із ШІ-асистентом: шість рольових кабінетів, дошка угод, аналітика та шар обліку.',
        problem:
          'Відділ продажів живе в таблицях та обліковій системі. Керівник не бачить завислих угод, а чат-боту, який вигадує цифри, ніхто не вірить.',
        built:
          'Повноцінна CRM із кабінетами від керівника продажів до логіста. Асистент відповідає на основі детермінованих розрахунків за тими самими даними, що й екрани. Облікова система та модель стоять за інтерфейсами, тож заглушку можна замінити справжньою інтеграцією в одному місці.',
        proof: [
          ['Автоматичні тести', '1 031'],
          ['Рольові кабінети', '6'],
          ['Перевірки перед кожним злиттям', 'типи, лінтер, тести, збірка'],
        ],
        facts: [
          ['Стек', 'Next.js 16, React 19, Prisma, PostgreSQL'],
          ['Модель', 'За інтерфейсом; постачальника можна замінити'],
          ['Запуск', 'Docker Compose: застосунок, база, макет обліку'],
          ['Кому підійде', "Відділи продажів, дистриб'ютори, бек-офіси"],
        ],
      },
    },
  },
  {
    slug: 'citewise',
    kind: 'live',
    demo: 'https://citewise.btwstudio.dev',
    repo: 'https://github.com/btw-hash/citewise',
    video: true,
    poster: 'citewise.webp',
    onStage: true,
    text: {
      en: {
        name: 'citewise',
        title: ['Answers that show', 'their source.'],
        line: 'Citewise answers questions from company documents. Every sentence carries a citation, and every citation is checked against the document before anyone sees it.',
        stage:
          'Answers from your documents where every sentence shows its source, checked in code.',
        problem:
          'A document assistant that sounds right and points at a passage that does not say what the answer claims. Prompting harder does not fix it.',
        built:
          'The answer is drafted as separate claims, each with a source and a word-for-word quote. Plain code then checks that the quote really is in that source. A claim that fails is dropped; if nothing is left, the assistant says it does not know.',
        proof: [
          ['Test questions', '22'],
          ['Right passage in the top three', '94.4%'],
          ['Answered and cited the right passage', '88.9%'],
          ['Refused questions the documents do not cover', '100%'],
          ['Citations that passed the check', '100%'],
        ],
        proofNote:
          'Two questions are missed and stay listed on the demo page: keyword search does not connect "lose my laptop" with "lost device".',
        facts: [
          ['Built with', 'TypeScript, Express, own BM25 search'],
          ['Model', 'Any OpenAI-compatible endpoint; runs without one'],
          ['Checks', '9 unit tests, eval gate'],
          ['Good fit for', 'Help centers, internal handbooks, policy search'],
        ],
      },
      uk: {
        name: 'citewise',
        title: ['Відповіді, які показують', 'своє джерело.'],
        line: 'Citewise відповідає на запитання за документами компанії. Кожне речення має цитату, і кожну цитату звіряє з документом код, перш ніж її побачить людина.',
        stage:
          'Відповіді за вашими документами, де кожне речення показує джерело, перевірене кодом.',
        problem:
          'Асистент звучить переконливо, але посилається на абзац, у якому сказано інше. Суворіший промпт цього не виправляє.',
        built:
          'Відповідь складається з окремих тверджень, кожне з джерелом і дослівною цитатою. Звичайний код перевіряє, чи справді ця цитата є в джерелі. Твердження без підтвердження відкидається; якщо не лишилось нічого, асистент каже, що не знає.',
        proof: [
          ['Тестові запитання', '22'],
          ['Потрібний фрагмент серед трьох перших', '94,4%'],
          ['Відповів і процитував правильний фрагмент', '88,9%'],
          ['Відмовив на запитання поза документами', '100%'],
          ['Цитати, що пройшли перевірку', '100%'],
        ],
        proofNote:
          "Два запитання система пропускає, і вони чесно показані на сторінці демо: пошук за словами не пов'язує «загубив ноутбук» із «втраченим пристроєм».",
        facts: [
          ['Стек', 'TypeScript, Express, власний пошук BM25'],
          ['Модель', 'Будь-яка OpenAI-сумісна; працює і без неї'],
          ['Перевірки', '9 тестів, поріг якості'],
          ['Кому підійде', 'Довідкові центри, внутрішні регламенти, політики'],
        ],
      },
    },
  },
  {
    slug: 'docfields',
    kind: 'live',
    demo: 'https://docfields.btwstudio.dev',
    repo: 'https://github.com/btw-hash/docfields',
    video: true,
    poster: 'docfields.webp',
    onStage: true,
    text: {
      en: {
        name: 'docfields',
        title: ['Invoices into', 'validated data.'],
        line: 'Upload an invoice and get structured fields. Every number is re-computed in code and reviewed next to the line it was read from.',
        stage:
          'Invoices turned into data, with every total re-computed and reviewed next to the source line.',
        problem:
          'Whatever reads a document can be wrong in a way that looks fine: a dropped line, a swapped digit, a total taken from the wrong row.',
        built:
          'Extraction and checking are separate. After the fields are read, code verifies the arithmetic: quantity times price, line items against the subtotal, subtotal plus tax against the total. Anything that fails is marked with a plain reason, and a person fixes it on a review screen that re-checks as they type.',
        proof: [
          ['Sample invoices, three layouts, two currencies', '8'],
          ['Fields read correctly on the samples', '64 of 64'],
          ['Deliberately broken invoices caught', '2 of 2'],
          ['Automated tests', '34'],
        ],
        proofNote:
          'The samples and the rules were written together, so this is a regression check, not a benchmark. Known limits are listed in the repository.',
        facts: [
          ['Built with', 'TypeScript, Express, PDF text extraction'],
          ['Model', 'Optional; a rule-based reader runs by default'],
          ['Output', 'JSON, after a human review step'],
          ['Good fit for', 'Accounting intake, logistics paperwork, back office'],
        ],
      },
      uk: {
        name: 'docfields',
        title: ['Рахунки, що стають', 'перевіреними даними.'],
        line: 'Завантажте рахунок і отримайте структуровані поля. Кожне число перераховує код, а людина перевіряє його поруч із рядком, звідки його взято.',
        stage:
          'Рахунки перетворюються на дані: кожен підсумок перераховано й показано поруч із рядком-джерелом.',
        problem:
          'Хоч би що читало документ, воно може помилитися непомітно: загублений рядок, переставлена цифра, підсумок не з того рядка.',
        built:
          'Витягування й перевірка розділені. Після читання полів код перевіряє арифметику: кількість на ціну, рядки проти проміжного підсумку, підсумок із податком проти загальної суми. Усе, що не зійшлося, позначається зі зрозумілою причиною, а людина виправляє це на екрані, який перераховує все під час введення.',
        proof: [
          ['Зразки рахунків, три макети, дві валюти', '8'],
          ['Поля, прочитані правильно на зразках', '64 із 64'],
          ['Навмисно зіпсовані рахунки виявлено', '2 із 2'],
          ['Автоматичні тести', '34'],
        ],
        proofNote:
          'Зразки та правила писалися разом, тому це регресійна перевірка, а не бенчмарк. Відомі обмеження перелічені в репозиторії.',
        facts: [
          ['Стек', 'TypeScript, Express, читання тексту з PDF'],
          ['Модель', "Необов'язкова; типово працюють правила"],
          ['Результат', 'JSON після перевірки людиною'],
          ['Кому підійде', 'Бухгалтерія, логістика, бек-офіс'],
        ],
      },
    },
  },
  {
    slug: 'agent-dashboard',
    kind: 'code',
    repo: 'https://github.com/btw-hash/agent-dashboard',
    video: true,
    poster: 'agent-dashboard.webp',
    onStage: true,
    text: {
      en: {
        name: 'agent-dashboard',
        title: ['See your agents', 'at work.'],
        line: 'A real-time office for running AI coding agents: who is working, on what, and who has been idle too long.',
        stage:
          'A real-time office for running AI agents: who is working, on what, and who is stuck.',
        problem:
          'Several agents run in parallel terminals. A wall of logs does not tell you at a glance which one is busy and which one stopped an hour ago.',
        built:
          'The server watches the session logs and pushes changes to the browser, where each session is a character in an office: at a desk while it works, wandering when it is idle. Side panels list every agent with its current tool.',
        proof: [
          ['Updates', 'pushed live, with a polling fallback'],
          ['Source', 'open'],
        ],
        facts: [
          ['Built with', 'Node.js, Canvas 2D, WebSocket'],
          ['Runs as', 'A local server next to your agents'],
          ['Good fit for', 'Teams running several coding agents at once'],
        ],
      },
      uk: {
        name: 'agent-dashboard',
        title: ['Бачте, як працюють', 'ваші агенти.'],
        line: 'Офіс у реальному часі для ШІ-агентів, що пишуть код: хто працює, над чим і хто надто довго простоює.',
        stage: 'Офіс у реальному часі для ШІ-агентів: хто працює, над чим і хто завис.',
        problem:
          'Кілька агентів працюють у паралельних терміналах. Стіна логів не показує одразу, хто зайнятий, а хто зупинився годину тому.',
        built:
          'Сервер стежить за журналами сесій і надсилає зміни в браузер, де кожна сесія — персонаж в офісі: за столом, коли працює, і на прогулянці, коли простоює. Бічні панелі показують кожного агента та його поточний інструмент.',
        proof: [
          ['Оновлення', 'наживо, із запасним опитуванням'],
          ['Код', 'відкритий'],
        ],
        facts: [
          ['Стек', 'Node.js, Canvas 2D, WebSocket'],
          ['Запуск', 'Локальний сервер поруч з агентами'],
          ['Кому підійде', 'Командам, де працює кілька агентів одночасно'],
        ],
      },
    },
  },
  {
    slug: 'fancon-map',
    kind: 'live',
    demo: 'https://fancon.btwstudio.dev',
    video: false,
    poster: 'fancon-map.webp',
    onStage: true,
    text: {
      en: {
        name: 'fancon-map',
        title: ['A festival you can', 'walk through.'],
        line: 'An interactive map of a pop-culture convention, playable in the browser, where every stand can be visited.',
        stage: 'A pop-culture festival you can walk through in the browser, all 224 stands.',
        problem:
          'A convention hands out a paper map with two hundred stands. Visitors cannot tell what is where until they are standing in front of it.',
        built:
          'The hall is rebuilt from the official floor plan as a top-down world. You walk it with the keyboard, open any stand for its card, and the featured ones have their own interiors and small games.',
        proof: [
          ['Stands placed from the official plan', '224'],
          ['Featured stands with their own interiors', '50'],
        ],
        facts: [
          ['Built with', 'Phaser 3, TypeScript, Vite'],
          ['Runs as', 'A static site with a tiny leaderboard API'],
          ['Good fit for', 'Events, venues, exhibitions'],
        ],
      },
      uk: {
        name: 'fancon-map',
        title: ['Фестиваль, яким можна', 'пройтися.'],
        line: 'Інтерактивна мапа фестивалю попкультури просто в браузері, де можна зайти на кожен стенд.',
        stage: 'Фестиваль попкультури, яким можна пройтися в браузері: усі 224 стенди.',
        problem:
          'Фестиваль роздає паперову мапу з двома сотнями стендів. Відвідувач не розуміє, що де, поки не стане перед стендом.',
        built:
          "Зал відтворено за офіційним планом як світ із видом згори. Ним ходять з клавіатури, будь-який стенд відкриває свою картку, а головні мають власні інтер'єри та міні-ігри.",
        proof: [
          ['Стенди, розставлені за офіційним планом', '224'],
          ["Головні стенди з власними інтер'єрами", '50'],
        ],
        facts: [
          ['Стек', 'Phaser 3, TypeScript, Vite'],
          ['Запуск', 'Статичний сайт із маленьким API рейтингу'],
          ['Кому підійде', 'Події, майданчики, виставки'],
        ],
      },
    },
  },
  {
    slug: 'nox',
    kind: 'private',
    repo: 'https://github.com/btw-hash/nox',
    video: false,
    onStage: false,
    text: {
      en: {
        name: 'nox',
        title: ['A personal assistant', 'in daily use.'],
        line: 'A Telegram bot, an Android app and a background agent on a self-hosted server. It has run every day since April 2026.',
        stage: '',
        problem:
          'Tasks, mail, client replies and server alerts arrive in different places, and most assistants are demos that nobody uses a month later.',
        built:
          'One assistant reachable from a chat and a phone app. Incoming signals become cards with one notification per batch. A watchdog monitors the server it runs on: one outage produces one alert, and a narrow set of repairs happens without a human.',
        proof: [
          ['In daily use since', 'April 2026'],
          ['Releases shipped through pull requests', '46'],
          ['Side effects', 'smoke-tested against the live system'],
        ],
        facts: [
          ['Built with', 'TypeScript, grammY, SQLite, Claude Agent SDK'],
          ['Clients', 'Telegram, Android with over-the-air updates'],
          ['Code', 'Private; the showcase repository describes the design'],
        ],
      },
      uk: {
        name: 'nox',
        title: ['Особистий асистент', 'у щоденній роботі.'],
        line: 'Telegram-бот, застосунок для Android і фоновий агент на власному сервері. Працює щодня з квітня 2026 року.',
        stage: '',
        problem:
          'Завдання, пошта, відповіді клієнтів і тривоги сервера приходять у різні місця, а більшість асистентів — це демо, яким за місяць ніхто не користується.',
        built:
          'Один асистент, доступний із чату та з телефона. Вхідні сигнали стають картками з одним сповіщенням на пачку. Сторож стежить за сервером, на якому працює: одне відключення дає одну тривогу, а вузький набір ремонтів виконується без людини.',
        proof: [
          ['У щоденній роботі з', 'квітня 2026'],
          ['Релізи через pull request', '46'],
          ['Побічні дії', 'перевірені на живій системі'],
        ],
        facts: [
          ['Стек', 'TypeScript, grammY, SQLite, Claude Agent SDK'],
          ['Клієнти', 'Telegram, Android з оновленням без перевстановлення'],
          ['Код', 'Приватний; архітектуру описано в репозиторії-вітрині'],
        ],
      },
    },
  },
  {
    slug: 'vault-research-agent',
    kind: 'code',
    repo: 'https://github.com/btw-hash/vault-research-agent',
    video: false,
    onStage: false,
    text: {
      en: {
        name: 'vault-research-agent',
        title: ['Several agents,', 'one cited answer.'],
        line: 'A command-line research pipeline over a notes vault: a planner splits the question, workers search in parallel, and a judge sends weak answers back.',
        stage: '',
        problem:
          'One model call over a large body of notes either misses half of it or answers with confidence it has not earned.',
        built:
          'A planner breaks the question into sub-questions and a router decides how deep each one goes. Workers read the vault through a standard tool protocol in parallel, a synthesizer writes a structured answer with sources, and a judge scores it. Below the threshold, the answer is revised.',
        proof: [
          ['Evaluation set', '15 questions'],
          ['Judged on', 'groundedness, relevance, completeness'],
          ['Regression gate', 'the run fails below a set score'],
        ],
        facts: [
          ['Built with', 'TypeScript, Claude, Model Context Protocol'],
          ['Runs as', 'A command-line tool; a demo vault is bundled'],
          ['Good fit for', 'Research over internal notes and documentation'],
        ],
      },
      uk: {
        name: 'vault-research-agent',
        title: ['Кілька агентів,', 'одна відповідь із джерелами.'],
        line: 'Дослідницький конвеєр у командному рядку над сховищем нотаток: планувальник ділить запитання, виконавці шукають паралельно, а суддя повертає слабкі відповіді на доопрацювання.',
        stage: '',
        problem:
          'Один виклик моделі над великим масивом нотаток або пропускає половину, або відповідає впевненіше, ніж має підстави.',
        built:
          'Планувальник розбиває запитання на підзапитання, а маршрутизатор вирішує, наскільки глибоко йти в кожне. Виконавці паралельно читають сховище через стандартний протокол інструментів, синтезатор пише структуровану відповідь із джерелами, суддя її оцінює. Якщо оцінка нижча за поріг, відповідь переписується.',
        proof: [
          ['Набір для оцінювання', '15 запитань'],
          ['Критерії судді', 'обґрунтованість, доречність, повнота'],
          ['Регресійний поріг', 'прогін падає нижче заданої оцінки'],
        ],
        facts: [
          ['Стек', 'TypeScript, Claude, Model Context Protocol'],
          ['Запуск', 'Інструмент командного рядка; демо-сховище в комплекті'],
          ['Кому підійде', 'Дослідження за внутрішніми нотатками й документацією'],
        ],
      },
    },
  },
  {
    slug: 'benchmark-cc',
    kind: 'code',
    repo: 'https://github.com/btw-hash/benchmark-cc',
    video: false,
    onStage: false,
    text: {
      en: {
        name: 'benchmark-cc',
        title: ['Measure the setup,', "don't argue about it."],
        line: 'An A/B harness that shows what each layer of an AI coding setup adds in quality, time and cost.',
        stage: '',
        problem:
          'Teams pile instructions, agents and skills onto their coding assistant and judge the result by feel.',
        built:
          'The harness runs the same isolated tasks under different configurations, records tokens, time and cost, and has a model judge the quality. The published run compares seven setups.',
        proof: [
          ['Runs in the published report', '390'],
          ['Setups compared', '7'],
          ['Tasks', '13'],
          ["Judged quality across setups", "9.3 to 9.5 of 10"],
        ],
        proofNote:
          'The finding is unglamorous: on isolated tasks configuration barely moved quality, while the richest setup cost about 20% more per run.',
        facts: [
          ['Built with', 'Node.js, Claude Code'],
          ['Output', 'A report with per-task tables'],
          ['Good fit for', 'Teams standardizing how they use coding agents'],
        ],
      },
      uk: {
        name: 'benchmark-cc',
        title: ['Вимірюйте налаштування,', 'а не сперечайтеся.'],
        line: 'Стенд A/B-порівняння, який показує, що додає кожен шар налаштувань ШІ-асистента для коду: якість, час і вартість.',
        stage: '',
        problem:
          'Команди навішують на асистента інструкції, агентів і навички, а результат оцінюють на відчуття.',
        built:
          'Стенд запускає однакові ізольовані завдання за різних конфігурацій, записує токени, час і вартість, а якість оцінює модель-суддя. В опублікованому прогоні порівняно сім конфігурацій.',
        proof: [
          ['Прогони в опублікованому звіті', '390'],
          ['Порівняні конфігурації', '7'],
          ['Завдання', '13'],
          ["Оцінка якості за конфігураціями", "від 9,3 до 9,5 з 10"],
        ],
        proofNote:
          'Висновок непоказний: на ізольованих завданнях налаштування майже не змінили якість, а найбагатша конфігурація коштувала приблизно на 20% більше за прогін.',
        facts: [
          ['Стек', 'Node.js, Claude Code'],
          ['Результат', 'Звіт із таблицями за кожним завданням'],
          ['Кому підійде', 'Командам, що стандартизують роботу з агентами'],
        ],
      },
    },
  },
];

export const ui = {
  en: {
    htmlLang: 'en',
    siteTitle: 'BTW Studio — we build the AI part of your product',
    siteDesc:
      'A small studio for agencies and product teams. Tested, deployed AI features with live demos you can open.',
    nav: { work: 'Work', method: 'Method', brief: 'Send a brief' },
    hero: ['We build the AI part of your product.', 'Watch it run.'],
    sub: 'A small studio for agencies and product teams. You keep the client and the roadmap; we return a tested, deployed feature. Every project below is live.',
    stageGroup: 'Project',
    kind: { live: 'live demo', code: 'open source', private: 'private code' },
    open: 'Open the demo',
    code: 'Read the code',
    how: 'How it was built',
    doors: [
      [
        'Run a studio or an agency?',
        'Sell the project, keep the client, hand us the AI piece. We deliver under your brand and stay out of the conversation.',
      ],
      [
        'Run a product team?',
        'Add an AI engineer for part of the week, inside your repository and your chat.',
      ],
    ],
    methodTitle: 'How we work',
    method: [
      ['Spec before code', 'What we build and what we leave out is written down first.'],
      [
        'Tests and a real run',
        'A change ships after the suite passes and the path was exercised live.',
      ],
      [
        'The model is replaceable',
        'Providers sit behind an interface; swapping one is a one-file change.',
      ],
      ['In writing', 'Every decision arrives as text you can forward to your client.'],
    ],
    allWork: 'All work',
    more: 'Read more',
    brief: {
      title: 'Tell us the one thing to build.',
      promise:
        'Scope, timeline and price come back within one working day. In writing, no call needed.',
      who: 'Who you are',
      studio: 'Studio or agency',
      team: 'Product team',
      what: 'What should we build',
      whatPh: 'A support assistant that answers from our docs and shows its sources',
      when: 'By when',
      whenPh: 'End of January',
      reply: 'Where do we reply',
      replyPh: 'name@yourstudio.com',
      send: 'Send the brief',
      sending: 'Sending…',
      ok: 'Received. We will reply within one working day.',
      errors: {
        what: 'Describe what to build in at least a sentence.',
        reply: 'Leave an email or a messenger handle so we can answer.',
        rate: 'Too many briefs from this address. Try again in a few minutes.',
        down: 'The form is not connected right now. Please reach us through GitHub below.',
        fail: 'Could not send. Please try again in a minute.',
      },
    },
    project: {
      back: 'All work',
      problem: 'The problem',
      built: 'What we built',
      proof: 'How we know it works',
      next: 'Next',
      cta: 'Need something like this? Send a brief',
    },
    footer: { rights: 'BTW Studio', github: 'GitHub' },
    notFound: { title: 'This page does not exist.', back: 'Back to the work' },
    langName: 'Українською',
  },
  uk: {
    htmlLang: 'uk',
    siteTitle: 'BTW Studio — будуємо ШІ-частину вашого продукту',
    siteDesc:
      'Невелика студія для агенцій і продуктових команд. Перевірені й розгорнуті ШІ-функції з живими демо, які можна відкрити.',
    nav: { work: 'Роботи', method: 'Підхід', brief: 'Надіслати бриф' },
    hero: ['Будуємо ШІ-частину вашого продукту.', 'Дивіться, як вона працює.'],
    sub: 'Невелика студія для агенцій і продуктових команд. Клієнт і план залишаються вашими; ми повертаємо перевірену й розгорнуту функцію. Усі проєкти нижче працюють просто зараз.',
    stageGroup: 'Проєкт',
    kind: { live: 'живе демо', code: 'відкритий код', private: 'приватний код' },
    open: 'Відкрити демо',
    code: 'Переглянути код',
    how: 'Як це зроблено',
    doors: [
      [
        'Керуєте студією чи агенцією?',
        'Продавайте проєкт, ведіть клієнта, а ШІ-частину віддайте нам. Здаємо під вашим брендом і не втручаємось у розмову.',
      ],
      [
        'Керуєте продуктовою командою?',
        'Додайте ШІ-інженера на частину тижня: у вашому репозиторії та у вашому чаті.',
      ],
    ],
    methodTitle: 'Як ми працюємо',
    method: [
      [
        'Спершу специфікація',
        'Що будуємо і що свідомо лишаємо поза межами, записано до першого рядка коду.',
      ],
      ['Тести і справжній запуск', 'Зміна виходить після зелених тестів і перевірки шляху наживо.'],
      [
        'Модель можна замінити',
        'Постачальники стоять за інтерфейсом; заміна — це зміна одного файлу.',
      ],
      ['Письмово', 'Кожне рішення приходить текстом, який можна переслати клієнтові.'],
    ],
    allWork: 'Усі роботи',
    more: 'Докладніше',
    brief: {
      title: 'Опишіть одну річ, яку треба збудувати.',
      promise:
        'Обсяг, терміни й ціну надішлемо протягом одного робочого дня. Письмово, без дзвінків.',
      who: 'Хто ви',
      studio: 'Студія чи агенція',
      team: 'Продуктова команда',
      what: 'Що треба збудувати',
      whatPh: 'Асистент підтримки, який відповідає за нашою документацією і показує джерела',
      when: 'До якого терміну',
      whenPh: 'До кінця січня',
      reply: 'Куди відповісти',
      replyPh: 'name@yourstudio.com',
      send: 'Надіслати бриф',
      sending: 'Надсилаємо…',
      ok: 'Отримали. Відповімо протягом одного робочого дня.',
      errors: {
        what: 'Опишіть завдання хоча б одним реченням.',
        reply: 'Залиште пошту або нік у месенджері, щоб ми могли відповісти.',
        rate: 'Забагато брифів із цієї адреси. Спробуйте за кілька хвилин.',
        down: "Форма зараз не під'єднана. Напишіть нам через GitHub нижче.",
        fail: 'Не вдалося надіслати. Спробуйте ще раз за хвилину.',
      },
    },
    project: {
      back: 'Усі роботи',
      problem: 'Проблема',
      built: 'Що ми зробили',
      proof: 'Звідки відомо, що це працює',
      next: 'Далі',
      cta: 'Потрібне щось подібне? Надішліть бриф',
    },
    footer: { rights: 'BTW Studio', github: 'GitHub' },
    notFound: { title: 'Такої сторінки немає.', back: 'Повернутися до робіт' },
    langName: 'English',
  },
} as const;

export type Ui = (typeof ui)[Lang];

export function findProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
