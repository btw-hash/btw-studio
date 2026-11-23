export type Lang = 'en' | 'uk';
export const LANGS: Lang[] = ['en', 'uk'];

export interface CaseStudy {
  plain: string;
  steps: [string, string][];
  flow: { label: string; note: string; or?: { label: string; note: string } }[];
  flowNote?: string;
  decisions: [string, string][];
}

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
  study?: CaseStudy;
}

export interface Project {
  slug: string;
  kind: 'live' | 'code' | 'private';
  demo?: string;
  repo?: string;
  video: boolean;
  poster?: string;
  onStage: boolean;
  clips?: { file: string; label: Record<Lang, string> }[];
  tour?: { file: string; label: Record<Lang, string> };
  text: Record<Lang, ProjectText>;
}

export const projects: Project[] = [
  {
    slug: 'agent-dashboard',
    kind: 'live',
    demo: 'https://office.btwstudio.dev',
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
          'The server watches the session logs and pushes changes to the browser, where each session is a person in a pixel office: at a desk while it works, off to the break rooms when it is idle. Click a person to see what the agent is doing. Any other bot joins with one HTTP request.',
        proof: [
          ['Updates', 'pushed live over WebSocket'],
          ['Leaves your machine', 'no project names, paths or message text'],
          ['Source', 'open'],
        ],
        facts: [
          ['Built with', 'Node.js, Canvas 2D, WebSocket'],
          ['Runs as', 'A local server next to your agents'],
          ['Good fit for', 'Teams running several coding agents at once'],
        ],
        study: {
          plain:
            'When several AI coding agents run at once, it is hard to tell who is busy. Here each agent is a small character in a pixel office: at a desk while it works, wandering off when it is idle. One look tells you who stopped.',
          steps: [
            [
              'Start it next to your agents',
              'A small local server finds the running sessions by itself.',
            ],
            [
              'Watch the office',
              'A character sits down when its agent uses a tool and gets up when the agent goes quiet.',
            ],
            [
              'Click a person',
              'A card shows what the agent is doing right now: reading a file, running a command, thinking.',
            ],
          ],
          flow: [
            { label: 'Session logs', note: 'Files the coding agents already write' },
            { label: 'Watcher', note: 'Reads new lines as they appear' },
            { label: 'Server', note: 'Node.js, keeps the state of each agent' },
            { label: 'Live channel', note: 'WebSocket' },
            { label: 'Office', note: 'Canvas 2D in the browser' },
          ],
          decisions: [
            [
              'Read the logs, change nothing',
              'The agents are not modified or wrapped. The dashboard only reads files they already write.',
            ],
            [
              'Nothing private leaves the server',
              'The browser receives anonymous people with a state and a kind of action. Project names, file paths and message text stay on the machine.',
            ],
            [
              'A scene instead of a table',
              'Busy and idle are visible from across the room, which a list of statuses is not.',
            ],
          ],
        },
      },
      uk: {
        name: 'agent-dashboard',
        title: ['Бачте, як працюють', 'ваші агенти.'],
        line: 'Офіс у реальному часі для ШІ-агентів, що пишуть код: хто працює, над чим і хто надто довго простоює.',
        stage: 'Офіс у реальному часі для ШІ-агентів: хто працює, над чим і хто завис.',
        problem:
          'Кілька агентів працюють у паралельних терміналах. Стіна логів не показує одразу, хто зайнятий, а хто зупинився годину тому.',
        built:
          'Сервер стежить за журналами сесій і надсилає зміни в браузер, де кожна сесія — людина в піксельному офісі: за столом, коли працює, і в кімнатах відпочинку, коли простоює. Клацніть людину, щоб побачити, що робить агент. Будь-який інший бот підключається одним HTTP-запитом.',
        proof: [
          ['Оновлення', 'наживо через WebSocket'],
          ['Назовні', 'жодних назв проєктів, шляхів чи тексту повідомлень'],
          ['Код', 'відкритий'],
        ],
        facts: [
          ['Стек', 'Node.js, Canvas 2D, WebSocket'],
          ['Запуск', 'Локальний сервер поруч з агентами'],
          ['Кому підійде', 'Командам, де працює кілька агентів одночасно'],
        ],
        study: {
          plain:
            'Коли кілька ШІ-агентів пишуть код одночасно, важко зрозуміти, хто зайнятий. Тут кожен агент — маленький персонаж у піксельному офісі: за столом, поки працює, і блукає, коли простоює. Одного погляду досить, щоб побачити, хто зупинився.',
          steps: [
            [
              'Запустіть поруч з агентами',
              'Невеликий локальний сервер сам знаходить активні сесії.',
            ],
            [
              'Дивіться на офіс',
              'Персонаж сідає, коли його агент викликає інструмент, і встає, коли агент затих.',
            ],
            [
              'Клацніть людину',
              'Картка показує, що агент робить просто зараз: читає файл, виконує команду, думає.',
            ],
          ],
          flow: [
            { label: 'Журнали сесій', note: 'Файли, які агенти й так пишуть' },
            { label: 'Спостерігач', note: 'Читає нові рядки, щойно з’являються' },
            { label: 'Сервер', note: 'Node.js, тримає стан кожного агента' },
            { label: 'Живий канал', note: 'WebSocket' },
            { label: 'Офіс', note: 'Canvas 2D у браузері' },
          ],
          decisions: [
            [
              'Читати журнали, нічого не міняти',
              'Агентів не змінюють і не обгортають. Панель лише читає файли, які вони вже пишуть.',
            ],
            [
              'Нічого приватного не виходить із сервера',
              'Браузер отримує знеособлених людей зі станом і типом дії. Назви проєктів, шляхи до файлів і текст повідомлень лишаються на машині.',
            ],
            [
              'Сцена замість таблиці',
              'Хто зайнятий, а хто простоює, видно здалеку — зі списку статусів так не побачиш.',
            ],
          ],
        },
      },
    },
  },
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
        study: {
          plain:
            'A sales department works in one place instead of spreadsheets. Each person sees only their part of the job: the head of sales sees the whole team, a manager sees their own deals, logistics sees what ships today. An assistant answers questions about the numbers, and it reads the same numbers the screens show.',
          steps: [
            [
              'Pick a role',
              'The demo has six logins, from head of sales to logistics. Each opens a different workspace.',
            ],
            [
              'Move a deal',
              'Deals sit on a board and pass from stage to stage, down to accounting and dispatch.',
            ],
            [
              'Ask the assistant',
              'It answers from calculations over the live data, so a figure in the chat matches the figure on the dashboard.',
            ],
          ],
          flow: [
            { label: 'Screens', note: 'Pages and forms; they only call use-cases' },
            { label: 'Use-cases', note: 'Business actions; they depend on interfaces' },
            { label: 'Domain', note: 'Entities and rules; imports nothing else' },
            {
              label: 'Adapters',
              note: 'Database, accounting system, model; chosen by configuration',
            },
          ],
          flowNote:
            'Dependencies point inward. Swapping a stub for the real accounting system, or one model provider for another, happens in one file.',
          decisions: [
            [
              'The assistant computes, the model words it',
              'Figures come from deterministic calculations over the same data as the screens. The model never makes up a number.',
            ],
            [
              'Everything outside sits behind an interface',
              'The accounting system, the model and the database are adapters. The demo runs on stubs and an in-memory store; a real deployment swaps them in one place.',
            ],
            [
              'A guard on what leaves for the model',
              'Outgoing text is scanned for amounts, company-name suffixes and tax-number shapes. A hit blocks the call before it reaches the network.',
            ],
            [
              'Six roles, one codebase',
              'Each role gets its own workspace. The technologist works a test queue that carries no commercial data.',
            ],
          ],
        },
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
        study: {
          plain:
            'Відділ продажів працює в одному місці замість таблиць. Кожен бачить лише свою частину роботи: керівник відділу — усю команду, менеджер — власні угоди, логіст — що сьогодні відвантажується. Асистент відповідає на запитання про цифри і читає ті самі цифри, що й екрани.',
          steps: [
            [
              'Оберіть роль',
              'У демо шість входів, від керівника продажів до логіста. Кожен відкриває свій робочий простір.',
            ],
            [
              'Пересуньте угоду',
              'Угоди лежать на дошці та йдуть від етапу до етапу, аж до бухгалтерії й відвантаження.',
            ],
            [
              'Запитайте асистента',
              'Він відповідає з розрахунків за живими даними, тож цифра в чаті збігається з цифрою на панелі.',
            ],
          ],
          flow: [
            { label: 'Екрани', note: 'Сторінки й форми; викликають лише сценарії' },
            { label: 'Сценарії', note: 'Бізнес-дії; залежать від інтерфейсів' },
            { label: 'Домен', note: 'Сутності й правила; нічого не імпортує' },
            { label: 'Адаптери', note: 'База, облікова система, модель; обираються конфігурацією' },
          ],
          flowNote:
            'Залежності спрямовані всередину. Заглушку на справжню облікову систему чи одного провайдера моделі на іншого міняють в одному файлі.',
          decisions: [
            [
              'Рахує код, формулює модель',
              'Цифри беруться з детермінованих розрахунків за тими самими даними, що й екрани. Модель чисел не вигадує.',
            ],
            [
              'Усе зовнішнє — за інтерфейсом',
              'Облікова система, модель і база є адаптерами. Демо працює на заглушках і сховищі в пам’яті; у справжньому розгортанні їх міняють в одному місці.',
            ],
            [
              'Запобіжник на те, що йде до моделі',
              'Вихідний текст перевіряється на суми, форми власності в назвах і числа, схожі на податкові. Збіг блокує виклик ще до мережі.',
            ],
            [
              'Шість ролей, один код',
              'У кожної ролі свій робочий простір. Технолог працює з чергою тестів, де немає комерційних даних.',
            ],
          ],
        },
      },
    },
  },
  {
    slug: 'nox',
    kind: 'private',
    repo: 'https://github.com/btw-hash/nox',
    video: true,
    poster: 'nox.webp',
    onStage: true,
    tour: {
      file: 'nox-tour-en',
      label: {
        en: 'The whole app in two and a half minutes, with the interface switched to English for the recording. Demo data; chat replies are replayed from a script.',
        uk: 'Увесь застосунок за дві з половиною хвилини, інтерфейс для запису перемкнено на англійську. Демо-дані; відповіді чату відтворено зі сценарію.',
      },
    },
    clips: [
      {
        file: 'nox-chat',
        label: {
          en: 'Chat: an answer with its steps, a result card, search across conversations',
          uk: 'Чат: відповідь із кроками, картка результату, пошук у всіх розмовах',
        },
      },
      {
        file: 'nox-events',
        label: {
          en: 'Events: signals grouped by source, read on sight, archived with a swipe',
          uk: 'Події: сигнали згруповані за джерелом, прочитане зникає саме, свайп прибирає в архів',
        },
      },
      {
        file: 'nox-watchdog',
        label: {
          en: 'Watchdog: one alert per outage, false alarms swallowed with a diagnosis',
          uk: 'Сторож: одна тривога на відключення, хибні тривоги заглушено з діагнозом',
        },
      },
      {
        file: 'nox-tasks',
        label: {
          en: 'Tasks and projects: today, deadlines, progress per project',
          uk: 'Задачі та проєкти: сьогодні, дедлайни, прогрес за проєктами',
        },
      },
      {
        file: 'nox-planner',
        label: {
          en: 'Planner: counters, checklists, a study journal, unfinished items carried over',
          uk: 'Щоденник: лічильники, списки, журнал навчання, незроблене переноситься саме',
        },
      },
      {
        file: 'nox-money',
        label: {
          en: 'Finances: shared recurring payments, who pays, what is overdue',
          uk: 'Фінанси: спільні регулярні платежі, хто платить, що прострочено',
        },
      },
      {
        file: 'nox-home',
        label: {
          en: 'Home: the power schedule, devices, the server and model limits',
          uk: 'Дім: графік світла, пристрої, сервер і ліміти моделі',
        },
      },
      {
        file: 'nox-mail',
        label: {
          en: 'Mail: what matters first, phishing quarantined, the reason for each verdict',
          uk: 'Пошта: важливе зверху, фішинг у карантині, причина кожного рішення',
        },
      },
      {
        file: 'nox-news',
        label: {
          en: 'News: a feed by topic with a short summary of each item',
          uk: 'Новини: стрічка за темами з коротким переказом кожної',
        },
      },
      {
        file: 'nox-content',
        label: {
          en: 'Content: drafts and scheduled posts for a Telegram channel',
          uk: 'Контент: чернетки та заплановані пости для Telegram-каналу',
        },
      },
    ],
    text: {
      en: {
        name: 'nox',
        title: ['A personal assistant', 'in daily use.'],
        line: 'A Telegram bot, an Android app and a background agent on a self-hosted server. It has run every day since April 2026.',
        stage:
          'A personal assistant in daily use: chat, events, a server watchdog and a planner in one phone app. Recorded on demo data.',
        problem:
          'Tasks, mail, client replies and server alerts arrive in different places, and most assistants are demos that nobody uses a month later.',
        built:
          'One assistant reachable from a chat and a phone app. Incoming signals become cards with one notification per batch. A watchdog monitors the server it runs on: one outage produces one alert, and a narrow set of repairs happens without a human.',
        proof: [
          ['In daily use since', 'April 2026'],
          ['Releases shipped through pull requests', '60'],
          ['Side effects', 'smoke-tested against the live system'],
        ],
        proofNote:
          'The recordings use a fictional owner and seeded data; the app is used in Ukrainian, and its interface was switched to English for the recordings.',
        facts: [
          ['Built with', 'TypeScript, grammY, SQLite, Claude Agent SDK'],
          ['Clients', 'Telegram, Android with over-the-air updates'],
          ['Code', 'Private; the showcase repository describes the design'],
        ],
        study: {
          plain:
            'One assistant for the small things that eat a day: tasks, mail that needs an answer, client messages, and the health of the server it runs on. It lives in Telegram and in a phone app, and it has been in daily use since April 2026.',
          steps: [
            [
              'Talk to it',
              'Ask in chat or by voice. The answer shows the steps it took and a result card.',
            ],
            [
              'Let it sort the noise',
              'Incoming signals arrive as grouped cards, one notification per batch.',
            ],
            [
              'Let it watch the server',
              'One outage gives one alert. A short list of repairs it carries out by itself.',
            ],
          ],
          flow: [
            { label: 'Clients', note: 'Telegram bot and an Android app' },
            { label: 'API', note: 'One door for every client' },
            { label: 'Core', note: 'Tasks, mail, events, planner' },
            { label: 'Memory and model', note: 'SQLite for state, Claude for reasoning' },
            { label: 'Watchdog', note: 'On a schedule: checks the server, repairs a narrow list' },
          ],
          flowNote: 'Speech is transcribed locally on a GPU before it reaches the model.',
          decisions: [
            [
              'One alert per outage',
              'While the server is known to be down, alerts about everything that depends on it are held back.',
            ],
            [
              'Repairs are a short, named list',
              'It may restart one named container. Anything wider waits for a person.',
            ],
            [
              'Unused features get deleted',
              'A usage audit over the full history retired ten modules that nobody opened.',
            ],
            [
              'The interface updates without reinstalling',
              'The Android shell is rebuilt only when native code changes; the rest arrives over the air.',
            ],
          ],
        },
      },
      uk: {
        name: 'nox',
        title: ['Особистий асистент', 'у щоденній роботі.'],
        line: 'Telegram-бот, застосунок для Android і фоновий агент на власному сервері. Працює щодня з квітня 2026 року.',
        stage:
          'Особистий асистент у щоденній роботі: чат, події, сторож сервера і щоденник в одному застосунку. Записано на демо-даних.',
        problem:
          'Завдання, пошта, відповіді клієнтів і тривоги сервера приходять у різні місця, а більшість асистентів — це демо, яким за місяць ніхто не користується.',
        built:
          'Один асистент, доступний із чату та з телефона. Вхідні сигнали стають картками з одним сповіщенням на пачку. Сторож стежить за сервером, на якому працює: одне відключення дає одну тривогу, а вузький набір ремонтів виконується без людини.',
        proof: [
          ['У щоденній роботі з', 'квітня 2026'],
          ['Релізи через pull request', '60'],
          ['Побічні дії', 'перевірені на живій системі'],
        ],
        proofNote: 'Записи зроблено на вигаданому власникові та демо-даних.',
        facts: [
          ['Стек', 'TypeScript, grammY, SQLite, Claude Agent SDK'],
          ['Клієнти', 'Telegram, Android з оновленням без перевстановлення'],
          ['Код', 'Приватний; архітектуру описано в репозиторії-вітрині'],
        ],
        study: {
          plain:
            'Один асистент для дрібниць, що з’їдають день: задачі, листи, які чекають відповіді, повідомлення клієнтів і стан сервера, на якому він сам працює. Живе в Telegram і в застосунку на телефоні, у щоденній роботі з квітня 2026 року.',
          steps: [
            [
              'Поговоріть з ним',
              'Запитайте в чаті або голосом. У відповіді видно кроки, які він зробив, і картку результату.',
            ],
            [
              'Дайте йому розібрати шум',
              'Вхідні сигнали приходять згрупованими картками, одне сповіщення на пачку.',
            ],
            [
              'Дайте йому стежити за сервером',
              'Одне відключення — одна тривога. Короткий перелік ремонтів він виконує сам.',
            ],
          ],
          flow: [
            { label: 'Клієнти', note: 'Telegram-бот і застосунок для Android' },
            { label: 'API', note: 'Одні двері для всіх клієнтів' },
            { label: 'Ядро', note: 'Задачі, пошта, події, щоденник' },
            { label: 'Пам’ять і модель', note: 'SQLite для стану, Claude для міркувань' },
            { label: 'Сторож', note: 'За розкладом: перевіряє сервер, лагодить вузький перелік' },
          ],
          flowNote: 'Мовлення розпізнається локально на відеокарті, перш ніж потрапити до моделі.',
          decisions: [
            [
              'Одна тривога на відключення',
              'Поки відомо, що сервер лежить, тривоги про все залежне від нього притримуються.',
            ],
            [
              'Ремонти — короткий іменований перелік',
              'Він може перезапустити один названий контейнер. Усе ширше чекає на людину.',
            ],
            [
              'Непотрібні функції видаляються',
              'Аудит використання за всю історію прибрав десять модулів, які ніхто не відкривав.',
            ],
            [
              'Інтерфейс оновлюється без перевстановлення',
              'Оболонку для Android перезбирають лише при зміні нативного коду; решта приходить повітрям.',
            ],
          ],
        },
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
        study: {
          plain:
            'You ask a question about your company documents and get a short answer. Next to each sentence is the exact line it came from. When the documents do not hold the answer, it says so instead of guessing.',
          steps: [
            [
              'Ask in your own words',
              'The question goes in the way a person would type it into a help chat.',
            ],
            [
              'Get an answer with its sources',
              'Each sentence links to the passage it rests on. One click highlights the quoted line in the document.',
            ],
            [
              'Or an honest "I do not know"',
              'A question the documents do not cover is refused. Nothing is filled in from general knowledge.',
            ],
          ],
          flow: [
            { label: 'Documents', note: 'Markdown, one chunk per heading' },
            { label: 'Search', note: 'BM25 picks the closest passages' },
            { label: 'Draft', note: 'Claims, each with a source and a quote' },
            { label: 'Check', note: 'The quote must be in the source, word for word' },
            {
              label: 'Answer',
              note: 'Only claims that passed',
              or: { label: 'Refusal', note: 'Nothing passed' },
            },
          ],
          flowNote:
            'The model path is covered by tests against a stubbed endpoint, including a fabricated quote that must be dropped. It has not been run against a live provider yet.',
          decisions: [
            [
              'The check is code, not a prompt',
              'String matching does not depend on the model behaving. A made-up quote is dropped every time.',
            ],
            [
              'Keyword search before embeddings',
              'BM25 needs no outside service, so the demo costs nothing to run. The index sits behind one class and can be swapped for embeddings or a hybrid.',
            ],
            [
              'The model is replaceable',
              'It sits behind one interface. Without a key the answer is assembled from the best-matching sentences, so the whole pipeline runs with no model at all.',
            ],
            [
              'The misses stay visible',
              'Two test questions fail and are shown on the demo page. They mark where keyword search stops.',
            ],
          ],
        },
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
        study: {
          plain:
            'Ви ставите запитання за документами компанії й отримуєте коротку відповідь. Поруч із кожним реченням видно рядок, з якого воно взяте. Якщо в документах відповіді немає, система так і каже, а не вигадує.',
          steps: [
            [
              'Запитайте своїми словами',
              'Запитання вводять так, як людина написала б у чат підтримки.',
            ],
            [
              'Отримайте відповідь із джерелами',
              'Кожне речення веде до фрагмента, на який спирається. Один клік підсвічує процитований рядок у документі.',
            ],
            [
              'Або чесне «не знаю»',
              'На запитання поза документами система відмовляє. Із загальних знань нічого не додається.',
            ],
          ],
          flow: [
            { label: 'Документи', note: 'Markdown, фрагмент на кожен заголовок' },
            { label: 'Пошук', note: 'BM25 знаходить найближчі фрагменти' },
            { label: 'Чернетка', note: 'Твердження з джерелом і цитатою' },
            { label: 'Перевірка', note: 'Цитата має бути в джерелі дослівно' },
            {
              label: 'Відповідь',
              note: 'Лише твердження, що пройшли',
              or: { label: 'Відмова', note: 'Не пройшло жодне' },
            },
          ],
          flowNote:
            'Шлях із моделлю покрито тестами на підставному сервері, зокрема з вигаданою цитатою, яку система має відкинути. На живому провайдері його ще не запускали.',
          decisions: [
            [
              'Перевіряє код, а не промпт',
              'Порівняння рядків не залежить від поведінки моделі. Вигадану цитату відкидає щоразу.',
            ],
            [
              'Пошук за словами до ембедингів',
              'BM25 не потребує зовнішніх сервісів, тож демо нічого не коштує. Індекс схований за одним класом, його можна замінити на ембединги чи гібрид.',
            ],
            [
              'Модель можна замінити',
              'Вона стоїть за одним інтерфейсом. Без ключа відповідь складається з найближчих речень, тож увесь ланцюжок працює й без моделі.',
            ],
            [
              'Промахи лишаються на видноті',
              'Два тестові запитання не проходять і показані на сторінці демо. Вони позначають межу пошуку за словами.',
            ],
          ],
        },
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
        study: {
          plain:
            'You upload an invoice and get its fields as data: vendor, dates, amounts, line items. Before you see them, code re-does the arithmetic. Anything that does not add up is marked with the reason, next to the line of the document it was read from.',
          steps: [
            [
              'Upload a PDF or paste text',
              'A sample invoice opens by default, one where the lines do not add up.',
            ],
            [
              'See what was read and what failed',
              'Every field has a status: ok, missing or inconsistent, with the reason in plain words.',
            ],
            [
              'Fix it and export',
              'Editing a value re-runs the checks at once. The checked result is copied as JSON.',
            ],
          ],
          flow: [
            { label: 'PDF', note: 'Text layer, lines rebuilt from positions' },
            { label: 'Read', note: 'Rules by default; a model is optional' },
            { label: 'Check', note: 'Arithmetic, dates and sources, in code' },
            { label: 'Review', note: 'A person fixes what is flagged' },
            { label: 'JSON', note: 'Exported after the review' },
          ],
          flowNote:
            'Scanned pages without a text layer are rejected; there is no OCR. The model path is tested against a stubbed endpoint and has not been run on a live provider yet.',
          decisions: [
            [
              'Reading and checking are separate',
              'Arithmetic does not depend on the reader behaving, so the same checks run on rules and on a model.',
            ],
            [
              'Rules first, model optional',
              'The default reader is deterministic and needs no key, so the demo is free and repeatable.',
            ],
            [
              'A person stays in the loop',
              'A wrong vendor name can still add up. The review screen exists for what arithmetic cannot catch.',
            ],
            [
              'Limits are written down',
              'Whole-number prices, wrapped descriptions and scanned pages are listed in the repository as known gaps.',
            ],
          ],
        },
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
        study: {
          plain:
            'Ви завантажуєте рахунок і отримуєте його поля як дані: постачальник, дати, суми, рядки. Перш ніж ви їх побачите, код перераховує арифметику. Усе, що не сходиться, позначено з причиною — поруч із рядком документа, з якого це прочитано.',
          steps: [
            [
              'Завантажте PDF або вставте текст',
              'За замовчуванням відкривається зразок рахунку, у якому рядки не сходяться.',
            ],
            [
              'Подивіться, що прочитано і що не пройшло',
              'Кожне поле має статус: гаразд, відсутнє або не сходиться, з поясненням простими словами.',
            ],
            [
              'Виправте й експортуйте',
              'Зміна значення одразу запускає перевірки знову. Перевірений результат копіюється як JSON.',
            ],
          ],
          flow: [
            { label: 'PDF', note: 'Текстовий шар, рядки відновлено за позиціями' },
            { label: 'Читання', note: 'Типово правила; модель за бажанням' },
            { label: 'Перевірка', note: 'Арифметика, дати й джерела — кодом' },
            { label: 'Рев’ю', note: 'Людина виправляє позначене' },
            { label: 'JSON', note: 'Експорт після перевірки людиною' },
          ],
          flowNote:
            'Скановані сторінки без текстового шару відхиляються: розпізнавання немає. Шлях із моделлю покрито тестами на підставному сервері, на живому провайдері його ще не запускали.',
          decisions: [
            [
              'Читання і перевірка розділені',
              'Арифметика не залежить від того, хто читав документ, тож ті самі перевірки працюють і для правил, і для моделі.',
            ],
            [
              'Спершу правила, модель за бажанням',
              'Типовий читач детермінований і не потребує ключа, тому демо безкоштовне й відтворюване.',
            ],
            [
              'Людина лишається в процесі',
              'Неправильна назва постачальника може сходитися арифметично. Екран рев’ю існує для того, чого арифметика не ловить.',
            ],
            [
              'Обмеження записані',
              'Ціни без копійок, перенесені описи та скановані сторінки перелічено в репозиторії як відомі прогалини.',
            ],
          ],
        },
      },
    },
  },
  {
    slug: 'vault-research-agent',
    kind: 'code',
    repo: 'https://github.com/btw-hash/vault-research-agent',
    video: true,
    poster: 'vault-research-agent.webp',
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
        study: {
          plain:
            'Ask one question of a large pile of notes and a single pass will miss half of it. This tool splits the question into parts, researches each part separately, writes one answer with its sources, and then grades its own answer. A weak answer is sent back for another try.',
          steps: [
            ['Ask a question', 'In the command line, in plain language.'],
            ['Watch it work', 'The plan, the parallel searches and the draft appear live.'],
            [
              'Get an answer with sources',
              'It is graded first; below the pass mark it is revised before you see it.',
            ],
          ],
          flow: [
            { label: 'Planner', note: 'Splits the question into 2 to 5 parts' },
            { label: 'Router', note: 'Quick, deep or impossible, per part' },
            { label: 'Workers', note: 'Search the notes in parallel through MCP' },
            { label: 'Synthesizer', note: 'One structured answer with sources' },
            { label: 'Judge', note: 'Scores it; a low score sends it back' },
          ],
          flowNote:
            'It runs from a clean clone with a bundled demo vault and a mock model, so no API key is needed to see the pipeline.',
          decisions: [
            [
              'A small model plans, a larger one writes',
              'Planning and routing use the fast model; synthesis and judging use the stronger one.',
            ],
            [
              '"Impossible" is a valid route',
              'A part the notes cannot answer is marked as such instead of being forced into an answer.',
            ],
            [
              'The notes are reached through a standard protocol',
              'Workers use MCP tools, so the same pipeline can be pointed at another source.',
            ],
            [
              'A score gates the run',
              'The evaluation set fails the run when the judged score drops below the threshold.',
            ],
          ],
        },
      },
      uk: {
        name: 'vault-research-agent',
        title: ['Кілька агентів,', 'одна відповідь із джерелами.'],
        line: 'Дослідницький конвеєр у командному рядку над сховищем нотаток: планувальник ділить запитання, виконавці шукають паралельно, суддя повертає слабкі відповіді.',
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
        study: {
          plain:
            'Якщо поставити одне запитання великій купі нотаток, за один прохід половину буде пропущено. Цей інструмент розбиває запитання на частини, досліджує кожну окремо, пише одну відповідь із джерелами, а потім сам її оцінює. Слабку відповідь повертає на доопрацювання.',
          steps: [
            ['Поставте запитання', 'У командному рядку, звичайною мовою.'],
            ['Дивіться, як він працює', 'План, паралельні пошуки й чернетка з’являються наживо.'],
            [
              'Отримайте відповідь із джерелами',
              'Спершу її оцінюють; нижче прохідного бала вона переписується ще до того, як ви її побачите.',
            ],
          ],
          flow: [
            { label: 'Планувальник', note: 'Ділить запитання на 2–5 частин' },
            { label: 'Маршрутизатор', note: 'Швидко, глибоко або неможливо — для кожної частини' },
            { label: 'Виконавці', note: 'Паралельно шукають у нотатках через MCP' },
            { label: 'Синтезатор', note: 'Одна структурована відповідь із джерелами' },
            { label: 'Суддя', note: 'Оцінює; низький бал повертає назад' },
          ],
          flowNote:
            'Запускається з чистого клону з демо-сховищем і підставною моделлю, тож побачити весь ланцюжок можна без API-ключа.',
          decisions: [
            [
              'Мала модель планує, більша пише',
              'Планування й маршрутизацію робить швидка модель; синтез і оцінку — сильніша.',
            ],
            [
              '«Неможливо» — теж маршрут',
              'Частину, на яку нотатки не відповідають, так і позначено, а не натягнуто на відповідь.',
            ],
            [
              'До нотаток — через стандартний протокол',
              'Виконавці користуються інструментами MCP, тож той самий ланцюжок можна спрямувати на інше джерело.',
            ],
            [
              'Бал є умовою проходження',
              'Набір для оцінки завалює запуск, коли бал судді падає нижче порога.',
            ],
          ],
        },
      },
    },
  },
  {
    slug: 'ua-mcp',
    kind: 'code',
    repo: 'https://github.com/btw-hash/ua-mcp',
    video: true,
    poster: 'ua-mcp.webp',
    onStage: false,
    text: {
      en: {
        name: 'ua-mcp',
        title: ['Ask the post and the bank', 'in plain words.'],
        line: 'One connector that lets an AI assistant track parcels, find a branch, price a delivery and read a bank statement across Nova Poshta, Ukrposhta and Monobank.',
        stage: '',
        problem:
          'An assistant that can call a delivery or banking API still fails on the question a person asks. "How much to send two kilos from Kyiv to Odesa" takes four calls and internal ids the user never sees.',
        built:
          'A server for the Model Context Protocol with seven tools shaped around questions: where the parcel is, which branch is open, what delivery costs and when it arrives, what was spent. Every tool only reads; nothing creates a waybill or moves money.',
        proof: [
          ['Tool choice', '23 of 23 test questions'],
          ['Live check', '5 calls to the real services pass'],
          ['Writes', 'none, by design'],
        ],
        proofNote:
          'The 23 questions and the tool descriptions were written by the same person, so that score is a regression check, not a field measurement. The Ukrposhta and personal Monobank tools are tested on saved answers only: no live token was used.',
        facts: [
          ['Built with', 'TypeScript, Model Context Protocol SDK'],
          ['Runs as', 'A local process next to Claude or any MCP client'],
          ['Good fit for', 'Shops, CRMs and support desks that ship in Ukraine'],
        ],
        study: {
          plain:
            'An AI assistant on its own cannot look up where a parcel is or what was paid yesterday. This connector gives it that ability for three Ukrainian services. You ask in ordinary words, in Ukrainian or English, and the assistant picks the right lookup itself.',
          steps: [
            [
              'Connect it once',
              'Add the server to Claude or another assistant; three lookups work with no keys at all.',
            ],
            [
              'Ask a normal question',
              '"Where is parcel 2045…?" or "What does two kilos to Odesa cost?"',
            ],
            [
              'Get a checked answer',
              'Status, address, price or total comes back as plain numbers, not codes.',
            ],
          ],
          flow: [
            { label: 'Question', note: 'In Ukrainian, Russian or English' },
            { label: 'Assistant', note: 'Picks one of seven tools and fills its fields' },
            { label: 'Connector', note: 'Turns city names into ids, checks limits' },
            { label: 'Service', note: 'Nova Poshta, Ukrposhta or Monobank' },
            { label: 'Answer', note: 'Hryvnias and dates, with "not found" said plainly' },
          ],
          flowNote:
            'A tool appears only when it can work: with no keys the assistant sees four tools, and the other three show up when their token is set.',
          decisions: [
            [
              'Questions, not endpoints',
              'One tool takes two city names and returns price and arrival date; the assistant never carries internal ids between calls.',
            ],
            [
              'Read-only',
              'No tool can create a waybill or move money, so an assistant can run them without asking each time.',
            ],
            [
              'Limits become advice',
              'The bank allows one personal request a minute; the connector says "wait a minute" instead of failing.',
            ],
            [
              'The live check earned its place',
              'Calling the real service caught a bug the saved answers hid: parcel lockers were lost behind a page of branches.',
            ],
          ],
        },
      },
      uk: {
        name: 'ua-mcp',
        title: ['Питайте пошту й банк', 'звичайними словами.'],
        line: 'Один конектор, з яким ШІ-асистент відстежує посилки, знаходить відділення, рахує вартість доставки й читає банківську виписку: Нова Пошта, Укрпошта, Monobank.',
        stage: '',
        problem:
          'Асистент, який уміє викликати API доставки чи банку, все одно спотикається на запитанні людини. «Скільки коштує відправити два кілограми з Києва до Одеси» — це чотири виклики й внутрішні ідентифікатори, яких користувач ніколи не бачить.',
        built:
          'Сервер для Model Context Protocol із сімома інструментами, побудованими навколо запитань: де посилка, яке відділення працює, скільки коштує доставка й коли вона приїде, на що витрачено гроші. Усі інструменти лише читають; жоден не створює накладну й не переказує гроші.',
        proof: [
          ['Вибір інструмента', '23 із 23 тестових запитань'],
          ['Перевірка наживо', '5 викликів справжніх сервісів проходять'],
          ['Запис', 'немає, так задумано'],
        ],
        proofNote:
          'Ці 23 запитання й описи інструментів писала одна людина, тож результат є регресійною перевіркою, а не польовим вимірюванням. Інструменти Укрпошти й особистого Monobank перевірено лише на збережених відповідях: справжніх токенів не використовували.',
        facts: [
          ['Стек', 'TypeScript, Model Context Protocol SDK'],
          ['Запуск', 'Локальний процес поруч із Claude чи іншим MCP-клієнтом'],
          ['Кому підійде', 'Магазинам, CRM і підтримці, що доставляють по Україні'],
        ],
        study: {
          plain:
            'Сам по собі ШІ-асистент не може подивитися, де посилка чи що вчора списали з картки. Цей конектор дає йому таку можливість для трьох українських сервісів. Ви питаєте звичайними словами, українською чи англійською, а асистент сам обирає потрібний запит.',
          steps: [
            [
              'Під’єднайте один раз',
              'Додайте сервер до Claude чи іншого асистента; три запити працюють узагалі без ключів.',
            ],
            [
              'Поставте звичайне запитання',
              '«Де посилка 2045…?» або «Скільки коштує два кілограми до Одеси?»',
            ],
            [
              'Отримайте перевірену відповідь',
              'Статус, адреса, ціна чи сума повертаються звичайними числами, а не кодами.',
            ],
          ],
          flow: [
            { label: 'Запитання', note: 'Українською, російською чи англійською' },
            { label: 'Асистент', note: 'Обирає один із семи інструментів і заповнює поля' },
            {
              label: 'Конектор',
              note: 'Перетворює назви міст на ідентифікатори, перевіряє обмеження',
            },
            { label: 'Сервіс', note: 'Нова Пошта, Укрпошта або Monobank' },
            { label: 'Відповідь', note: 'Гривні й дати, а «не знайдено» сказано прямо' },
          ],
          flowNote:
            'Інструмент з’являється лише тоді, коли може працювати: без ключів асистент бачить чотири інструменти, а решта три додаються разом зі своїм токеном.',
          decisions: [
            [
              'Запитання, а не методи API',
              'Один інструмент приймає назви двох міст і повертає ціну й дату прибуття; асистент не переносить внутрішні ідентифікатори між викликами.',
            ],
            [
              'Лише читання',
              'Жоден інструмент не створює накладну й не переказує гроші, тож асистент може викликати їх без запиту щоразу.',
            ],
            [
              'Обмеження стають порадою',
              'Банк дозволяє один особистий запит на хвилину; конектор каже «зачекайте хвилину», а не падає.',
            ],
            [
              'Перевірка наживо себе виправдала',
              'Виклик справжнього сервісу виявив помилку, якої не було видно на збережених відповідях: поштомати губилися за сторінкою відділень.',
            ],
          ],
        },
      },
    },
  },
  {
    slug: 'benchmark-cc',
    kind: 'code',
    repo: 'https://github.com/btw-hash/benchmark-cc',
    video: true,
    poster: 'benchmark-cc.webp',
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
          ['Judged quality across setups', '9.3 to 9.5 of 10'],
        ],
        proofNote:
          'The finding is unglamorous: on isolated tasks configuration barely moved quality, while the richest setup cost about 20% more per run.',
        facts: [
          ['Built with', 'Node.js, Claude Code'],
          ['Output', 'A report with per-task tables'],
          ['Good fit for', 'Teams standardizing how they use coding agents'],
        ],
        study: {
          plain:
            'People add instructions, agents and skills to their AI coding assistant and judge the result by feel. This harness runs the same tasks under each setup and measures what actually changed: quality, time and cost.',
          steps: [
            [
              'Define the setups',
              'From an empty baseline to a full stack of instructions, agents and skills.',
            ],
            [
              'Run the same tasks under each',
              'Every run is isolated, and its tokens, time and cost are recorded.',
            ],
            [
              'Read the report',
              'A model judges the quality, and the report puts the setups side by side.',
            ],
          ],
          flow: [
            { label: 'Tasks', note: '13, each isolated' },
            { label: 'Setups', note: '7 configurations' },
            { label: 'Runs', note: '390, with tokens, time and cost' },
            { label: 'Judge', note: 'A model scores the quality' },
            { label: 'Report', note: 'Tables per setup and per task' },
          ],
          decisions: [
            [
              'Isolated tasks',
              'Each run starts clean, so one setup cannot benefit from what another left behind.',
            ],
            [
              'Several samples per pair',
              'Runs are repeated to see the spread, not one lucky result.',
            ],
            [
              'The dull result is published as is',
              'On these tasks configuration barely moved quality, and the richest setups cost about 20% more per run.',
            ],
          ],
        },
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
          ['Оцінка якості за конфігураціями', 'від 9,3 до 9,5 з 10'],
        ],
        proofNote:
          'Висновок непоказний: на ізольованих завданнях налаштування майже не змінили якість, а найбагатша конфігурація коштувала приблизно на 20% більше за прогін.',
        facts: [
          ['Стек', 'Node.js, Claude Code'],
          ['Результат', 'Звіт із таблицями за кожним завданням'],
          ['Кому підійде', 'Командам, що стандартизують роботу з агентами'],
        ],
        study: {
          plain:
            'Люди додають до свого ШІ-асистента для коду інструкції, агентів і навички, а результат оцінюють на око. Цей стенд запускає ті самі задачі на кожній конфігурації й вимірює, що насправді змінилося: якість, час і вартість.',
          steps: [
            [
              'Опишіть конфігурації',
              'Від порожньої бази до повного набору інструкцій, агентів і навичок.',
            ],
            [
              'Запустіть ті самі задачі на кожній',
              'Кожен запуск ізольований; записуються токени, час і вартість.',
            ],
            ['Прочитайте звіт', 'Якість оцінює модель, а звіт ставить конфігурації поруч.'],
          ],
          flow: [
            { label: 'Задачі', note: '13, кожна ізольована' },
            { label: 'Конфігурації', note: '7 варіантів' },
            { label: 'Запуски', note: '390, з токенами, часом і вартістю' },
            { label: 'Суддя', note: 'Модель оцінює якість' },
            { label: 'Звіт', note: 'Таблиці за конфігураціями та задачами' },
          ],
          decisions: [
            [
              'Ізольовані задачі',
              'Кожен запуск починається з чистого стану, тож одна конфігурація не користується залишками іншої.',
            ],
            [
              'Кілька проб на пару',
              'Запуски повторюються, щоб бачити розкид, а не один щасливий результат.',
            ],
            [
              'Нудний результат опубліковано як є',
              'На цих задачах конфігурація майже не змінила якість, а найбагатші набори коштували приблизно на 20% більше за запуск.',
            ],
          ],
        },
      },
    },
  },
  {
    slug: 'studio-site-v1',
    kind: 'live',
    demo: 'https://v1.btwstudio.dev',
    repo: 'https://github.com/btw-hash/btw-site',
    video: false,
    poster: 'studio-site-v1.webp',
    onStage: false,
    text: {
      en: {
        name: 'studio-site-v1',
        title: ['Our previous site,', 'with a 3D scene.'],
        line: 'The first version of the studio site: a live 3D shape in the hero, editorial layout and two languages. Kept online as an archive.',
        stage: '',
        problem:
          'A studio site that has to stand out among template landing pages without turning into a slow tech demo.',
        built:
          'A dark editorial site with a three-dimensional iridescent shape rendered in the browser, motion tuned section by section, case studies and an English and Ukrainian version. It runs in a self-hosted container behind a tunnel.',
        proof: [
          ['3D scene', 'rendered live in the browser'],
          ['Languages', 'English and Ukrainian'],
          ['Status', 'archived version, still online'],
        ],
        facts: [
          ['Built with', 'Next.js 15, React 19, react-three-fiber, Framer Motion'],
          ['Runs as', 'A self-hosted container'],
          ['Good fit for', 'Brand sites and launches that need a visual hook'],
        ],
        study: {
          plain:
            'The first version of this studio site, kept online as an archive. It bet on a visual hook: a live three-dimensional shape at the top and motion in every section.',
          steps: [
            ['Open it', 'The page loads with a 3D shape rendered live in the browser.'],
            ['Scroll', 'Each section has its own motion.'],
            ['Switch the language', 'There is an English and a Ukrainian version.'],
          ],
          flow: [
            { label: 'Pages', note: 'Next.js, two languages' },
            { label: '3D scene', note: 'react-three-fiber, rendered in the browser' },
            { label: 'Motion', note: 'Framer Motion, tuned per section' },
            { label: 'Container', note: 'Self-hosted' },
            { label: 'Tunnel', note: 'A public address without open ports' },
          ],
          decisions: [
            [
              'Why it was replaced',
              'The new site leads with recordings of working projects instead of a visual effect.',
            ],
            [
              'Why it stays online',
              'It is a piece of work in its own right: a 3D scene, motion and two languages.',
            ],
          ],
        },
      },
      uk: {
        name: 'studio-site-v1',
        title: ['Наш попередній сайт', 'із 3D-сценою.'],
        line: 'Перша версія сайту студії: жива 3D-фігура на головній, редакційна верстка і дві мови. Залишена онлайн як архів.',
        stage: '',
        problem:
          'Сайт студії має вирізнятися серед шаблонних лендингів і при цьому не перетворитися на повільне техно-демо.',
        built:
          'Темний редакційний сайт із тривимірною райдужною фігурою, яку малює браузер, з анімацією, налаштованою для кожного розділу, кейсами та англійською й українською версіями. Працює у власному контейнері за тунелем.',
        proof: [
          ['3D-сцена', 'малюється наживо в браузері'],
          ['Мови', 'англійська та українська'],
          ['Стан', 'архівна версія, досі онлайн'],
        ],
        facts: [
          ['Стек', 'Next.js 15, React 19, react-three-fiber, Framer Motion'],
          ['Запуск', 'Власний контейнер'],
          ['Кому підійде', 'Сайти брендів і запуски, яким потрібен візуальний гачок'],
        ],
        study: {
          plain:
            'Перша версія сайту студії, збережена онлайн як архів. Вона робила ставку на візуальний гачок: жива тривимірна фігура вгорі та рух у кожній секції.',
          steps: [
            ['Відкрийте', 'Сторінка завантажується з 3D-фігурою, яку браузер малює наживо.'],
            ['Прокрутіть', 'У кожної секції власний рух.'],
            ['Перемкніть мову', 'Є англійська та українська версії.'],
          ],
          flow: [
            { label: 'Сторінки', note: 'Next.js, дві мови' },
            { label: '3D-сцена', note: 'react-three-fiber, малюється в браузері' },
            { label: 'Рух', note: 'Framer Motion, налаштований для кожної секції' },
            { label: 'Контейнер', note: 'На власному сервері' },
            { label: 'Тунель', note: 'Публічна адреса без відкритих портів' },
          ],
          decisions: [
            [
              'Чому його замінили',
              'Новий сайт починає із записів робочих проєктів, а не з візуального ефекту.',
            ],
            ['Чому він лишається онлайн', 'Це самостійна робота: 3D-сцена, рух і дві мови.'],
          ],
        },
      },
    },
  },
];

