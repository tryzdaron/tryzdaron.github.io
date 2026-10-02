const WEBHOOK_URL = 'https://tryz-daron-automation.onrender.com/webhook/contact-intake'
const RECAPTCHA_SITE_KEY = '6Lf6idUtAAAAAEj7DDZFKbTJHsRs2nRSFHDE8iy0'

// shared by Home's note form and both Contact page forms — grabs a fresh
// recaptcha token, sends everything to n8n, throws if anything fails so
// the caller's existing try/catch handles the error state
export async function submitContactForm({ type, name, email, service_type, message, honeypot }) {
  const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit' })

  const res = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type,
      name,
      email,
      service_type,
      message,
      website: honeypot, // matches the field name n8n checks for
      recaptchaToken: token
    })
  })

  const data = await res.json()

  if (!res.ok || !data.ok) {
    throw new Error(data.error || 'submit-failed')
  }

  return data
}