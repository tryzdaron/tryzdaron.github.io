import './Contact.css'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import projects from '../data/projects'
import siteStatus from '../data/siteStatus'
import services from '../data/services'

// ── placeholder backend calls — swap these out, the state logic above them doesn't change ──

// TODO: replace with a real webhook/API call once the backend is built
async function sendToBackend(data) {
  return new Promise(resolve => setTimeout(() => resolve({ ok: true }), 1200))
}

// TODO: replace with a real Groq moderation call (hate speech / threats / explicit content).
// Applies to BOTH the contact form message and the anonymous note — anonymous notes get
// held to a stricter standard. Flagged content goes to a private "needs review" holding
// area, never deleted outright. For now everything passes.
async function checkContent(message) {
  return 'pass'
}

// TODO: replace with real reCAPTCHA v3 + IP-based Supabase rate limiting (~3/day per IP).
// Only runs on the anonymous note path — the "get in touch" form doesn't need this since
// it's not anonymous. For now everything is allowed.
async function checkRateLimit() {
  return 'allowed'
}

// shared submit flow for both forms — isAnonymous gates the rate-limit check,
// checkContent always runs before anything is actually sent
async function submitForm(data, { isAnonymous } = {}) {
  if (isAnonymous) {
    const rateLimitResult = await checkRateLimit()
    if (rateLimitResult !== 'allowed') {
      throw new Error('rate-limited')
    }
  }

  const moderationResult = await checkContent(data.message)
  if (moderationResult !== 'pass') {
    throw new Error('flagged')
  }

  const result = await sendToBackend(data)
  if (!result.ok) {
    throw new Error('send-failed')
  }

  return result
}