export const ui = {
  en: {
    htmlLang: 'en',
    siteTitle: 'BTW Studio — AI subcontractor for agencies and studios',
    siteDesc:
      'We build assistants, document automation and agents for agencies and their clients, under the agency brand. Live demos you can open.',
    tagline: 'White-label AI for agencies',
    nav: { work: 'Work', method: 'How it works', brief: 'Get a proposal' },
    hero: ['Your client asked for AI.', 'We build that part.'],
    sub: 'You sell the project and run the client. We build the assistant, the document automation or the agent and hand it over tested and deployed.',
    cta: {
      label: 'Get a proposal',
      note: 'Scope, timeline and price in one working day.',
    },
    stageTitle: 'Open what we built and try it yourself',
    task: {
      'crm-pro': 'Sales CRM with an assistant',
      citewise: 'Answers from company documents',
      docfields: 'Invoices into checked data',
      'agent-dashboard': 'Live view of AI agents',
      nox: 'Personal assistant',
    },
    stageGroup: 'Project',
    kind: { live: 'live demo', code: 'open source', private: 'private code' },
    open: 'Open the demo',
    code: 'Read the code',
    how: 'How it was built',
    benefits: {
      title: 'Your brand, your client, your invoice',
      items: [
        ['Your brand only', 'We work under NDA and never contact your client.'],
        [
          'Fixed price before we start',
          'Scope and price are agreed in writing, so you know your margin on day one.',
        ],
        [
          'Tested and deployed',
          'A working feature, not a prototype: the tests pass and we have run it live.',
        ],
        [
          'No lock-in to one AI provider',
          'If prices or quality change, we swap the model without rebuilding the project.',
        ],
      ],
    },
    compare: {
      title: 'Three ways to deliver the AI part',
      cols: ['Subcontract it to us', 'Hire an engineer', 'Buy a ready-made platform'],
      rows: [
        [
          'Start',
          'As soon as the scope is agreed',
          'After you find and onboard the person',
          'The same day',
        ],
        [
          'Cost',
          'One fixed price for the project',
          'A salary every month, with or without AI work',
          'A subscription for as long as the client uses it',
        ],
        [
          'Fit to the task',
          "Built around the client's task and data",
          'Whatever one person can build',
          'What the platform allows',
        ],
        [
          'What stays with you',
          'The code, in your repository',
          'The code and a role to keep filled',
          'An account with the vendor',
        ],
      ],
      note: 'A platform is the right choice for a standard task. Hiring pays off when AI work comes every month. We are for the projects in between.',
    },
    fit: {
      title: 'What we take and what we do not',
      yes: {
        title: 'We take',
        items: [
          'One AI feature inside your client project: an assistant, document automation or an agent.',
          'Work under your brand and an NDA, invoiced to your agency.',
          'A task whose scope can be written down before the start.',
        ],
      },
      no: {
        title: 'We do not take',
        items: [
          'Hourly work or an engineer on loan with no agreed scope.',
          'Whole websites, design or marketing. That part stays with your agency.',
          'Projects where we would have to talk to your client directly.',
        ],
      },
    },
    sample: {
      link: 'See a sample proposal',
      title: ['A sample proposal.', 'This is what you get.'],
      desc: 'What a BTW Studio proposal contains: the task, what we build, what is left out, stages, acceptance and handover.',
      lead: 'You get a document like this within one working day after you write to us. The client and the project below are invented. The structure is the one we use.',
      badge: 'Example, invented project',
      name: 'An assistant for a network of three clinics',
      request: 'The request',
      sections: [
        [
          'What we build',
          [
            'An assistant on the clinic site that answers questions about services and prices from the price list and the clinic documents, and shows the source of every answer.',
            'Booking: the assistant collects the service, the clinic, a convenient time and a contact, and passes the request to the administrator.',
            'A handoff to a person when the answer is not in the documents. The assistant says so instead of guessing.',
            'A page where the clinic staff replace the price list themselves, without us.',
          ],
        ],
        [
          'What is left out',
          [
            'Medical advice and diagnoses. The assistant answers about services, prices and visits only.',
            'The design and the rest of the site. That part stays with your agency.',
            'Phone calls and messengers. This project covers the site; other channels are estimated separately.',
          ],
        ],
        [
          'Stages and what you see after each',
          [
            'Answers from documents. You get a link where you ask questions and see the sources.',
            "Booking and handoff. A test request arrives in the administrator's inbox.",
            'Launch on the client site. The assistant works on the live site under your brand.',
            'Every week you get a written report you can forward to your client.',
          ],
        ],
        [
          'How the work is accepted',
          [
            'Before the start we agree a list of test questions with you.',
            'The assistant answers each of them from the documents and shows the source.',
            'A question outside the documents gets a handoff to a person, not a guess.',
            'A booking request reaches the administrator with every field filled.',
          ],
        ],
        [
          'What your agency gets',
          [
            'The code in your repository, with all rights after payment.',
            'The assistant deployed and running on the client site.',
            'Tests that pass, and a short guide for the clinic staff.',
            '30 days of free fixes after handover.',
          ],
        ],
      ],
      price: [
        'Timeline and price',
        'In a real proposal this section holds one date and one fixed price. Both depend on the task, so we name them in the reply to your message, not on the site. Payment: half before the start, half at handover.',
      ],
      cta: 'Get a proposal for your project',
    },
    orders: {
      title: 'See what your client could order',
      example: 'Working example',
      note: "Don't see your case? Describe it in two sentences.",
      items: [
        {
          tag: 'Assistant',
          title: "An assistant on the client's site",
          text: 'It answers from the price list and company documents, and shows the source of every answer.',
          slug: 'citewise',
        },
        {
          tag: 'Document automation',
          title: 'Documents into checked data',
          text: 'Invoices are read into fields. Every total is re-computed and shown next to the line it came from.',
          slug: 'docfields',
        },
        {
          tag: 'Agent',
          title: 'An agent for a routine job',
          text: 'It works in the background, and the team sees who is working, on what, and who is stuck.',
          slug: 'agent-dashboard',
        },
      ],
    },
    steps: {
      title: 'From your brief to a deployed feature in four steps',
      note: 'Step one takes a sentence.',
      items: [
        [
          'You send the request',
          'A sentence is enough. Within one working day you get scope, timeline and price in writing.',
        ],
        [
          'We agree the scope',
          'What we build and what we leave out is written down first. Half is paid before the start.',
        ],
        [
          'We build and test',
          'We work in your repository. Every week you get a written report you can forward to your client.',
        ],
        [
          'We hand it over',
          'All rights to the code pass to your agency. The second half is paid at handover.',
        ],
      ],
    },
    other: {
      title: 'Not an agency?',
      text: 'Product teams hire us for the same work. We build the feature in your repository and leave it with tests and notes your engineers can follow.',
    },
    moreWork: 'More of our work',
    workNote:
      'These are our own products. We built them so you can test our work before you hire us.',
    promises: {
      title: 'Four promises in writing',
      items: [
        ['The price holds', 'After we agree on the scope, it does not change.'],
        [
          'The deadline is in writing',
          'If it is at risk, we tell you in advance and name a new date.',
        ],
        ['30 days of fixes', 'Any defect found within 30 days of handover is fixed at no cost.'],
        ['Your client stays yours', 'We never contact your client.'],
      ],
    },
    faq: {
      more: 'Still have a question?',
      moreTg: 'Ask us in Telegram',
      title: 'Questions agencies ask first',
      items: [
        [
          'Who owns the code?',
          'You do. The code is in your repository from the first day, and after payment all rights to it pass to your agency.',
        ],
        [
          "Where does our client's data go?",
          'Only to the AI provider we agree on with you. We do not keep client data after the project is handed over.',
        ],
        [
          'How is payment arranged?',
          'Half after we agree on the scope, half at handover. We invoice your agency, never your client.',
        ],
        [
          'What if the client changes the task midway?',
          'We estimate the change in writing before any work on it starts.',
        ],
        [
          'Who supports the project after handover?',
          'Fixes are free for 30 days. After that, support and new features go by a separate written agreement.',
        ],
        [
          'What if you cannot continue mid-project?',
          'One engineer leads the work and brings in contractors for separate parts. The code is in your repository from the first day, so everything built is already yours. If we cannot continue, we tell you the same day.',
        ],
      ],
    },
    privacy: {
      link: 'Privacy',
      title: 'Privacy',
      desc: 'What BTW Studio keeps when you send a brief, and how to have it deleted.',
      lead: 'This page says what happens to a message you send us. It is short because we keep very little.',
      items: [
        [
          'What we receive',
          'The text of your message, the email or Telegram handle you leave for the reply, the language of the page and the time of sending. The same applies when you write to our Telegram bot.',
        ],
        [
          'Where it goes',
          'The message is delivered to us through Telegram, and a copy is kept on our own server. Nobody else gets it.',
        ],
        [
          'What we use it for',
          'Only to reply to you and, if we work together, to do the work you asked for.',
        ],
        [
          'Cookies and counting',
          'The site sets no cookies. Visits are counted by Cloudflare Web Analytics, which works without cookies. Your address is used for a few minutes to limit repeated sends and is not saved.',
        ],
        [
          'How to have it deleted',
          'Reply to our answer or write to the Telegram bot, and we delete your message and contact from the server copy.',
        ],
      ],
      back: 'Back to the home page',
    },
    brief: {
      title: 'What do you need built?',
      promise:
        'You get a written reply within one working day: what we would build, how long it takes and what it costs.',
      what: 'What you need',
      whatPh:
        'Our client runs three clinics and wants an assistant on the site that books visits and answers from their price list.',
      reply: 'Email or Telegram for the reply',
      replyPh: 'name@yourstudio.com',
      send: 'Get a proposal',
      sending: 'Sending…',
      sent: {
        title: 'Received. Here is what happens next',
        items: [
          'We read your message. If something is unclear, we ask one or two questions at the contact you left.',
          'Within one working day you get a written proposal: scope, timeline and price.',
          'You decide. If it does not fit, you owe us nothing, not even a reply.',
        ],
        urgent: 'Urgent? Write to us in Telegram',
        again: 'Send another message',
      },
      tg: 'Or write to us in Telegram',
      data: 'We use your message only to reply to you.',
      aboutTitle: 'Who you are writing to',
      about:
        'BTW Studio works on Eastern European Time (UTC+2, UTC+3 in summer) and replies in English and Ukrainian. Your message goes to the people who build the work.',
      errors: {
        what: 'Describe what to build in at least a sentence.',
        reply: 'Leave an email or a messenger handle so we can answer.',
        rate: 'Too many messages from this address. Try again in a few minutes.',
        down: 'The form is not connected right now. Please reach us through GitHub below.',
        downTg: 'The form is not connected right now. Please use the Telegram link below.',
        fail: 'Could not send. Please try again in a minute.',
      },
    },
    bot: {
      hello:
        'Hi. Describe what you need in one message. You can paste a brief or forward a client email here.',
      when: 'Got it. One question so the estimate is right: is there a date it has to be ready by? Pick one or type the date.',
      whenMonth: 'Within a month',
      whenQuarter: 'In one to three months',
      whenOpen: 'No date yet',
      replyNoHandle:
        'Where do we reply? Your account has no public username, so type an email or a messenger handle.',
      done: 'Thanks. You will get a written scope, timeline and price within one working day.',
      textOnly: 'I can only read text for now. Paste the brief as a message.',
    },
    project: {
      back: 'All work',
      problem: 'The problem',
      built: 'What we built',
      proof: 'How we know it works',
      next: 'Next',
      cta: 'Need something like this? Send a brief',
      plain: 'In plain words',
      steps: 'How it works',
      hood: 'Under the hood',
      decisions: 'Decisions and why',
      or: 'or',
    },
    footer: { rights: 'BTW Studio', github: 'GitHub' },
    notFound: { title: 'This page does not exist.', back: 'Back to the work' },
    langName: 'Українською',
    theme: 'Dark theme',
  },
  uk: {
    htmlLang: 'uk',
    siteTitle: 'BTW Studio — ШІ-субпідрядник для агенцій і студій',
    siteDesc:
      'Робимо асистентів, обробку документів і агентів для агенцій та їхніх клієнтів, під брендом агенції. Живі демо, які можна відкрити.',
    tagline: 'ШІ під брендом вашої агенції',
    nav: { work: 'Роботи', method: 'Як це працює', brief: 'Отримати пропозицію' },
    hero: ['Клієнт попросив ШІ.', 'Цю частину зробимо ми.'],
    sub: 'Ви продаєте проєкт і ведете клієнта. Ми робимо асистента, обробку документів чи агента й передаємо вам протестованим і розгорнутим.',
    cta: {
      label: 'Отримати пропозицію',
      note: 'Обсяг, термін і ціна за один робочий день.',
    },
    stageTitle: 'Відкрийте те, що ми зробили, і спробуйте самі',
    task: {
      'crm-pro': 'CRM для продажів з асистентом',
      citewise: 'Відповіді за документами компанії',
      docfields: 'Рахунки в перевірені дані',
      'agent-dashboard': 'ШІ-агенти в реальному часі',
      nox: 'Особистий асистент',
    },
    stageGroup: 'Проєкт',
    kind: { live: 'живе демо', code: 'відкритий код', private: 'приватний код' },
    open: 'Відкрити демо',
    code: 'Переглянути код',
    how: 'Як це зроблено',
    benefits: {
      title: 'Ваш бренд, ваш клієнт, ваш рахунок',
      items: [
        ['Лише ваш бренд', 'Працюємо з NDA і ніколи не пишемо вашому клієнтові.'],
        [
          'Фіксована ціна до старту',
          'Обсяг і ціну погоджуємо письмово, тож свою маржу ви знаєте з першого дня.',
        ],
        [
          'Протестовано й розгорнуто',
          'Робоча функція, а не прототип: тести проходять, і ми запустили її наживо.',
        ],
        [
          "Без прив'язки до одного постачальника ШІ",
          'Якщо зміняться ціни чи якість, модель замінюємо без переробки проєкту.',
        ],
      ],
    },
    compare: {
      title: 'Три способи зробити ШІ-частину',
      cols: ['Передати нам', 'Найняти інженера', 'Купити готову платформу'],
      rows: [
        ['Старт', 'Щойно погоджено обсяг', 'Після пошуку й адаптації людини', 'Того ж дня'],
        [
          'Вартість',
          'Одна фіксована ціна за проєкт',
          'Зарплата щомісяця, є ШІ-робота чи ні',
          'Підписка, доки клієнт користується',
        ],
        [
          'Відповідність завданню',
          'Зроблено під завдання й дані клієнта',
          'Те, що вміє одна людина',
          'Те, що дозволяє платформа',
        ],
        [
          'Що лишається у вас',
          'Код у вашому репозиторії',
          'Код і посада, яку треба закривати',
          'Обліковий запис у постачальника',
        ],
      ],
      note: 'Платформа підходить для типового завдання. Найм виправданий, коли ШІ-робота є щомісяця. Ми робимо проєкти між цими двома випадками.',
    },
    fit: {
      title: 'Що ми беремо і чого не беремо',
      yes: {
        title: 'Беремо',
        items: [
          'Одну ШІ-функцію у вашому клієнтському проєкті: асистента, обробку документів або агента.',
          'Роботу під вашим брендом і з NDA, з рахунком на вашу агенцію.',
          'Завдання, обсяг якого можна записати до старту.',
        ],
      },
      no: {
        title: 'Не беремо',
        items: [
          'Погодинну роботу або інженера «в оренду» без погодженого обсягу.',
          'Сайти цілком, дизайн чи маркетинг. Ця частина лишається за вашою агенцією.',
          'Проєкти, де нам довелося б спілкуватися з вашим клієнтом напряму.',
        ],
      },
    },
    sample: {
      link: 'Подивитися зразок пропозиції',
      title: ['Зразок пропозиції.', 'Ось що ви отримаєте.'],
      desc: 'Що містить пропозиція BTW Studio: завдання, що ми робимо, що лишається поза межами, етапи, приймання й передача.',
      lead: 'Такий документ ви отримаєте протягом одного робочого дня після того, як напишете нам. Клієнт і проєкт нижче вигадані. Структура та сама, якою ми користуємося.',
      badge: 'Приклад, вигаданий проєкт',
      name: 'Асистент для мережі з трьох клінік',
      request: 'Запит',
      sections: [
        [
          'Що ми робимо',
          [
            'Асистента на сайті клініки, який відповідає на запитання про послуги й ціни за прайсом і документами клініки та показує джерело кожної відповіді.',
            'Запис на прийом: асистент збирає послугу, клініку, зручний час і контакт та передає заявку адміністраторові.',
            'Передачу людині, коли відповіді в документах немає. Асистент каже про це, а не вгадує.',
            'Сторінку, де працівники клініки самі замінюють прайс, без нас.',
          ],
        ],
        [
          'Що лишається поза межами',
          [
            'Медичні поради й діагнози. Асистент відповідає лише про послуги, ціни й запис.',
            'Дизайн і решта сайту. Ця частина лишається за вашою агенцією.',
            'Дзвінки й месенджери. Цей проєкт охоплює сайт; інші канали оцінюємо окремо.',
          ],
        ],
        [
          'Етапи і що ви бачите після кожного',
          [
            'Відповіді за документами. Ви отримуєте посилання, де ставите запитання й бачите джерела.',
            'Запис і передача людині. Тестова заявка надходить на пошту адміністратора.',
            'Запуск на сайті клієнта. Асистент працює на живому сайті під вашим брендом.',
            'Щотижня ви отримуєте письмовий звіт, який можна переслати клієнтові.',
          ],
        ],
        [
          'Як приймається робота',
          [
            'До старту погоджуємо з вами список тестових запитань.',
            'На кожне з них асистент відповідає за документами й показує джерело.',
            'На запитання поза документами асистент передає розмову людині, а не вгадує.',
            'Заявка на запис надходить адміністраторові з усіма заповненими полями.',
          ],
        ],
        [
          'Що отримує ваша агенція',
          [
            'Код у вашому репозиторії, з усіма правами після оплати.',
            'Асистента, розгорнутого на сайті клієнта.',
            'Тести, що проходять, і коротку інструкцію для працівників клініки.',
            '30 днів безкоштовних виправлень після передачі.',
          ],
        ],
      ],
      price: [
        'Термін і ціна',
        'У справжній пропозиції тут стоять одна дата й одна фіксована ціна. Обидві залежать від завдання, тож називаємо їх у відповіді на ваше повідомлення, а не на сайті. Оплата: половина до старту, половина під час передачі.',
      ],
      cta: 'Отримати пропозицію для вашого проєкту',
    },
    orders: {
      title: 'Подивіться, що міг би замовити ваш клієнт',
      example: 'Робочий приклад',
      note: 'Не знайшли свій випадок? Опишіть його двома реченнями.',
      items: [
        {
          tag: 'Асистент',
          title: 'Асистент на сайті клієнта',
          text: 'Відповідає за прайсом і документами компанії та показує джерело кожної відповіді.',
          slug: 'citewise',
        },
        {
          tag: 'Обробка документів',
          title: 'Документи в перевірені дані',
          text: 'Рахунки зчитуються в поля. Кожен підсумок перераховано й показано поруч із рядком-джерелом.',
          slug: 'docfields',
        },
        {
          tag: 'Агент',
          title: 'Агент для рутинної роботи',
          text: 'Працює у фоні, а команда бачить, хто працює, над чим і хто завис.',
          slug: 'agent-dashboard',
        },
      ],
    },
    steps: {
      title: 'Від вашого запиту до розгорнутої функції за чотири кроки',
      note: 'Для першого кроку досить одного речення.',
      items: [
        [
          'Ви надсилаєте запит',
          'Досить одного речення. Протягом робочого дня отримаєте обсяг, термін і ціну письмово.',
        ],
        [
          'Погоджуємо обсяг',
          'Що будуємо і що лишаємо поза межами, записуємо спершу. Половину сплачуєте до старту.',
        ],
        [
          'Будуємо й тестуємо',
          'Працюємо у вашому репозиторії. Щотижня ви отримуєте письмовий звіт, який можна переслати клієнтові.',
        ],
        [
          'Передаємо вам',
          'Усі права на код переходять вашій агенції. Другу половину сплачуєте під час передачі.',
        ],
      ],
    },
    other: {
      title: 'Ви не агенція?',
      text: 'Продуктові команди замовляють у нас ту саму роботу. Робимо функцію у вашому репозиторії й залишаємо її з тестами та нотатками, зрозумілими вашим інженерам.',
    },
    moreWork: 'Інші наші роботи',
    workNote:
      'Це наші власні продукти. Ми зробили їх, щоб ви могли перевірити нашу роботу до замовлення.',
    promises: {
      title: 'Чотири письмові обіцянки',
      items: [
        ['Ціна не змінюється', 'Після погодження обсягу вона лишається тією самою.'],
        [
          'Термін зафіксовано письмово',
          'Якщо він під загрозою, попереджаємо заздалегідь і називаємо нову дату.',
        ],
        [
          '30 днів виправлень',
          'Будь-який дефект, знайдений протягом 30 днів після передачі, виправляємо безкоштовно.',
        ],
        ['Ваш клієнт лишається вашим', 'Ми ніколи не пишемо вашому клієнтові.'],
      ],
    },
    faq: {
      more: 'Лишилося запитання?',
      moreTg: 'Запитайте в Telegram',
      title: 'Що агенції питають насамперед',
      items: [
        [
          'Кому належить код?',
          'Вам. Код від першого дня лежить у вашому репозиторії, а після оплати всі права на нього переходять вашій агенції.',
        ],
        [
          'Куди потрапляють дані нашого клієнта?',
          'Лише до постачальника ШІ, якого ми погодили з вами. Після передачі проєкту ми не зберігаємо дані клієнта.',
        ],
        [
          'Як відбувається оплата?',
          'Половина після погодження обсягу, половина під час передачі. Рахунок виставляємо вашій агенції, а не клієнтові.',
        ],
        [
          'Що, як клієнт змінить завдання посеред роботи?',
          'Зміну оцінюємо письмово до початку роботи над нею.',
        ],
        [
          'Хто підтримує проєкт після передачі?',
          'Виправлення безкоштовні 30 днів. Далі підтримка й нові функції йдуть за окремою письмовою домовленістю.',
        ],
        [
          'Що, як ви не зможете продовжити посеред проєкту?',
          'Роботу веде один інженер і залучає підрядників на окремі частини. Код від першого дня лежить у вашому репозиторії, тож усе зроблене вже ваше. Якщо ми не можемо продовжити, повідомляємо того ж дня.',
        ],
      ],
    },
    privacy: {
      link: 'Конфіденційність',
      title: 'Конфіденційність',
      desc: 'Що BTW Studio зберігає, коли ви надсилаєте бриф, і як це видалити.',
      lead: 'Ця сторінка пояснює, що відбувається з повідомленням, яке ви нам надсилаєте. Вона коротка, бо зберігаємо ми дуже мало.',
      items: [
        [
          'Що ми отримуємо',
          'Текст вашого повідомлення, пошту або нік у Telegram для відповіді, мову сторінки й час надсилання. Те саме стосується повідомлень нашому Telegram-боту.',
        ],
        [
          'Куди це потрапляє',
          'Повідомлення надходить до нас через Telegram, а копія зберігається на нашому власному сервері. Більше ніхто його не отримує.',
        ],
        [
          'Для чого ми це використовуємо',
          'Лише щоб відповісти вам і, якщо ми працюватимемо разом, виконати замовлену роботу.',
        ],
        [
          'Cookies і лічильник',
          'Сайт не ставить cookies. Відвідування рахує Cloudflare Web Analytics, який працює без cookies. Вашу адресу використовуємо кілька хвилин, щоб обмежити повторні надсилання, і не зберігаємо.',
        ],
        [
          'Як це видалити',
          'Дайте відповідь на наш лист або напишіть Telegram-боту, і ми видалимо ваше повідомлення та контакт із копії на сервері.',
        ],
      ],
      back: 'Повернутися на головну',
    },
    brief: {
      title: 'Що вам потрібно зробити?',
      promise:
        'Протягом робочого дня ви отримаєте письмову відповідь: що ми зробимо, скільки це триватиме і скільки коштуватиме.',
      what: 'Що вам потрібно',
      whatPh:
        'Наш клієнт має три клініки і хоче асистента на сайті, який записує на прийом і відповідає за прайсом.',
      reply: 'Email або Telegram для відповіді',
      replyPh: 'name@yourstudio.com',
      send: 'Отримати пропозицію',
      sending: 'Надсилаємо…',
      sent: {
        title: 'Отримали. Ось що буде далі',
        items: [
          'Читаємо ваше повідомлення. Якщо щось незрозуміло, поставимо одне-два запитання на залишений контакт.',
          'Протягом одного робочого дня ви отримаєте письмову пропозицію: обсяг, термін і ціна.',
          'Рішення за вами. Якщо не підійде, ви нам нічого не винні, навіть відповіді.',
        ],
        urgent: 'Терміново? Напишіть нам у Telegram',
        again: 'Надіслати ще одне повідомлення',
      },
      tg: 'Або напишіть нам у Telegram',
      data: 'Ваше повідомлення використовуємо лише для відповіді вам.',
      aboutTitle: 'Кому ви пишете',
      about:
        'BTW Studio працює за східноєвропейським часом (UTC+2, влітку UTC+3) і відповідає англійською та українською. Ваше повідомлення читають ті, хто виконує роботу.',
      errors: {
        what: 'Опишіть завдання хоча б одним реченням.',
        reply: 'Залиште пошту або нік у месенджері, щоб ми могли відповісти.',
        rate: 'Забагато повідомлень із цієї адреси. Спробуйте за кілька хвилин.',
        down: "Форма зараз не під'єднана. Напишіть нам через GitHub нижче.",
        downTg: "Форма зараз не під'єднана. Скористайтеся посиланням на Telegram нижче.",
        fail: 'Не вдалося надіслати. Спробуйте ще раз за хвилину.',
      },
    },
    bot: {
      hello:
        'Вітаю. Опишіть одним повідомленням, що вам потрібно. Можна вставити бриф або переслати сюди лист клієнта.',
      when: 'Зрозуміло. Одне запитання, щоб оцінка була точною: чи є дата, до якої це має бути готово? Оберіть варіант або напишіть дату.',
      whenMonth: 'Протягом місяця',
      whenQuarter: 'За один-три місяці',
      whenOpen: 'Дати ще немає',
      replyNoHandle:
        'Куди відповісти? У вашого акаунта немає публічного імені, тож напишіть пошту або нік у месенджері.',
      done: 'Дякуємо. Письмову оцінку з обсягом, терміном і ціною ви отримаєте протягом робочого дня.',
      textOnly: 'Поки що я читаю лише текст. Вставте бриф повідомленням.',
    },
    project: {
      back: 'Усі роботи',
      problem: 'Проблема',
      built: 'Що ми зробили',
      proof: 'Звідки відомо, що це працює',
      next: 'Далі',
      cta: 'Потрібне щось подібне? Надішліть бриф',
      plain: 'Простими словами',
      steps: 'Як це працює',
      hood: 'Як це влаштовано',
      decisions: 'Рішення і чому',
      or: 'або',
    },
    footer: { rights: 'BTW Studio', github: 'GitHub' },
    notFound: { title: 'Такої сторінки немає.', back: 'Повернутися до робіт' },
    langName: 'English',
    theme: 'Темна тема',
  },
} as const;

export type Ui = (typeof ui)[Lang];

export function findProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
