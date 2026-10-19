import { useState } from 'react'
import { IconSun, IconMoon } from '@tabler/icons-react'

function ThemeToggle() {
  // index.html already set data-theme before React loaded, so just read it
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light')

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    const root = document.documentElement

    // the fading class gives the colors a quick transition instead of snapping
    root.classList.add('theme-fading')
    root.dataset.theme = nextTheme
    setTheme(nextTheme)
    localStorage.setItem('theme', nextTheme)

    setTimeout(() => root.classList.remove('theme-fading'), 400)
  }

  return (
    <button
      type="button"
      className={`theme-toggle ${theme === 'dark' ? 'theme-toggle-dark' : ''}`}
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <IconSun size={20} className="theme-toggle-icon theme-toggle-sun" />
      <IconMoon size={20} className="theme-toggle-icon theme-toggle-moon" />
    </button>
  )
}

export default ThemeToggle