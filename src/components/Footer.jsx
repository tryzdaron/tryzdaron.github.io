import { Link } from 'react-router-dom'
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok
} from '@tabler/icons-react'

function Footer() {
  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Projects', path: '/projects' },
    { label: 'Contact', path: '/contact' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' }
  ]

  const socialLinks = [
    { label: 'GitHub', url: 'https://github.com/tryzdaron', icon: IconBrandGithub },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/tryz-daron-odasco-456323419/', icon: IconBrandLinkedin },
    { label: 'Email', url: 'mailto:tryzdaron28@gmail.com', icon: IconMail },
    { label: 'Facebook', url: 'https://www.facebook.com/daron.odasco', icon: IconBrandFacebook },
    { label: 'Instagram', url: 'https://instagram.com/deyhonnn/', icon: IconBrandInstagram },
    { label: 'TikTok', url: 'https://tiktok.com/@tryz_daron', icon: IconBrandTiktok }
  ]

  return (
    <footer className="site-footer footer-glass">
      <div className="footer-top">
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
      </div>

      <div className="footer-bottom">
        <p className="footer-line">// built with React, Vite, and way too much coffee</p>
        <p className="footer-copyright">© {new Date().getFullYear()} — all rights reserved</p>
      </div>
    </footer>
  )
}

export default Footer