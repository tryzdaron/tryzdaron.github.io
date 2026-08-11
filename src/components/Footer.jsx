import { Link } from 'react-router-dom'
import { IconBrandGithub, IconBrandLinkedin, IconMail } from '@tabler/icons-react'

function Footer() {
  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Projects', path: '/projects' },
    { label: 'Contact', path: '/contact' }
  ]

  const socialLinks = [
    { label: 'GitHub', url: 'https://github.com/tryzdaron', icon: IconBrandGithub },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/YOUR-HANDLE', icon: IconBrandLinkedin },
    { label: 'Email', url: 'mailto:YOUR-EMAIL@example.com', icon: IconMail }
  ]

  return (
    <footer className="site-footer">
      <div className="footer-nav">
        {navLinks.map(link => (
          <Link key={link.label} to={link.path} className="footer-nav-link">
            {link.label}
          </Link>
        ))}
      </div>

      <div className="footer-socials">
        {socialLinks.map(social => {
          const Icon = social.icon
          return (
            <a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className="footer-social-link"
              aria-label={social.label}
            >
              <Icon size={20} />
            </a>
          )
        })}
      </div>

      <p className="footer-line">// built with React, Vite, and way too much coffee</p>

      <p className="footer-copyright">© {new Date().getFullYear()} — all rights reserved</p>
    </footer>
  )
}

export default Footer