import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { IconMenu2, IconX } from '@tabler/icons-react'

function TerminalIcon() {
  return (
    <svg className="tab-icon" viewBox="0 0 16 16" aria-hidden="true">
      <rect width="16" height="16" rx="3" fill="currentColor" />
      <path d="M4.5 5l3.5 3-3.5 3M9 11.5h3" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Navbar() {
  const location = useLocation()
  const [isPastHero, setIsPastHero] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0, opacity: 0 })

  const linkRefs = useRef({})
  const navLinksRef = useRef(null)

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Projects', path: '/projects' },
    { label: 'Services', path: '/services' },
    { label: 'Contact', path: '/contact' }
  ]


  useEffect(() => {
    const heroHeight = document.querySelector('.hero')?.offsetHeight || 0

    const handlePastHero = () => {
      setIsPastHero(window.scrollY > heroHeight)
    }

    handlePastHero()
    window.addEventListener('scroll', handlePastHero)
    return () => window.removeEventListener('scroll', handlePastHero)
  }, [location.pathname])

  const positionUnderline = () => {
    const activeLink = linkRefs.current[location.pathname]
    const container = navLinksRef.current

    if (activeLink && container) {
      const containerRect = container.getBoundingClientRect()
      const linkRect = activeLink.getBoundingClientRect()
      setUnderlineStyle({
        left: linkRect.left - containerRect.left,
        width: linkRect.width,
        opacity: 1
      })
    } else {
      setUnderlineStyle(prev => ({ ...prev, opacity: 0 }))
    }
  }

  useLayoutEffect(() => {
    positionUnderline()
  }, [location.pathname])

  useEffect(() => {
    window.addEventListener('resize', positionUnderline)
    return () => window.removeEventListener('resize', positionUnderline)
  }, [location.pathname])

  return (
    <nav className={`navbar ${isPastHero ? 'navbar-fixed' : ''} navbar-glass navbar-glass-a`}>
      <NavLink to="/" className="navbar-logo">
        <span className="logo-bracket">&gt;</span>daron.dev<span className="logo-cursor">|</span>
      </NavLink>

      <div className="navbar-links" ref={navLinksRef}>
        {navLinks.map(link => (
          <NavLink
            key={link.path}
            to={link.path}
            ref={(el) => { linkRefs.current[link.path] = el }}
            className={({ isActive }) => `navbar-link ${isActive ? 'navbar-link-active' : ''}`}
          >
            <TerminalIcon />{link.label}
          </NavLink>
        ))}
        <span
          className="navbar-tab-fill"
          style={{
            left: `${underlineStyle.left}px`,
            width: `${underlineStyle.width}px`,
            opacity: underlineStyle.opacity
          }}
        ></span>
      </div>

      <button className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <IconX size={24} color="#569CD6" /> : <IconMenu2 size={24} color="#569CD6" />}
      </button>

      {menuOpen && (
        <div className="navbar-mobile-menu">
          {navLinks.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `navbar-link ${isActive ? 'navbar-link-active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <TerminalIcon />{link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}

export default Navbar