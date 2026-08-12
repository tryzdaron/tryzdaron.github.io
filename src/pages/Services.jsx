import { Link } from 'react-router-dom'

function Services() {
  const services = [
    {
      symbol: '</>',
      title: 'Web Development',
      description: 'Sites built on WordPress and Shopify, or fully custom-coded when a template can\'t do what you need.',
      details: [
        'WordPress builds using Oxygen Builder, ACF, and custom post types',
        'Shopify storefronts — theme customization or full custom builds',
        'Fully custom-coded sites (HTML/CSS/JS, PHP, React) for projects that need more control than a builder allows',
        'Responsive, mobile-first layouts on every project'
      ],
      link: '/contact?service=web-development'
    },
    {
      symbol: '⚙',
      title: 'Automation & Workflows',
      description: 'Connecting your tools together so the repetitive parts of your business run themselves.',
      details: [
        'n8n workflows — from simple triggers to multi-step automations with conditional logic',
        'GoHighLevel setup and automation for agencies and service businesses',
        'Zapier and Make.com automations for lighter-weight integrations',
        'AI/LLM integrations (Groq, OpenAI-compatible APIs) for summarization, content generation, and data processing tasks'
      ],
      link: '/contact?service=automation'
    },
    {
      symbol: '[SEO]',
      title: 'SEO',
      description: 'Helping sites get found — technical fixes and on-page work that actually move rankings.',
      details: [
        'On-page SEO — meta tags, heading structure, internal linking',
        'Technical SEO audits — site speed, mobile usability, crawlability',
        'Keyword research and content structuring',
        'Ongoing monitoring and reporting for sites that need ongoing attention'
      ],
      link: '/contact?service=seo'
    }
  ]

  const faqs = [
    {
      question: 'How do you price a project?',
      answer: 'Depends on scope — some projects are a flat rate, others are hourly if the scope is likely to shift. I\'ll always give you a clear estimate before starting, and flag it early if something changes along the way.'
    },
    {
      question: 'Do you work with clients outside the Philippines?',
      answer: 'Yes — most of my work has been remote, and time zone differences haven\'t been a problem. I keep communication async-friendly and responsive.'
    },
    {
      question: 'Can you take over a project someone else started?',
      answer: 'Usually, yes. I\'ll need to look at the existing code/setup first to give an honest read on how clean a handoff it\'ll be before quoting anything.'
    },
    {
      question: 'What if I just need a small fix, not a full project?',
      answer: 'That\'s fine — not everything needs to be a big engagement. Reach out and describe what you need; if it\'s quick, I\'ll say so.'
    }
  ]

  return (
    <div className="services-page">
      <section className="services-hero">
        <h1 className="services-hero-title">Services</h1>
        <p className="services-hero-subtitle">What I can help you build, fix, or automate.</p>
      </section>

      <section className="services-list">
        {services.map(service => (
          <div key={service.title} className="service-block">
            <div className="service-block-header">
              <p className="service-block-symbol">{service.symbol}</p>
              <h2 className="service-block-title">{service.title}</h2>
            </div>
            <p className="service-block-desc">{service.description}</p>
            <ul className="service-block-details">
              {service.details.map(detail => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
            <Link to={service.link} className="about-btn">get started →</Link>
          </div>
        ))}
      </section>

      <section className="services-faq">
        <h2 className="section-heading">Frequently Asked</h2>
        <div className="faq-list">
          {faqs.map(faq => (
            <div key={faq.question} className="faq-item">
              <p className="faq-question">{faq.question}</p>
              <p className="faq-answer">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-banner">
        <div className="contact-box">
          <div className="contact-panel">
            <p className="cta-flag">
              <span className="cta-flag-key">open_to_work:</span> <span className="cta-flag-value">true</span>
            </p>
            <p className="cta-text">Not sure which service fits? Just describe what you're trying to do — I'll help you figure it out.</p>
            <Link to="/contact" className="about-btn">Contact me →</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Services