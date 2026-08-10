function Footer() {
  const socialLinks = [
    { label: 'GitHub', url: 'https://github.com/tryzdaron' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/YOUR-HANDLE' },
    { label: 'Email', url: 'mailto:YOUR-EMAIL@example.com' }
  ]

  return (
    <footer className="site-footer">
      <p className="footer-line">// built by Tryz Daron Odasco</p>
      <div className="footer-links">
        {socialLinks.map(link => (
          
            <a key={link.label}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="footer-link"
          >
            {link.label}
          </a>
        ))}
      </div>
      <p className="footer-copyright">© {new Date().getFullYear()} — all rights reserved</p>
    </footer>
  )
}

export default Footer