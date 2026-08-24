import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import avatar from '../assets/Images/avatar.jpg'
import projects from '../data/projects'
import allServices from '../data/services'
import ProjectModal from '../components/ProjectModal'
import './Home.css'

function Home() {

  const codeLines = [
    'const name = "Tryz Daron Odasco";',
    'let name = "Tryz Daron Odasco";',
    'var name = "Tryz Daron Odasco";',
    '$name = "Tryz Daron Odasco";',
    'name = "Tryz Daron Odasco"',
    'String name = "Tryz Daron Odasco";'
  ]

  const aboutTeaserRef = useRef(null)
  const terminalRef = useRef(null)
  const codeContentRef = useRef(null)
  const contactBoxRef = useRef(null)

  // 4 featured projects, client work first then personal builds
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

  const featuredServices = allServices.filter(service => service.featured)

  // don't replay the terminal typing animation if it already ran this tab
  const terminalPlayed = () => sessionStorage.getItem('terminalAnimationPlayed') === 'true'

  const [lineIndex, setLineIndex] = useState(0)
  const [typedText, setTypedText] = useState(() =>
    sessionStorage.getItem('heroAnimationPlayed') === 'true' ? codeLines[0] : ''
  )
  const [deleting, setDeleting] = useState(false)
  const heroAlreadyPlayedRef = useRef(sessionStorage.getItem('heroAnimationPlayed') === 'true')

  const [aboutVisible, setAboutVisible] = useState(false)

  const terminalAlreadyPlayedRef = useRef(terminalPlayed())

  const [terminalVisible, setTerminalVisible] = useState(terminalPlayed)
  const [skillsCommandText, setSkillsCommandText] = useState(() => (terminalPlayed() ? 'cat tech-stack.json' : ''))
  const [skillsCommandDone, setSkillsCommandDone] = useState(terminalPlayed)
  const [skillsGridVisible, setSkillsGridVisible] = useState(terminalPlayed)

  const [projectsVisible, setProjectsVisible] = useState(terminalPlayed)
  const [projectsCommandText, setProjectsCommandText] = useState(() => (terminalPlayed() ? 'git log' : ''))
  const [projectsCommandDone, setProjectsCommandDone] = useState(terminalPlayed)
  const [projectsGridVisible, setProjectsGridVisible] = useState(terminalPlayed)
  const [selectedProject, setSelectedProject] = useState(null)

  const [servicesVisible, setServicesVisible] = useState(terminalPlayed)
  const [servicesCommandText, setServicesCommandText] = useState(() => (terminalPlayed() ? 'cat services.json' : ''))
  const [servicesCommandDone, setServicesCommandDone] = useState(terminalPlayed)
  const [servicesGridVisible, setServicesGridVisible] = useState(terminalPlayed)

  const [githubVisible, setGithubVisible] = useState(terminalPlayed)
  const [githubCommandText, setGithubCommandText] = useState(() => (terminalPlayed() ? 'fetch github-activity.log' : ''))
  const [githubCommandDone, setGithubCommandDone] = useState(terminalPlayed)
  const [githubGridVisible, setGithubGridVisible] = useState(terminalPlayed)

  const [lineCount, setLineCount] = useState(1)

  const [noteText, setNoteText] = useState('')
  const [noteStatus, setNoteStatus] = useState('idle') // idle | sending | sent | error | spam | cooldown
  const [noteHoneypot, setNoteHoneypot] = useState('')
  const pageLoadTimeRef = useRef(Date.now())

  const [contactTab, setContactTab] = useState('contact')
  const [contactBoxVisible, setContactBoxVisible] = useState(terminalPlayed)


  // hero typing animation
  useEffect(() => {
    if (heroAlreadyPlayedRef.current) return

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

  useEffect(() => {
    sessionStorage.setItem('heroAnimationPlayed', 'true')
  }, [])

  // about teaser fade in on scroll
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

  // kicks off skills once the terminal block scrolls into view
  useEffect(() => {
    if (terminalAlreadyPlayedRef.current) return

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

  // skills command typing
  useEffect(() => {
    if (terminalAlreadyPlayedRef.current) return
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

  useEffect(() => {
    if (terminalAlreadyPlayedRef.current) return
    if (!skillsCommandDone) return
    const t = setTimeout(() => setSkillsGridVisible(true), 350)
    return () => clearTimeout(t)
  }, [skillsCommandDone])

  // waits for actual scroll, not just visibility, so it doesn't fire instantly on short pages
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

  // projects command typing
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

  useEffect(() => {
    if (terminalAlreadyPlayedRef.current) return
    if (!projectsCommandDone) return
    const t = setTimeout(() => setProjectsGridVisible(true), 350)
    return () => clearTimeout(t)
  }, [projectsCommandDone])

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

  // services command typing
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

  useEffect(() => {
    if (terminalAlreadyPlayedRef.current) return
    if (!servicesCommandDone) return
    const t = setTimeout(() => setServicesGridVisible(true), 350)
    return () => clearTimeout(t)
  }, [servicesCommandDone])

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

  // github command typing
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

  useEffect(() => {
    if (terminalAlreadyPlayedRef.current) return
    if (!githubCommandDone) return
    const t = setTimeout(() => setGithubGridVisible(true), 350)
    return () => clearTimeout(t)
  }, [githubCommandDone])

  // whole sequence finished, skip straight to the end next time
  useEffect(() => {
    if (githubGridVisible) {
      sessionStorage.setItem('terminalAnimationPlayed', 'true')
    }
  }, [githubGridVisible])

  // line numbers grow with the actual content height
  useEffect(() => {
    if (!codeContentRef.current) return

    const lineHeightPx = 28.8

    const resizeObserver = new ResizeObserver(([entry]) => {
      const height = entry.contentRect.height
      setLineCount(Math.ceil(height / lineHeightPx))
    })

    resizeObserver.observe(codeContentRef.current)

    return () => resizeObserver.disconnect()
  }, [])

  // contact box lines stagger in once scrolled into view
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

  // sends the anonymous note to n8n with a recaptcha token attached
  // still needs the real site key + webhook URL swapped in, and the recaptcha
  // script added to index.html
  const handleNoteSubmit = async (e) => {
    e.preventDefault()
    if (!noteText.trim() || noteStatus === 'sending') return

    if (noteHoneypot) {
      setNoteStatus('sent')
      setNoteText('')
      return
    }

    if (Date.now() - pageLoadTimeRef.current < 4000) {
      setNoteStatus('error')
      return
    }

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

      {/* Hero */}
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


      {/* About teaser */}
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


      {/* skills/projects/services/github */}
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

              {/* Skills */}
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

              {/* Projects */}
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

              {/* Services */}
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
                        {featuredServices.map(service => (
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

              {/* GitHub */}
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


      {/* Contact / note tabs */}
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