import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import avatar from '../assets/Images/avatar.jpg'
import projects from '../data/projects'
import ProjectModal from '../components/ProjectModal'

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

  //Contact/note tabs — data + refs
  const contactBoxRef = useRef(null)

  // the 4 projects featured on the homepage, pulled from the shared data source
  // (order here controls display order — client work first, then personal builds)
  const featuredTitles = [
    'CleanCo Australia',
    'tripitask.com landing page',
    'AI news briefing bot',
    'YouTube clip finder automation'
  ]
  const featuredProjects = featuredTitles
    .map(title => projects.find(project => project.title === title))
    .filter(Boolean)
  const featuredClientProjects = featuredProjects.filter(project => project.category !== 'automation')
  const featuredPersonalProjects = featuredProjects.filter(project => project.category === 'automation')

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

  // whether the terminal-session (skills/projects/services/github) animation
  // has already played this tab session — used both as a ref (mount-time check
  // inside effects) and to lazy-init state so revisits render already-finished
  const terminalPlayed = () => sessionStorage.getItem('terminalAnimationPlayed') === 'true'

  //useState — hero
  const [lineIndex, setLineIndex] = useState(0)
  const [typedText, setTypedText] = useState(() =>
    sessionStorage.getItem('heroAnimationPlayed') === 'true' ? codeLines[0] : ''
  )
  const [deleting, setDeleting] = useState(false)
  // snapshot taken once at mount — deciding whether THIS mount should animate at all.
  // sessionStorage getting set to true later (by the effect below) must not retroactively
  // stop an animation already running on this same mount, hence a ref, not a live re-check.
  const heroAlreadyPlayedRef = useRef(sessionStorage.getItem('heroAnimationPlayed') === 'true')

  //useState — about teaser
  const [aboutVisible, setAboutVisible] = useState(false)

  // same idea as heroAlreadyPlayedRef, but for the whole terminal-session block below
  const terminalAlreadyPlayedRef = useRef(terminalPlayed())

  //useState — skills
  const [terminalVisible, setTerminalVisible] = useState(terminalPlayed)
  const [skillsCommandText, setSkillsCommandText] = useState(() => (terminalPlayed() ? 'cat tech-stack.json' : ''))
  const [skillsCommandDone, setSkillsCommandDone] = useState(terminalPlayed)
  const [skillsGridVisible, setSkillsGridVisible] = useState(terminalPlayed)

  //useState — projects
  const [projectsVisible, setProjectsVisible] = useState(terminalPlayed)
  const [projectsCommandText, setProjectsCommandText] = useState(() => (terminalPlayed() ? 'git log' : ''))
  const [projectsCommandDone, setProjectsCommandDone] = useState(terminalPlayed)
  const [projectsGridVisible, setProjectsGridVisible] = useState(terminalPlayed)
  const [selectedProject, setSelectedProject] = useState(null)

  //useState — services
  const [servicesVisible, setServicesVisible] = useState(terminalPlayed)
  const [servicesCommandText, setServicesCommandText] = useState(() => (terminalPlayed() ? 'cat services.json' : ''))
  const [servicesCommandDone, setServicesCommandDone] = useState(terminalPlayed)
  const [servicesGridVisible, setServicesGridVisible] = useState(terminalPlayed)

  //useState — github (4th command, same pattern as the others)
  const [githubVisible, setGithubVisible] = useState(terminalPlayed)
  const [githubCommandText, setGithubCommandText] = useState(() => (terminalPlayed() ? 'fetch github-activity.log' : ''))
  const [githubCommandDone, setGithubCommandDone] = useState(terminalPlayed)
  const [githubGridVisible, setGithubGridVisible] = useState(terminalPlayed)

  //useState — code editor line numbers
  const [lineCount, setLineCount] = useState(1)

  //useState — anonymous note box
  const [noteText, setNoteText] = useState('')
  const [noteStatus, setNoteStatus] = useState('idle') // idle | sending | sent | error | spam | cooldown
  const [noteHoneypot, setNoteHoneypot] = useState('')
  const pageLoadTimeRef = useRef(Date.now())

  //useState — contact/note tabs
  const [contactTab, setContactTab] = useState('contact')
  const [contactBoxVisible, setContactBoxVisible] = useState(terminalPlayed)


  // ── Hero typing animation — cycles through variable declaration styles
  useEffect(() => {
    if (heroAlreadyPlayedRef.current) return // already played earlier this session — stay on the static finished text

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

  // marks the animation as played for the rest of this browser tab/session,
  // so navigating away and back skips straight to the finished state
  useEffect(() => {
    sessionStorage.setItem('heroAnimationPlayed', 'true')
  }, [])

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
    if (terminalAlreadyPlayedRef.current) return // already played this session — skip straight to finished state

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
    if (terminalAlreadyPlayedRef.current) return // already have full text from lazy init — don't retype from scratch
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
    if (terminalAlreadyPlayedRef.current) return
    if (!skillsCommandDone) return
    const t = setTimeout(() => setSkillsGridVisible(true), 350)
    return () => clearTimeout(t)
  }, [skillsCommandDone])

  // Projects — waits for the user to actually scroll further, not just for
  // the block to exist on screen (it can already be in view on short pages,
  // and IntersectionObserver can't tell "already visible" from "just scrolled to")
  useEffect(() => {
    if (terminalAlreadyPlayedRef.current) return
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
    if (terminalAlreadyPlayedRef.current) return
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
    }, 50)

    return () => clearInterval(typing)
  }, [projectsVisible])

  // Projects heading pops in first, grid drags in a beat after
  useEffect(() => {
    if (terminalAlreadyPlayedRef.current) return
    if (!projectsCommandDone) return
    const t = setTimeout(() => setProjectsGridVisible(true), 350)
    return () => clearTimeout(t)
  }, [projectsCommandDone])

  // Services — same fix: requires real additional scrolling past where the
  // user was when Projects finished, not just visibility
  useEffect(() => {
    if (terminalAlreadyPlayedRef.current) return
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
    if (terminalAlreadyPlayedRef.current) return
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
    if (terminalAlreadyPlayedRef.current) return
    if (!servicesCommandDone) return
    const t = setTimeout(() => setServicesGridVisible(true), 350)
    return () => clearTimeout(t)
  }, [servicesCommandDone])

  // GitHub — 4th command, same scroll-gate pattern as Projects/Services:
  // requires real additional scrolling past where the user was when Services finished
  useEffect(() => {
    if (terminalAlreadyPlayedRef.current) return
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
    if (terminalAlreadyPlayedRef.current) return
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
    }, 30)

    return () => clearInterval(typing)
  }, [githubVisible])

  // GitHub heading pops in first, output (the stats images) drags in a beat after
  useEffect(() => {
    if (terminalAlreadyPlayedRef.current) return
    if (!githubCommandDone) return
    const t = setTimeout(() => setGithubGridVisible(true), 350)
    return () => clearTimeout(t)
  }, [githubCommandDone])

  // whole terminal-session sequence has now finished for real (github grid is the last
  // step) — flag it so a future remount in this same tab skips straight to finished state.
  // deliberately NOT set on mount like the hero flag: setting it here means someone who
  // scrolls halfway, leaves, and comes back still gets the rest of the animation.
  useEffect(() => {
    if (githubGridVisible) {
      sessionStorage.setItem('terminalAnimationPlayed', 'true')
    }
  }, [githubGridVisible])

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

  // Contact box — scroll trigger, so its inner lines only stagger-animate once it's actually scrolled into view.
  // Depends on githubGridVisible since that's what mounts this section in the first place —
  // without it, the effect would run once on page load, before contactBoxRef even exists.
  useEffect(() => {
    if (terminalAlreadyPlayedRef.current) return
    if (!githubGridVisible) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setContactBoxVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (contactBoxRef.current) {
      observer.observe(contactBoxRef.current)
    }

    return () => observer.disconnect()
  }, [githubGridVisible])

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
            Self-taught web developer and automation specialist based in the Philippines. I build websites and automate the boring parts — WordPress, Shopify, n8n workflows. Past year, that's meant real client work, and teaching myself React through this very site.
          </p>
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
                      <p className="code-comment">// client work</p>
                      <div className="projects-grid">
                        {featuredClientProjects.map(project => (
                          <div
                            key={project.title}
                            className="project-card"
                            onClick={() => setSelectedProject(project)}
                          >
                            <p className="project-title">{project.title}</p>
                            <p className="project-desc">
                              {project.subtitle} <span className="project-view-hint">view details →</span>
                            </p>
                          </div>
                        ))}
                      </div>

                      <p className="code-comment code-comment-spaced">// personal builds</p>
                      <div className="projects-grid">
                        {featuredPersonalProjects.map(project => (
                          <div
                            key={project.title}
                            className="project-card"
                            onClick={() => setSelectedProject(project)}
                          >
                            <p className="project-title">{project.title}</p>
                            <p className="project-desc">
                              {project.subtitle} <span className="project-view-hint">view details →</span>
                            </p>
                          </div>
                        ))}
                      </div>

                      <p className="terminal-success">✓ 4 projects loaded successfully</p>
                      <Link to="/projects" className="about-btn more-projects-btn">view all projects →</Link>
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
        <div
          className={`contact-box ${contactBoxVisible ? 'contact-box-visible' : ''}`}
          ref={contactBoxRef}
        >
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
              <p className="note-subtext">fully anonymous — no name, no email, just say what's on your mind</p>
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

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

    </div>
  )
}

export default Home