import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import avatar from '../assets/Images/avatar.jpg'

function Home() {

  //Hero — data + refs
  const codeLines = [
    'const name = "Tryz Daron Odasco";',
    'let name = "Tryz Daron Odasco";',
    'var name = "Tryz Daron Odasco";',
    '$name = "Tryz Daron Odasco";',
    'name = "Tryz Daron Odasco"',
    'String name = "Tryz Daron Odasco";'
  ]

  //About teaser — data + refs
  const aboutTeaserRef = useRef(null)

  //Skills/Projects/Services/GitHub (code editor block) — data + refs
  const terminalRef = useRef(null)
  const codeContentRef = useRef(null)

  const projects = [
    {
      message: 'Managed product database — WordPress + Shopify system',
      shortDescription: 'Handled product listings and data for an Australian eco-hygiene brand.',
      role: 'Managed the product database — details, listings, and data structure.',
      stack: 'WordPress (Oxygen Builder) + Shopify',
      note: 'The two platforms were connected via a custom API, built by a senior developer on the team.',
      tags: ['WordPress', 'Shopify', 'Product Database Management', 'Team Collaboration']
    },
    {
      message: 'Built landing page for a task/service platform',
      shortDescription: 'Developed a landing page, including a fully responsive mobile version.',
      role: 'Built the landing page.',
      stack: 'Figma, WordPress + Oxygen Builder',
      tags: ['WordPress', 'Oxygen Builder', 'Figma', 'Landing Page']
    },
    {
      message: 'Built AI-powered news briefing bot',
      shortDescription: 'Automated Telegram bot summarizing daily news via AI.',
      role: 'Built a Telegram bot that pulls news from multiple RSS sources and summarizes it with an LLM.',
      stack: 'n8n, Groq LLM, Supabase, hosted on Render',
      note: 'Automatically broadcasts daily briefings to subscribers.',
      tags: ['n8n', 'Telegram Bot', 'Groq LLM', 'Supabase', 'Render']
    },
    {
      message: 'Built automation for finding YouTube clips',
      shortDescription: 'AI-powered tool that finds standout moments in long videos.',
      role: 'Built a tool that scans long YouTube videos and picks out the most interesting short clips using AI.',
      stack: 'n8n, Supadata API, Groq LLM, Google Sheets',
      note: 'Built for my own YouTube automation channel.',
      tags: ['Automation', 'AI', 'YouTube', 'Google Sheets']
    }
  ]

  const services = [
    {
      symbol: '</>',
      title: 'Web Development',
      description: 'WordPress, Shopify, and fully custom-coded sites',
      link: '/contact?service=web-development'
    },
    {
      symbol: '⚙',
      title: 'Automation & Workflows',
      description: 'n8n, GoHighLevel, Zapier, Make.com',
      link: '/contact?service=automation'
    },
    {
      symbol: '[SEO]',
      title: 'SEO',
      description: 'Helping sites get found and rank better',
      link: '/contact?service=seo'
    }
  ]


  //useState — hero
  const [lineIndex, setLineIndex] = useState(0)
  const [typedText, setTypedText] = useState('')
  const [deleting, setDeleting] = useState(false)

  //useState — about teaser
  const [aboutVisible, setAboutVisible] = useState(false)

  //useState — skills
  const [terminalVisible, setTerminalVisible] = useState(false)
  const [skillsCommandText, setSkillsCommandText] = useState('')
  const [skillsCommandDone, setSkillsCommandDone] = useState(false)
  const [skillsGridVisible, setSkillsGridVisible] = useState(false)

  //useState — projects
  const [projectsVisible, setProjectsVisible] = useState(false)
  const [projectsCommandText, setProjectsCommandText] = useState('')
  const [projectsCommandDone, setProjectsCommandDone] = useState(false)
  const [projectsGridVisible, setProjectsGridVisible] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  //useState — services
  const [servicesVisible, setServicesVisible] = useState(false)
  const [servicesCommandText, setServicesCommandText] = useState('')
  const [servicesCommandDone, setServicesCommandDone] = useState(false)
  const [servicesGridVisible, setServicesGridVisible] = useState(false)

  //useState — github (4th command, same pattern as the others)
  const [githubVisible, setGithubVisible] = useState(false)
  const [githubCommandText, setGithubCommandText] = useState('')
  const [githubCommandDone, setGithubCommandDone] = useState(false)
  const [githubGridVisible, setGithubGridVisible] = useState(false)

  //useState — code editor line numbers
  const [lineCount, setLineCount] = useState(1)

  //useState — anonymous note box
  const [noteText, setNoteText] = useState('')
  const [noteStatus, setNoteStatus] = useState('idle') // idle | sending | sent | error | spam | cooldown
  const [noteHoneypot, setNoteHoneypot] = useState('')
  const pageLoadTimeRef = useRef(Date.now())

  //useState — contact/note tabs
  const [contactTab, setContactTab] = useState('contact')


  // ── Hero typing animation — cycles through variable declaration styles
  useEffect(() => {
    const currentLine = codeLines[lineIndex]
    let timer

    if (!deleting && typedText.length < currentLine.length) {
      timer = setTimeout(() => {
        setTypedText(currentLine.slice(0, typedText.length + 1))
      }, 70)
    } else if (!deleting && typedText.length === currentLine.length) {
      timer = setTimeout(() => setDeleting(true), 1500)
    } else if (deleting && typedText.length > 0) {
      timer = setTimeout(() => {
        setTypedText(typedText.slice(0, -1))
      }, 40)
    } else if (deleting && typedText.length === 0) {
      setDeleting(false)
      setLineIndex((lineIndex + 1) % codeLines.length)
    }

    return () => clearTimeout(timer)
  }, [typedText, deleting, lineIndex])

  // About teaser — scroll trigger (simple fade, no typing)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAboutVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (aboutTeaserRef.current) {
      observer.observe(aboutTeaserRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Terminal session — scroll trigger, kicks off Skills (the first command)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTerminalVisible(true)
        }
      },
      { threshold: 0, rootMargin: '0px 0px -150px 0px' }
    )

    if (terminalRef.current) {
      observer.observe(terminalRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Skills — command typing
  useEffect(() => {
    if (!terminalVisible) return

    const command = 'cat tech-stack.json'
    let index = 0

    const typing = setInterval(() => {
      if (index <= command.length) {
        setSkillsCommandText(command.slice(0, index))
        index++
      } else {
        clearInterval(typing)
        setSkillsCommandDone(true)
      }
    }, 30)

    return () => clearInterval(typing)
  }, [terminalVisible])

  // Skills heading pops in first, grid drags in a beat after
  useEffect(() => {
    if (!skillsCommandDone) return
    const t = setTimeout(() => setSkillsGridVisible(true), 350)
    return () => clearTimeout(t)
  }, [skillsCommandDone])

  // Projects — waits for the user to actually scroll further, not just for
  // the block to exist on screen (it can already be in view on short pages,
  // and IntersectionObserver can't tell "already visible" from "just scrolled to")
  useEffect(() => {
    if (!skillsGridVisible) return

    const scrollYAtFinish = window.scrollY
    const scrollThreshold = 60

    const handleScroll = () => {
      if (window.scrollY > scrollYAtFinish + scrollThreshold) {
        setProjectsVisible(true)
        window.removeEventListener('scroll', handleScroll)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [skillsGridVisible])

  // Projects — command typing
  useEffect(() => {
    if (!projectsVisible) return

    const command = 'git log'
    let index = 0

    const typing = setInterval(() => {
      if (index <= command.length) {
        setProjectsCommandText(command.slice(0, index))
        index++
      } else {
        clearInterval(typing)
        setProjectsCommandDone(true)
      }
    }, 60)

    return () => clearInterval(typing)
  }, [projectsVisible])

  // Projects heading pops in first, grid drags in a beat after
  useEffect(() => {
    if (!projectsCommandDone) return
    const t = setTimeout(() => setProjectsGridVisible(true), 350)
    return () => clearTimeout(t)
  }, [projectsCommandDone])

  // Services — same fix: requires real additional scrolling past where the
  // user was when Projects finished, not just visibility
  useEffect(() => {
    if (!projectsGridVisible) return

    const scrollYAtFinish = window.scrollY
    const scrollThreshold = 150

    const handleScroll = () => {
      if (window.scrollY > scrollYAtFinish + scrollThreshold) {
        setServicesVisible(true)
        window.removeEventListener('scroll', handleScroll)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [projectsGridVisible])

  // Services — command typing
  useEffect(() => {
    if (!servicesVisible) return

    const command = 'cat services.json'
    let index = 0

    const typing = setInterval(() => {
      if (index <= command.length) {
        setServicesCommandText(command.slice(0, index))
        index++
      } else {
        clearInterval(typing)
        setServicesCommandDone(true)
      }
    }, 30)

    return () => clearInterval(typing)
  }, [servicesVisible])

  // Services heading pops in first, grid drags in a beat after
  useEffect(() => {
    if (!servicesCommandDone) return
    const t = setTimeout(() => setServicesGridVisible(true), 350)
    return () => clearTimeout(t)
  }, [servicesCommandDone])

  // GitHub — 4th command, same scroll-gate pattern as Projects/Services:
  // requires real additional scrolling past where the user was when Services finished
  useEffect(() => {
    if (!servicesGridVisible) return

    const scrollYAtFinish = window.scrollY
    const scrollThreshold = 150

    const handleScroll = () => {
      if (window.scrollY > scrollYAtFinish + scrollThreshold) {
        setGithubVisible(true)
        window.removeEventListener('scroll', handleScroll)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [servicesGridVisible])

  // GitHub — command typing
  useEffect(() => {
    if (!githubVisible) return

    const command = 'fetch github-activity.log'
    let index = 0

    const typing = setInterval(() => {
      if (index <= command.length) {
        setGithubCommandText(command.slice(0, index))
        index++
      } else {
        clearInterval(typing)
        setGithubCommandDone(true)
      }
    }, 25)

    return () => clearInterval(typing)
  }, [githubVisible])

  // GitHub heading pops in first, output (the stats images) drags in a beat after
  useEffect(() => {
    if (!githubCommandDone) return
    const t = setTimeout(() => setGithubGridVisible(true), 350)
    return () => clearTimeout(t)
  }, [githubCommandDone])

  // line numbers grow to match the actual content height as it mounts
  useEffect(() => {
    if (!codeContentRef.current) return

    const lineHeightPx = 28.8 // matches .line-numbers' line-height: 1.8rem

    const resizeObserver = new ResizeObserver(([entry]) => {
      const height = entry.contentRect.height
      setLineCount(Math.ceil(height / lineHeightPx))
    })

    resizeObserver.observe(codeContentRef.current)

    return () => resizeObserver.disconnect()
  }, [])

  // sends the anonymous note to n8n, with an invisible reCAPTCHA v3 token attached.
  // NOTE: replace YOUR_RECAPTCHA_SITE_KEY and the webhook URL below, and add
  // <script src="https://www.google.com/recaptcha/api.js?render=YOUR_RECAPTCHA_SITE_KEY"></script>
  // to index.html — reCAPTCHA v3 has no visible widget, it just needs the script loaded once.
  const handleNoteSubmit = async (e) => {
    e.preventDefault()
    if (!noteText.trim() || noteStatus === 'sending') return

    // honeypot — real people never fill this, bots usually fill every field they find
    if (noteHoneypot) {
      // pretend it worked so the bot doesn't learn it got caught
      setNoteStatus('sent')
      setNoteText('')
      return
    }

    // most spam scripts submit within milliseconds of the page loading —
    // a real person takes at least a few seconds to read and type
    if (Date.now() - pageLoadTimeRef.current < 4000) {
      setNoteStatus('error')
      return
    }

    // simple cooldown so the same visitor can't fire off notes back-to-back
    const lastSent = sessionStorage.getItem('note_last_sent')
    if (lastSent && Date.now() - Number(lastSent) < 5 * 60 * 1000) {
      setNoteStatus('cooldown')
      return
    }

    setNoteStatus('sending')

    try {
      const token = await window.grecaptcha.execute('YOUR_RECAPTCHA_SITE_KEY', { action: 'submit_note' })

      const res = await fetch('https://YOUR-N8N-INSTANCE/webhook/anonymous-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: noteText, recaptchaToken: token })
      })

      if (!res.ok) throw new Error('submit failed')

      sessionStorage.setItem('note_last_sent', String(Date.now()))
      setNoteStatus('sent')
      setNoteText('')
    } catch (err) {
      setNoteStatus('error')
    }
  }


  return (
    <div className="home">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-right">
          <div className="terminal">
            <div className="terminal-bar">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <div className="terminal-body">
              <p className="terminal-line">
                <span className="prompt">&gt;</span> {typedText}<span className="cursor">|</span>
              </p>
              <p className="terminal-sub">// web developer & automation specialist</p>
              <p className="terminal-sub">// building stuff, breaking stuff, fixing stuff</p>
              <p className="terminal-output">&gt; console.log("Let's build something.")</p>
            </div>
          </div>
          <button className="about-btn">About Me →</button>
        </div>
        <img src={avatar} alt="Tryz Daron Odasco" className="avatar" />
        <button
          className="scroll-arrow"
          onClick={() => aboutTeaserRef.current?.scrollIntoView({ behavior: 'smooth' })}
        >
          ↓
        </button>
      </section>


      {/* ── About teaser ── */}
      <section
        id="about-teaser"
        className={`about-teaser ${aboutVisible ? 'about-teaser-visible' : ''}`}
        ref={aboutTeaserRef}
      >
        <div className="file-tab">
          <span className="tab-dot"></span>
          <span className="tab-label">readme.md</span>
        </div>
        <div className="about-content">
          <p className="about-narrative">
            I'm a self-taught web developer and automation specialist based in the Philippines. Over the past year, I've been building real projects — WordPress, Shopify, and n8n automations — while picking up React along the way.
          </p>
          <p className="about-learning">- Currently learning: SEO, Salesforce, 3D Printing, TypeScript</p>
        </div>
      </section>


      {/* skills/projects/services/github (merged) */}
      <section
        id="terminal-session"
        className={`terminal-session ${terminalVisible ? 'terminal-session-visible' : ''}`}
        ref={terminalRef}
      >
        <div className="code-editor">
          <div className="code-editor-tab">
            <span className="code-editor-path">&gt; ~/portfolio/data</span>
          </div>

          <div className="code-editor-body">
            <div className="line-numbers">
              {Array.from({ length: lineCount }, (_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>

            <div className="code-editor-content" ref={codeContentRef}>

              {/* Skills — command 1, kicked off by the container's own observer above */}
              <div className="terminal-block">
                <p className="command-line">
                  <span className="prompt">PS C:\Users&gt;</span> {skillsCommandText}
                  {!skillsCommandDone && <span className="cursor">|</span>}
                </p>

                {skillsCommandDone && (
                  <h2 className="section-heading">Skills & Tools</h2>
                )}

                {skillsGridVisible && (
                  <>
                    <div className="skills-grid">
                      <div className="skill-card">
                        <p className="json-key">"languages"</p>
                        <div className="tag-row">
                          {['HTML', 'CSS', 'JavaScript', 'PHP', 'Python', 'SQL/MySQL'].map(skill => (
                            <span key={skill} className="tag-pill lang">{skill}</span>
                          ))}
                        </div>
                      </div>

                      <div className="skill-card">
                        <p className="json-key">"tools"</p>
                        <div className="tag-row">
                          {['WordPress', 'Shopify', 'GoHighLevel', 'n8n', 'Supabase', 'React', 'AI/LLM Integrations'].map(skill => (
                            <span key={skill} className="tag-pill tool">{skill}</span>
                          ))}
                        </div>
                      </div>

                      <div className="skill-card">
                        <p className="json-key">"activelyLearning"</p>
                        <div className="tag-row">
                          {['SEO', 'SalesForce', 'TypeScript', '3D Printing'].map(skill => (
                            <span key={skill} className="tag-pill learn">{skill}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="terminal-success">✓ 15 skills loaded successfully</p>
                  </>
                )}
              </div>

              {/* Projects — command 2, mounts once Skills' grid has actually appeared, not just once the command finished typing */}
              {skillsGridVisible && (
                <div className="terminal-block">
                  <p className="command-line">
                    <span className="prompt">PS C:\Users&gt;</span> {projectsCommandText}
                    {!projectsCommandDone && <span className="cursor">|</span>}
                  </p>

                  {projectsCommandDone && (
                    <h2 className="section-heading">Featured Work</h2>
                  )}

                  {projectsGridVisible && (
                    <>
                      <div className="projects-grid">
                        {projects.map(project => (
                          <div
                            key={project.message}
                            className="project-card"
                            onClick={() => setSelectedProject(project)}
                          >
                            <p className="project-title">{project.message}</p>
                            <p className="project-desc">{project.shortDescription}</p>
                          </div>
                        ))}
                      </div>

                      <p className="terminal-success">✓ 4 projects loaded successfully</p>
                    </>
                  )}
                </div>
              )}

              {/* Services — command 3, mounts once Projects' grid has actually appeared, not just once the command finished typing */}
              {projectsGridVisible && (
                <div className="terminal-block">
                  <p className="command-line">
                    <span className="prompt">PS C:\Users&gt;</span> {servicesCommandText}
                    {!servicesCommandDone && <span className="cursor">|</span>}
                  </p>

                  {servicesCommandDone && (
                    <h2 className="section-heading">Services</h2>
                  )}

                  {servicesGridVisible && (
                    <>
                      <div className="skills-grid">
                        {services.map(service => (
                          <div key={service.title} className="skill-card service-card">
                            <p className="service-symbol">{service.symbol}</p>
                            <p className="json-key">{service.title}</p>
                            <p className="service-desc">{service.description}</p>
                            <Link to={service.link} className="service-link">get started →</Link>
                          </div>
                        ))}
                      </div>

                      <p className="terminal-success">✓ 3 services loaded successfully</p>
                      <Link to="/services" className="about-btn services-more-btn">more services →</Link>
                    </>
                  )}
                </div>
              )}

              {/* GitHub — command 4, mounts once Services' grid has actually appeared, not just once the command finished typing */}
              {servicesGridVisible && (
                <div className="terminal-block">
                  <p className="command-line">
                    <span className="prompt">PS C:\Users&gt;</span> {githubCommandText}
                    {!githubCommandDone && <span className="cursor">|</span>}
                  </p>

                  {githubCommandDone && (
                    <h2 className="section-heading">GitHub Activity</h2>
                  )}

                  {githubGridVisible && (
                    <>
                      <img
                        className="github-stats-img"
                        src="https://github-readme-stats-iota-eight-71.vercel.app/api?username=tryzdaron&show_icons=true&theme=dark&bg_color=252526&title_color=569CD6&icon_color=4EC9B0&text_color=D4D4D4&border_color=333333"
                        alt="GitHub stats"
                      />
                      <img
                        className="github-stats-img"
                        src="https://github-readme-activity-graph.vercel.app/graph?username=tryzdaron&theme=react-dark&bg_color=252526&color=4EC9B0&line=569CD6&point=D4D4D4&border=333333"
                        alt="GitHub contribution activity graph"
                      />

                      <p className="terminal-success">✓ github-activity.log loaded successfully</p>
                    </>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </section>


      {/* ── Contact / note tabs — waits until everything above (including GitHub) has finished ── */}
      {githubGridVisible && (
      <section className="contact-banner">
        <div className="contact-box">
          <div className="contact-tabs">
            <button
              className={`contact-tab ${contactTab === 'contact' ? 'contact-tab-active' : ''}`}
              onClick={() => setContactTab('contact')}
            >
              get in touch
            </button>
            <button
              className={`contact-tab ${contactTab === 'note' ? 'contact-tab-active' : ''}`}
              onClick={() => setContactTab('note')}
            >
              leave a note
            </button>
          </div>

          {contactTab === 'contact' && (
            <div className="contact-panel">
              <p className="cta-flag">
                <span className="cta-flag-key">open_to_work:</span> <span className="cta-flag-value">true</span>
              </p>
              <p className="cta-text">Got a project, a weird automation idea, or just want to say hi? Reach out.</p>
              <Link to="/contact" className="about-btn">Contact me →</Link>
            </div>
          )}

          {contactTab === 'note' && (
            <div className="contact-panel">
              <p className="note-subtext">no name, no email — just say what's on your mind.</p>
              <form onSubmit={handleNoteSubmit}>
                {/* honeypot — hidden from real users via CSS, bots tend to fill it anyway */}
                <input
                  type="text"
                  name="company"
                  className="note-honeypot"
                  value={noteHoneypot}
                  onChange={(e) => setNoteHoneypot(e.target.value)}
                  tabIndex="-1"
                  autoComplete="off"
                />
                <textarea
                  className="note-textarea"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="type here..."
                  rows={4}
                  maxLength={500}
                />
                <button type="submit" className="about-btn" disabled={noteStatus === 'sending'}>
                  {noteStatus === 'sending' ? 'sending...' : 'send →'}
                </button>
              </form>
              {noteStatus === 'sent' && <p className="note-status note-status-success">✓ sent, thanks.</p>}
              {noteStatus === 'error' && <p className="note-status note-status-error">something went wrong, try again.</p>}
              {noteStatus === 'cooldown' && <p className="note-status note-status-error">you already sent a note recently — try again in a bit.</p>}
            </div>
          )}
        </div>
      </section>
      )}


      {/* ── Project detail modal ── */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="skill-modal" onClick={(e) => e.stopPropagation()}>
            <div className="terminal-bar">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
              <button className="modal-close" onClick={() => setSelectedProject(null)}>✕</button>
            </div>
            <div className="terminal-body">
              <p className="skill-description-title">{selectedProject.message}</p>
              <div className="detail-row">
                <p className="detail-label">Role</p>
                <p className="detail-text">{selectedProject.role}</p>
              </div>
              <div className="detail-row">
                <p className="detail-label">Stack</p>
                <p className="detail-text">{selectedProject.stack}</p>
              </div>
              <div className="detail-row">
                <p className="detail-label">Note</p>
                <p className="detail-text">{selectedProject.note}</p>
              </div>
              <p className="tags-label">Tags:</p>
              <div className="project-tags">
                {selectedProject.tags.map(tag => (
                  <span key={tag} className="project-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home