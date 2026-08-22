import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { IconMenu2, IconX } from '@tabler/icons-react'

function Navbar() {
  const location = useLocation()
  const [isPastHero, setIsPastHero] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0, opacity: 0 })

  // TEMP DEV TOOL — glass variant A/B comparison toggle. Remove this state,
  // the keydown effect below, and the <button> near the end once Daron picks one.
  const [variant, setVariant] = useState('A')

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

  // glass effect fades in once scrolled past a small threshold — same trigger
  // as before, now driving the liquid-glass classes instead of a flat bg
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // TEMP DEV TOOL — press "v" to flip between glass variants A/B live. Remove with the rest.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'v') {
        setVariant(prev => (prev === 'A' ? 'B' : 'A'))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

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

  const glassClass = scrolled ? `navbar-glass navbar-glass-${variant.toLowerCase()}` : ''

  return (
    <>
      <nav className={`navbar ${isPastHero ? 'navbar-fixed' : ''} ${glassClass}`}>
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

      {/* TEMP DEV TOOL — remove this button before shipping. "v" key does the same thing. */}
      <button
        className="navbar-variant-toggle"
        onClick={() => setVariant(prev => (prev === 'A' ? 'B' : 'A'))}
        title="Press V — temp dev tool, remove before shipping"
      >
        variant: {variant}
      </button>
    </>
  )
}

export default Navbar