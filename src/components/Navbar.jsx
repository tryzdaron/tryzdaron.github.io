import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { IconMenu2, IconX } from '@tabler/icons-react'

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

  // position:fixed only kicks in once scrolled past the hero — kept exactly
  // as before, independent of the glass effect below
  useEffect(() => {
    const heroHeight = document.querySelector('.hero')?.offsetHeight || 0

    const handlePastHero = () => {
      setIsPastHero(window.scrollY > heroHeight)
    }

    handlePastHero()
    window.addEventListener('scroll', handlePastHero)
    return () => window.removeEventListener('scroll', handlePastHero)
  }, [location.pathname])

  // measures the currently-active link and moves the shared underline under it —
  // driven by the route, not click state — untouched from before
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
            {link.label}
          </NavLink>
        ))}
        <span
          className="navbar-underline"
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
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}

export default Navbar