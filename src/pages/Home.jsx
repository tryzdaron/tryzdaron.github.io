import { useState, useEffect, useRef } from 'react'
import avatar from '../assets/Images/avatar.jpg'

function Home() {
  const codeLines = [
    'const name = "Tryz Daron Odasco";',
    'let name = "Tryz Daron Odasco";',
    'var name = "Tryz Daron Odasco";',
    '$name = "Tryz Daron Odasco";',
    'name = "Tryz Daron Odasco"',
    'String name = "Tryz Daron Odasco";'
  ]

  const [lineIndex, setLineIndex] = useState(0)
  const [typedText, setTypedText] = useState('')
  const [deleting, setDeleting] = useState(false)

  const [skillsVisible, setSkillsVisible] = useState(false)
  const skillsRef = useRef(null)
  const [skillsCommandText, setSkillsCommandText] = useState('')
  const [skillsCommandDone, setSkillsCommandDone] = useState(false)

  const [projectsVisible, setProjectsVisible] = useState(false)
  const projectsRef = useRef(null)
  const [projectsCommandText, setProjectsCommandText] = useState('')
  const [projectsCommandDone, setProjectsCommandDone] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  const projects = [
    {
      message: 'Managed product database — WordPress + Shopify system',
      shortDescription: 'Handled product listings and data for an Australian eco-hygiene brand.',
      body: 'Managed the product database — details, listings, and data structure — for a hybrid WordPress (Oxygen Builder) + Shopify setup (AU eco-hygiene brand). The two platforms were connected via a custom API (built by a senior developer on the team).',
      tags: ['WordPress', 'Shopify', 'Product Database Management', 'Team Collaboration']
    },
    {
      message: 'Built landing page for a task/service platform',
      shortDescription: 'Developed a landing page from a provided Figma design.',
      body: 'Built a landing page using WordPress and Oxygen Builder, based on a provided Figma design.',
      tags: ['WordPress', 'Oxygen Builder', 'Figma', 'Landing Page']
    },
    {
      message: 'Built AI-powered news briefing bot',
      shortDescription: 'Automated Telegram bot summarizing daily news via AI.',
      body: 'Built a Telegram bot using n8n that pulls news from multiple RSS sources, summarizes it with an LLM, and automatically broadcasts daily briefings to subscribers — powered by Supabase, hosted on Render.',
      tags: ['n8n', 'Telegram Bot', 'Groq LLM', 'Supabase', 'Render']
    },
    {
      message: 'Built automation for finding YouTube clips',
      shortDescription: 'AI-powered tool that finds standout moments in long videos.',
      body: 'Built a tool that automatically searches through long YouTube videos, picks out the most interesting short clips using AI, and organizes them into a spreadsheet — built for my own YouTube automation channel.',
      tags: ['Automation', 'AI', 'YouTube', 'Google Sheets']
    }
  ]

  // Hero typing animation — cycles through variable declaration styles
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

  // Skills — scroll trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSkillsVisible(true)
        }
      },
      { threshold: 0, rootMargin: '0px 0px -150px 0px' }
    )

    if (skillsRef.current) {
      observer.observe(skillsRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Skills — command typing
  useEffect(() => {
    if (!skillsVisible) return

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
    }, 60)

    return () => clearInterval(typing)
  }, [skillsVisible])

  // Projects — scroll trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProjectsVisible(true)
        }
      },
      { threshold: 0, rootMargin: '0px 0px -150px 0px' }
    )

    if (projectsRef.current) {
      observer.observe(projectsRef.current)
    }

    return () => observer.disconnect()
  }, [])

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

  return (
    <div className="home">
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
              <p className="terminal-sub">// based in the Philippines</p>
              <p className="terminal-output">&gt; console.log("Let's build something.")</p>
            </div>
          </div>
          <button className="about-btn">About Me →</button>
        </div>
        <img src={avatar} alt="Tryz Daron Odasco" className="avatar" />
        <button className="scroll-arrow" onClick={() => document.getElementById('skills').scrollIntoView({ behavior: 'smooth' })}>
          ↓
        </button>
      </section>

      <section id="skills" className={`skills ${skillsVisible ? 'skills-visible' : ''}`} ref={skillsRef}>
        <h2 className="section-heading">Skills & Tools</h2>
        <p className="section-comment">// here's what I work with</p>

        <p className="command-line">
          <span className="prompt">PS C:\Users&gt;</span> {skillsCommandText}
          {!skillsCommandDone && <span className="cursor">|</span>}
        </p>

        {skillsCommandDone && (
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
                  {['SEO', 'SalesForce'].map(skill => (
                    <span key={skill} className="tag-pill learn">{skill}</span>
                  ))}
                </div>
              </div>
            </div>

            <p className="terminal-success">✓ 15 skills loaded successfully</p>
          </>
        )}
      </section>

      <section id="projects" className={`projects ${projectsVisible ? 'projects-visible' : ''}`} ref={projectsRef}>
        <h2 className="section-heading">Featured Work</h2>
        <p className="section-comment">// projects I've shipped</p>

        <p className="command-line">
          <span className="prompt">PS C:\Users&gt;</span> {projectsCommandText}
          {!projectsCommandDone && <span className="cursor">|</span>}
        </p>

        {projectsCommandDone && (
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
                <p className="skill-description-text">{selectedProject.body}</p>
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
      </section>
    </div>
  )
}

export default Home