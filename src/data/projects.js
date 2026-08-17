// NOTE for future-Daron: when adding a project with status: "in-progress",
// write the outcome field as a specific goal/target (e.g. "targeting first
// page rank for local search terms"), not a generic "still in progress"
// placeholder — the row/modal outcome line is meant to say what you're
// actually aiming for, not just restate the status.
const projects = [
  {
    title: 'Tagaytay tourist SEO site',
    subtitle: 'SEO-focused site covering Tagaytay tourist destinations',
    category: 'websites',
    status: 'in-progress',
    outcome: 'Targeting first page rank for local search terms',
    role: 'TBD',
    note: 'Details still being worked out',
    tags: ['SEO', 'WordPress']
  },
  {
    title: 'tripitask.com landing page',
    subtitle: 'Landing page for a task/service platform',
    category: 'websites',
    status: 'finished',
    outcome: 'Delivered a fully responsive landing page, including a mobile version',
    role: 'Built the landing page from Figma designs',
    note: 'Client project',
    tags: ['Figma', 'WordPress', 'Oxygen Builder']
  },
  {
    title: 'Yarrawise.com rebuild',
    subtitle: 'Full WordPress/Oxygen rebuild for a client site',
    category: 'websites',
    status: 'finished',
    outcome: 'Rebuilt the entire site from scratch on a new platform',
    role: 'Recreated the site from scratch using WordPress + Oxygen Builder',
    note: 'Client project',
    tags: ['WordPress', 'Oxygen Builder']
  },
  {
    title: 'First-ever portfolio site',
    subtitle: 'Plain HTML/CSS personal introduction site',
    category: 'websites',
    status: 'finished',
    outcome: 'First live personal site — the starting point for learning front-end fundamentals',
    role: 'Designed and built solo, no frameworks',
    note: 'About Me, Skills, Hobbies, Experience, and a Contact form section',
    tags: ['HTML', 'CSS']
  },
  {
    title: 'CleanCo Australia',
    subtitle: 'WordPress + Shopify hybrid product database',
    category: 'database',
    status: 'finished',
    outcome: 'Replaced manual product entry across two platforms',
    role: 'Managed the product database — details, listings, and data structure',
    note: 'The two platforms were connected via a custom API, built by a senior developer on the team',
    tags: ['WordPress', 'Oxygen Builder', 'Shopify']
  },
  {
    title: 'Hotdish PH',
    subtitle: 'Product database managed through Shopify',
    category: 'database',
    status: 'finished',
    outcome: 'Streamlined product listings and data management',
    role: 'Managed the product database — listings, details, and data structure',
    note: 'Client project',
    tags: ['Shopify']
  },
  {
    title: 'YouTube clip finder automation',
    subtitle: 'AI tool that finds standout moments in long videos',
    category: 'automation',
    status: 'finished',
    outcome: 'Built for his own YouTube automation channel',
    role: 'Built a tool that scans long YouTube videos and picks out the most interesting short clips using AI',
    note: 'Personal project',
    tags: ['n8n', 'Supadata API', 'Groq LLM', 'Google Sheets']
  },
  {
    title: 'AI news briefing bot',
    subtitle: 'AI-powered Telegram bot summarizing daily news',
    category: 'automation',
    status: 'finished',
    outcome: 'Automatically broadcasts daily briefings to subscribers',
    role: 'Built a Telegram bot that pulls news from multiple RSS sources and summarizes it with an LLM',
    note: 'Personal project',
    tags: ['n8n', 'Telegram Bot', 'Groq LLM', 'Supabase', 'Render']
  }
]

export default projects