function Contact() {
  const [searchParams] = useSearchParams()

  // pre-fill from ?service= query param (set by Services/Home "get started →" links),
  // but only if it actually matches a real option — still fully editable after
  const initialService = (() => {
    const param = searchParams.get('service')
    return services.some(service => service.value === param) ? param : ''
  })()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [service, setService] = useState(initialService)
  const [message, setMessage] = useState('')
  const [formStatus, setFormStatus] = useState('idle') // idle | sending | sent | error

  const [showAnonymousNote, setShowAnonymousNote] = useState(false)
  const [anonNote, setAnonNote] = useState('')
  const [anonStatus, setAnonStatus] = useState('idle') // idle | sending | sent | error

  // 90° flip on the form card when switching modes. isRotated drives the CSS
  // transform; isAnimating just blocks re-clicking mid-animation. The card is
  // edge-on (invisible) at 90°, which is the moment we actually swap which
  // form is in the DOM — only one form ever exists at a time, so the card
  // still auto-sizes to whichever one is showing, no fixed-height hack needed.
  // The two setTimeout delays (150ms each) must match .contact-form-card's
  // CSS transition duration in index.css/App.css — keep them in sync if you
  // change one.
  const [isRotated, setIsRotated] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggleAnonymous = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setIsRotated(true)

    setTimeout(() => {
      setShowAnonymousNote(prev => !prev)
      setIsRotated(false)

      setTimeout(() => {
        setIsAnimating(false)
      }, 150)
    }, 150)
  }
  // holds a preview snapshot while the confirm modal is open — { type: 'contact' | 'note', data }
  const [confirmModal, setConfirmModal] = useState(null)

  // pulled from the shared project data, not hardcoded — whichever project
  // is currently marked in-progress shows up here automatically
  const currentProject = projects.find(project => project.status === 'in-progress')

  // both forms open the confirm modal first — neither submits directly on click
  const handleReviewContact = (e) => {
    e.preventDefault()
    setConfirmModal({ type: 'contact', data: { name, email, service, message } })
  }

  const handleReviewNote = (e) => {
    e.preventDefault()
    setConfirmModal({ type: 'note', data: { anonNote } })
  }

  const handleCancelConfirm = () => setConfirmModal(null)

  const handleConfirmSend = async () => {
    if (!confirmModal) return
    const { type, data } = confirmModal
    setConfirmModal(null)

    if (type === 'contact') {
      setFormStatus('sending')
      try {
        await submitForm({ name: data.name, email: data.email, service: data.service, message: data.message }, { isAnonymous: false })
        setFormStatus('sent')
        setName('')
        setEmail('')
        setService('')
        setMessage('')
      } catch (err) {
        setFormStatus('error')
      }
    } else {
      setAnonStatus('sending')
      try {
        await submitForm({ message: data.anonNote }, { isAnonymous: true })
        setAnonStatus('sent')
        setAnonNote('')
      } catch (err) {
        setAnonStatus('error')
      }
    }
  }

  return (
    <div className="contact-page">
      <div className="contact-page-header">
        <p className="command-line">
          <span className="prompt">PS C:\Users&gt;</span> ./contact.sh --init
        </p>
        <h1 className="section-heading">Let's Build Something</h1>
        <p className="contact-page-subtext">Tell me what you need — I'll get back to you.</p>
      </div>

      <div className="contact-page-columns">

        {/* ── Left column — form ── */}
        <div className="contact-form-card-wrap">
          <div className={`contact-form-card ${isRotated ? 'contact-form-card-flipped' : ''}`}>
            {showAnonymousNote ? (
              <>
                <p className="note-subtext">fully anonymous — no name, no email, just say what's on your mind</p>
                <form onSubmit={handleReviewNote}>
                  <textarea
                    className="note-textarea"
                    placeholder="type here..."
                    value={anonNote}
                    onChange={(e) => setAnonNote(e.target.value)}
                    rows={5}
                    maxLength={500}
                    required
                  />
                  <button type="submit" className="about-btn" disabled={anonStatus === 'sending'}>
                    {anonStatus === 'sending' ? 'sending...' : 'send note →'}
                  </button>
                </form>

                {anonStatus === 'sent' && (
                  <p className="note-status note-status-success">✓ sent, thanks.</p>
                )}
                {anonStatus === 'error' && (
                  <p className="note-status note-status-error">something went wrong, try again.</p>
                )}
              </>
            ) : (
              <>
                <form onSubmit={handleReviewContact}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <input
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <select
                    className="form-input"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select a service</option>
                    {services.map(s => (
                      <option key={s.value} value={s.value}>{s.title}</option>
                    ))}
                  </select>
                  <textarea
                    className="note-textarea"
                    placeholder="Tell me about your project..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    required
                  />
                  <button type="submit" className="about-btn" disabled={formStatus === 'sending'}>
                    {formStatus === 'sending' ? 'sending...' : 'send message →'}
                  </button>
                </form>

                {formStatus === 'sent' && (
                  <p className="note-status note-status-success">✓ got it — I'll get back to you soon.</p>
                )}
                {formStatus === 'error' && (
                  <p className="note-status note-status-error">something went wrong, try again.</p>
                )}
              </>
            )}

            <div className="contact-note-toggle-wrap">
              <button
                type="button"
                className="contact-note-toggle"
                onClick={handleToggleAnonymous}
                disabled={isAnimating}
              >
                {showAnonymousNote ? '> back to contact.sh' : '> optional: leave an anonymous note'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Right column — status ── */}
        <div className="contact-side-column">
          <div className="contact-status-card">
            <p className="command-line">
              <span className="prompt">&gt;</span> status --check
            </p>
            <p className="contact-status-line">
              <span className={`status-dot ${siteStatus.acceptingNewProjects ? 'status-dot-active' : 'status-dot-inactive'}`}></span>
              {siteStatus.acceptingNewProjects ? 'accepting new projects' : 'not currently accepting new projects'}
            </p>
            {currentProject && (
              <p className="contact-status-detail">&gt; currently building: {currentProject.title}</p>
            )}
            <p className="contact-status-detail">&gt; based in: Cavite, PH (GMT+8)</p>
            <p className="contact-status-note">More ways to connect are in the footer ↓</p>
          </div>
        </div>

      </div>

      {/* ── Confirm-before-send modal — shared by both forms ── */}
      {confirmModal && (
        <div className="modal-overlay" onClick={handleCancelConfirm}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <p className="modal-title">Review before sending</p>

            {confirmModal.type === 'contact' ? (
              <div className="confirm-modal-body">
                <p className="detail-label">Name</p>
                <p className="detail-text">{confirmModal.data.name}</p>
                <p className="detail-label">Email</p>
                <p className="detail-text">{confirmModal.data.email}</p>
                <p className="detail-label">Service</p>
                <p className="detail-text">
                  {services.find(s => s.value === confirmModal.data.service)?.title || '—'}
                </p>
                <p className="detail-label">Message</p>
                <p className="detail-text">{confirmModal.data.message}</p>
              </div>
            ) : (
              <div className="confirm-modal-body">
                <p className="detail-label">Anonymous note</p>
                <p className="detail-text">{confirmModal.data.anonNote}</p>
              </div>
            )}

            <div className="confirm-modal-actions">
              <button type="button" className="about-btn confirm-modal-cancel" onClick={handleCancelConfirm}>
                cancel
              </button>
              <button type="button" className="about-btn" onClick={handleConfirmSend}>
                confirm →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Contact