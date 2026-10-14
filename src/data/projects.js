// NOTE for future-Daron: when adding a project with status: "in-progress",
// write the outcome field as a specific goal/target (e.g. "targeting first
// page rank for local search terms"), not a generic "still in progress"
// placeholder — the card shows it as "Goal:" while the project is in progress,
// and as "Result:" once it's finished.
const projects = [
  {
    title: 'Cavite guide tourist SEO site',
    subtitle: 'Tourist guide covering every city in Cavite and its popular spots',
    category: 'websites',
    status: 'in-progress',
    outcome: 'Reach the first page of Google for local tourist searches',
    role: 'Planning and building a tourist guide with a page for each Cavite city and its popular tourist spots, set up to show up in Google searches.',
    note: 'A personal project to practice my SEO skills.',
    tags: ['SEO', 'Tailwindcss', 'Hardcoded']
  },
  {
    title: 'Tripitask landing page',
    subtitle: 'Landing page for an app that connects road travellers with local help',
    category: 'websites',
    status: 'finished',
    outcome: 'Delivered a landing page that works on both desktop and mobile.',
    role: "Built the landing page from the provided Figma design. The design wasn't made for mobile, so I built the mobile version myself.",
    tags: ['Figma', 'WordPress', 'Oxygen Builder']
  },
  {
    title: 'Yarrawise rebuild',
    subtitle: 'Full WordPress/Oxygen rebuild for a client site',
    category: 'websites',
    status: 'finished',
    outcome: 'Finished in 2 months, starting just 1 month into learning web development. It was a hiring challenge from the company, built to show I was ready for the role.',
    role: "Rebuilt the full site in WordPress with Oxygen Builder, matching the original design. I've learned to use the browser's inspect tool to read the exact sizes, spacing, and animations.",
    tags: ['WordPress', 'Oxygen Builder', 'ACF', 'Custom Post Types', 'Contact Form 7', 'Yoast SEO', 'LiteSpeed Cache', 'Wordfence']
  },
  {
    title: 'First-ever portfolio site',
    subtitle: 'Plain HTML/CSS personal introduction site',
    category: 'websites',
    status: 'finished',
    outcome: 'My first live website, and where I learned front-end basics. Since replaced by this site.',
    role: 'Designed and built it from scratch on my own, with no frameworks or templates, and published it on the web through GitHub.',
    tags: ['HTML', 'CSS', 'JavaScript', 'GitHub']
  },
  {
    title: 'CleanCo Australia',
    subtitle: 'WordPress + Shopify hybrid product database',
    category: 'database',
    status: 'finished',
    outcome: "Shopify became the store's product database, connected to the WordPress site through a custom API built by a senior developer on the team.",
    role: 'Entered and organized almost 500 products in Shopify, with price, description, category, sizes, and photos, so products only need to be entered once instead of on both platforms.',
    tags: ['WordPress', 'Oxygen Builder', 'Shopify']
  },
  {
    title: 'Hotdish PH',
    subtitle: 'Product database managed through Shopify',
    category: 'database',
    status: 'finished',
    outcome: "Shopify became the store's product database, connected to the WordPress site through a custom API built by a senior developer on the team.",
    role: 'Entered and organized almost 100 products in Shopify, with price, description, category, sizes, and photos, so products only need to be entered once instead of on both platforms.',
    tags: ['WordPress', 'Oxygen Builder', 'Shopify']
  },
  {
    title: 'Contact form and anonymous notes',
    subtitle: "Automation behind this site's contact form and anonymous notes",
    category: 'automation',
    status: 'finished',
    outcome: 'Spam gets blocked, flagged messages are held for review, and real messages reach me right away.',
    role: "Built the system behind this site's contact form and anonymous notes. It filters out spam and bots, limits visitors to 3 messages a day, uses AI to screen submissions for harmful content, saves everything to a database, and sends me notifications through Telegram and Messenger.",
    tags: ['n8n', 'Supabase', 'reCAPTCHA', 'Gemini', 'Telegram Bot', 'Messenger']
  },
  {
    title: 'Spotify sync',
    subtitle: "Automation that keeps this site's Spotify stats up to date",
    category: 'automation',
    status: 'finished',
    outcome: 'The "Most Played on Spotify" section on my About page updates by itself every month.',
    role: 'Built an automation that pulls my top Spotify artists and tracks once a month and saves them to a database, which the About page on this site reads. If a run fails, it sends me a Telegram alert.',
    tags: ['n8n', 'Spotify API', 'Supabase', 'Telegram Bot']
  },
  {
    title: 'AI news briefing bot',
    subtitle: 'Automation that sends a daily, AI-filtered news summary on Telegram',
    category: 'automation',
    status: 'finished',
    outcome: 'Runs automatically every day, keeping subscribers up to date with the news that matters.',
    role: 'Built an automation that collects news from around 7 trusted sources, uses AI to filter out unnecessary stories and write a short summary, and sends it to subscribers every day through Telegram. It keeps track of its subscribers in a database and runs on its own on free hosting.',
    tags: ['n8n', 'Telegram Bot', 'Groq LLM', 'Supabase', 'Render']
  },
  {
    title: 'YouTube clip finder automation',
    subtitle: 'Automation that finds short clip ideas in long YouTube videos',
    category: 'automation',
    status: 'finished',
    outcome: 'Replaces scrubbing through long videos by hand with a ready list of clip ideas.',
    role: "Built an automation that reads the transcript of a long YouTube video, uses AI to pick the moments most likely to go viral as short clips, and saves them to a Google Sheet with the timestamps, what happens in each clip, and the AI's reason for picking it.",
    tags: ['n8n', 'Supadata API', 'Groq LLM', 'Google Sheets']
  }
]

export default projects