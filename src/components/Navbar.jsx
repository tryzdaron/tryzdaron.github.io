import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { IconMenu2, IconX } from '@tabler/icons-react'

function Navbar() {
  const [isPastHero, setIsPastHero] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Projects', path: '/projects' },
    { label: 'Services', path: '/services' },
    { label: 'Contact', path: '/contact' }
  ]

  useEffect(() => {
    const heroHeight = document.querySelector('.hero')?.offsetHeight || 0

    const handleScroll = () => {
      setIsPastHero(window.scrollY > heroHeight)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`navbar ${isPastHero ? 'navbar-fixed' : ''}`}>
      <NavLink to="/" className="navbar-logo">
        <span className="logo-bracket">&gt;</span>daron.dev<span className="logo-cursor">|</span>
      </NavLink>

      <div className="navbar-links">
        {navLinks.map(link => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => `navbar-link ${isActive ? 'navbar-link-active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
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