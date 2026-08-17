import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import services from '../data/services'

// hardcode only this — the FAQ answer computes elapsed time live via JS Date
const FREELANCE_START = new Date('2025-09-01')

function getFreelanceDuration() {
  const now = new Date()
  let months = (now.getFullYear() - FREELANCE_START.getFullYear()) * 12 + (now.getMonth() - FREELANCE_START.getMonth())
  if (now.getDate() < FREELANCE_START.getDate()) months -= 1
  if (months < 1) return 'less than a month'

  const years = Math.floor(months / 12)
  const remMonths = months % 12
  const parts = []
  if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`)
  if (remMonths > 0) parts.push(`${remMonths} month${remMonths > 1 ? 's' : ''}`)
  return parts.join(', ')
}

// merged from this page's original FAQ + Contact page's FAQ, deduped —
// "small jobs" and "outside the Philippines" each had near-duplicate versions
// on both pages, kept as one combined answer here
const faqs = [
  {
    question: 'How do you price a project?',
    answer: 'Depends on scope — some projects are a flat rate, others are hourly if the scope is likely to shift. I\'ll always give you a clear estimate before starting, and flag it early if something changes along the way.'
  },
  {
    question: 'Do you take small jobs or only bigger projects?',
    answer: 'I take on projects of any size — from quick one-off tasks to full website builds. Not everything needs to be a big engagement; reach out and describe what you need, and if it\'s quick, I\'ll say so.'
  },
  {
    question: 'Do you work with clients outside the Philippines?',
    answer: 'Yes — most of my clients are actually outside the Philippines, and time zone differences haven\'t been a problem; I keep communication async-friendly and responsive. I also work with small local shops here in the PH who want a website.'
  },
  {
    question: 'Can you take over a project someone else started?',
    answer: 'Usually, yes. I\'ll need to look at the existing code/setup first to give an honest read on how clean a handoff it\'ll be before quoting anything.'
  },
  {
    question: "What's your typical turnaround time?",
    answer: "Depends on the size of the project — reach out and I'll give you an estimate once I know what you need."
  },
  {
    question: 'Do you build from scratch or fix existing sites?',
    answer: 'Both — I build from scratch, and I also fix or maintain existing sites.'
  },
  {
    question: 'Do you offer ongoing maintenance after launch?',
    answer: "Yes, I can help with maintenance after launch — let's talk about what you need."
  }
]

function Services() {
  const servicesListRef = useRef(null)
  const faqRef = useRef(null)
  const ctaRef = useRef(null)

  const [listVisible, setListVisible] = useState(false)
  const [faqVisible, setFaqVisible] = useState(false)
  const [ctaVisible, setCtaVisible] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState(null)

  // freelancing-duration FAQ is computed here, not hardcoded, then appended last
  const allFaqs = [
    ...faqs,
    {
      question: 'How long have you been freelancing?',
      answer: `I've been learning front-end since 2023, and freelancing professionally since September 2025 — that's ${getFreelanceDuration()} and counting.`
    }
  ]

  // service cards — stagger in once the group scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setListVisible(true)
      },
      { threshold: 0.15 }
    )

    if (servicesListRef.current) observer.observe(servicesListRef.current)
    return () => observer.disconnect()
  }, [])

  // faq items — stagger in once the group scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setFaqVisible(true)
      },
      { threshold: 0.15 }
    )

    if (faqRef.current) observer.observe(faqRef.current)
    return () => observer.disconnect()
  }, [])

  // bottom CTA — simple fade up, same as About teaser on Home
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setCtaVisible(true)
      },
      { threshold: 0.2 }
    )

    if (ctaRef.current) observer.observe(ctaRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="services-page">
      <section className="services-hero">
        <h1 className="services-hero-title">Services</h1>
        <p className="services-hero-subtitle">What I can help you build, fix, or automate.</p>
      </section>

      <section
        className={`services-list ${listVisible ? 'services-list-visible' : ''}`}
        ref={servicesListRef}
      >
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

      <section className="services-faq" ref={faqRef}>
        <h2 className="section-heading">Frequently Asked</h2>
        <div className={`faq-list ${faqVisible ? 'faq-list-visible' : ''}`}>
          {allFaqs.map((faq, index) => (
            <div key={faq.question} className="faq-item">
              <button
                type="button"
                className="faq-question-toggle"
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
              >
                <span className="faq-question">{faq.question}</span>
                <span className="faq-icon">{openFaqIndex === index ? '－' : '＋'}</span>
              </button>
              {openFaqIndex === index && (
                <p className="faq-answer">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section
        className={`cta-banner ${ctaVisible ? 'cta-banner-visible' : ''}`}
        ref={ctaRef}
      >
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