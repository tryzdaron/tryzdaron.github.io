import { useState, useEffect, useRef } from 'react'
import { IconChevronDown } from '@tabler/icons-react'
import {
  motorcycles,
  bicycles,
  swimmingPhotos,
  sceneryPhotos,
  gamingPhoto,
  hobbyBackstories,
  swimmingCaption,
  gamingCaption,
  sceneryCaption
} from '../data/hobbies'
import unlistedSkills from '../data/unlistedSkills'
import { fetchSpotifyStats } from '../data/spotify'
import './About.css'

const hobbyTabs = [
  { id: 'motorcycle', label: 'motorcycle.md' },
  { id: 'cycling', label: 'cycling.md' },
  { id: 'swimming', label: 'swimming.md' },
  { id: 'gaming', label: 'gaming.md' },
  { id: 'scenery', label: 'scenery.md' }
]

// ms per character — edit each independently since command lengths vary a lot
const whoamiTypingSpeed = 35
const spotifyTypingSpeed = 20
const hobbiesTypingSpeed = 60
const skillsTypingSpeed = 35

const sectionRevealDelay = 80 // brief pause after typing finishes, before content pops in
const sectionGapDelay = 550 // pause after content reveals, before the next command starts typing

const ACCENT_COLORS = {
  blue: '#569CD6',
  teal: '#4EC9B0',
  amber: '#FFBD2E'
}

const BORDER_TRACE_DURATION = 550 // ms — card border sweep
const PANEL_TRANSITION_DURATION = 400 // ms — panel height expand/collapse
const CARD_CORNER_RADIUS = 8 // must match the <rect> rx/ry below — used to get the real path length right

// generic photo slot — shows a real image once `photo` is set, otherwise a labeled placeholder
function PhotoSlot({ photo, alt, tall }) {
  if (photo) {
    return <img className={`hobby-photo ${tall ? 'hobby-photo-tall' : ''}`} src={photo} alt={alt} />
  }
  return (
    <div className={`hobby-photo hobby-photo-placeholder ${tall ? 'hobby-photo-tall' : ''}`}>
      <span>📷 photo placeholder</span>
    </div>
  )
}

// shared layout for the motorcycle/cycling tabs — backstory, divider, list + photo panel
function VehicleHobby({ items, backstory, selectedId, onSelect, photoIndex, onPhotoIndex }) {
  const selected = items.find(item => item.id === selectedId) || items[0]
  const photos = selected.photos || []
  const activePhoto = photos[photoIndex] || null

  return (
    <div className="hobby-panel">
      <p className="hobby-backstory">{backstory}</p>
      <div className="hobby-divider"></div>
      <div className="hobby-columns">
        <div className="hobby-list">
          {items.map(item => (
            <div key={item.id}>
              {item.separate && <div className="hobby-list-separator"></div>}
              <button
                type="button"
                className={`hobby-list-item ${item.id === selected.id ? 'hobby-list-item-active' : ''} ${item.current ? 'hobby-list-item-current' : ''} ${item.noPhoto ? 'hobby-list-item-dimmed' : ''} ${item.separate ? 'hobby-list-item-separate' : ''}`}
                onClick={() => {
                  onSelect(item.id)
                  onPhotoIndex(0)
                }}
              >
                {item.name}
                {item.noPhoto && <span className="hobby-no-photo-label"> (no photo)</span>}
              </button>
            </div>
          ))}
        </div>

        <div className="hobby-photo-panel">
          <PhotoSlot photo={activePhoto} alt={selected.name} tall />
          {photos.length > 1 && (
            <div className="hobby-thumb-strip">
              {photos.map((photo, i) => (
                <button
                  key={i}
                  type="button"
                  className={`hobby-thumb ${i === photoIndex ? 'hobby-thumb-active' : ''}`}
                  onClick={() => onPhotoIndex(i)}
                >
                  <img src={photo} alt={`${selected.name} ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
          <p className="hobby-photo-caption">{selected.caption}</p>
        </div>
      </div>
    </div>
  )
}

// content shown inside the expanding panel — shape differs per skill
function SkillDetails({ skill }) {
  return (
    <>
      <p className="detail-text">{skill.paragraph}</p>

      {skill.tags && (
        <>
          <p className="tags-label">{skill.tagsLabel}:</p>
          <div className="project-tags">
            {skill.tags.map(tag => (
              <span key={tag} className="project-tag">{tag}</span>
            ))}
          </div>
        </>
      )}

      {skill.photos && (
        <>
          <p className="tags-label">{skill.photoStripLabel}:</p>
          <div className="skill-photo-strip">
            {skill.photos.map((photo, i) => (
              photo ? (
                <img key={i} className="skill-photo-tile" src={photo} alt={`${skill.title} work ${i + 1}`} />
              ) : (
                <div key={i} className="skill-photo-tile skill-photo-tile-empty">no photo</div>
              )
            ))}
          </div>
        </>
      )}
    </>
  )
}

// one card, animates its own border independently — top border sweeps clockwise
// via the right side to become a full bottom border on open, and continues the
// same direction (via the left side) back to a top border on close.
// The SVG stays mounted at all times (never conditionally removed) — that's
// what lets the browser actually animate stroke-dashoffset between values.
// A freshly-mounted element has nothing to transition from, so it would just
// snap straight to its target instead of sweeping.
function SkillCard({ skill, isOpen, onToggle }) {
  const cardRef = useRef(null)
  const [box, setBox] = useState({ w: 0, h: 0 })
  const [dashOffset, setDashOffset] = useState(0)
  const [phase, setPhase] = useState('closed') // closed | opening | open | closing
  const prevOpenRef = useRef(isOpen)

  // measure once on mount so the resting border draws correctly right away
  useEffect(() => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setBox({ w: rect.width, h: rect.height })
  }, [])

  useEffect(() => {
    if (prevOpenRef.current === isOpen) return
    prevOpenRef.current = isOpen
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    setBox({ w: rect.width, h: rect.height })

    // match the actual drawn rect's size (inset by the stroke), not the raw box —
    // otherwise the dash length doesn't match the real edge and drifts off-corner.
    // A rounded rect's true path is shorter than a plain 2*(w+h): each corner swaps
    // a straight cut for a shorter arc. Using the exact length keeps every half-
    // perimeter jump landing precisely opposite, instead of drifting further off
    // with each toggle.
    const rectW = Math.max(rect.width - 3, 0)
    const rectH = Math.max(rect.height - 3, 0)
    const r = CARD_CORNER_RADIUS
    const perimeter = 2 * (rectW + rectH) - 8 * r + 2 * Math.PI * r
    setPhase(isOpen ? 'opening' : 'closing')
    // always move forward the same rotational direction — open goes via the
    // right side, close continues on via the left side back to the start
    setDashOffset(prev => prev - perimeter / 2)

    const t = setTimeout(() => {
      setPhase(isOpen ? 'open' : 'closed')
    }, BORDER_TRACE_DURATION)

    return () => clearTimeout(t)
  }, [isOpen])

  const rectW = Math.max(box.w - 3, 0)
  const rectH = Math.max(box.h - 3, 0)
  const r = CARD_CORNER_RADIUS
  const perimeter = 2 * (rectW + rectH) - 8 * r + 2 * Math.PI * r
  const edgeLen = Math.max(rectW - 2 * r, 0) // the straight middle part of the top edge, not the full width
  const accentColor = ACCENT_COLORS[skill.accent]
  const isOpenLike = phase === 'open' || phase === 'opening'

  return (
    <button
      type="button"
      ref={cardRef}
      className={`unlisted-skill-card accent-${skill.accent} ${phase === 'open' ? 'unlisted-skill-card-open' : ''}`}
      onClick={onToggle}
    >
      {box.w > 0 && (
        <svg className="unlisted-skill-card-trace" viewBox={`0 0 ${box.w} ${box.h}`} preserveAspectRatio="none">
          <rect
            x="1.5"
            y="1.5"
            width={rectW}
            height={rectH}
            rx={r}
            ry={r}
            fill="none"
            stroke={accentColor}
            strokeWidth="3"
            strokeDasharray={`${edgeLen} ${Math.max(perimeter - edgeLen, 0)}`}
            style={{
              strokeDashoffset: dashOffset,
              transition: `stroke-dashoffset ${BORDER_TRACE_DURATION}ms ease-out`
            }}
          />
        </svg>
      )}
      <IconChevronDown
        size={18}
        className={`unlisted-skill-chevron ${isOpenLike ? 'unlisted-skill-chevron-open' : ''}`}
      />
      <p className="unlisted-skill-icon">{skill.icon}</p>
      <p className="unlisted-skill-title">{skill.title}</p>
    </button>
  )
}

function About() {
  const [activeHobbyTab, setActiveHobbyTab] = useState('motorcycle')

  const [selectedMotorcycle, setSelectedMotorcycle] = useState(motorcycles[0].id)
  const [motorcyclePhotoIndex, setMotorcyclePhotoIndex] = useState(0)

  const [selectedBicycle, setSelectedBicycle] = useState(bicycles.find(b => b.current)?.id || bicycles[0].id)
  const [bicyclePhotoIndex, setBicyclePhotoIndex] = useState(0)

  const [swimPhotoIndex, setSwimPhotoIndex] = useState(0)
  const [sceneryPhotoIndex, setSceneryPhotoIndex] = useState(0)

  const [expandedSkillId, setExpandedSkillId] = useState(null)
  const expandedSkill = unlistedSkills.find(s => s.id === expandedSkillId) || null

  // keeps rendering the last-open skill's content during the close animation,
  // so the panel doesn't go blank before it finishes collapsing
  const [panelSkill, setPanelSkill] = useState(null)
  useEffect(() => {
    if (expandedSkill) {
      setPanelSkill(expandedSkill)
    } else {
      const t = setTimeout(() => setPanelSkill(null), PANEL_TRANSITION_DURATION)
      return () => clearTimeout(t)
    }
  }, [expandedSkill])

  const handleSkillClick = (skill) => {
    if (expandedSkillId === skill.id) {
      setExpandedSkillId(null)
      return
    }
    if (expandedSkillId) {
      // close the current one first, then open the new one after it settles
      setExpandedSkillId(null)
      setTimeout(() => setExpandedSkillId(skill.id), PANEL_TRANSITION_DURATION)
    } else {
      setExpandedSkillId(skill.id)
    }
  }

  // live Spotify data — fetched once on mount from Supabase (synced monthly by n8n)
  const [spotifyStats, setSpotifyStats] = useState(null)

  useEffect(() => {
    fetchSpotifyStats().then(setSpotifyStats)
  }, [])

  const topArtist = spotifyStats?.top_artist
  const topSong = spotifyStats?.top_song
  const topTracks = spotifyStats?.top_tracks || []
  const lastSynced = spotifyStats?.last_synced
    ? new Date(spotifyStats.last_synced).toLocaleDateString()
    : 'not yet synced'

  const topTracksLeft = topTracks.slice(0, 5)
  const topTracksRight = topTracks.slice(5, 10)

  // skips the type/reveal animation on revisits within the same tab session
  const aboutPlayed = () => sessionStorage.getItem('aboutTerminalPlayed') === 'true'
  const terminalRef = useRef(null)
  const aboutAlreadyPlayedRef = useRef(aboutPlayed())

  const [terminalVisible, setTerminalVisible] = useState(aboutPlayed)

  const [whoamiCommandText, setWhoamiCommandText] = useState(() => (aboutPlayed() ? 'whoami --verbose' : ''))
  const [whoamiCommandDone, setWhoamiCommandDone] = useState(aboutPlayed)
  const [whoamiVisible, setWhoamiVisible] = useState(aboutPlayed)

  const [spotifyCommandText, setSpotifyCommandText] = useState(() => (aboutPlayed() ? 'fetch top_tracks.json --range=year' : ''))
  const [spotifyCommandDone, setSpotifyCommandDone] = useState(aboutPlayed)
  const [spotifyVisible, setSpotifyVisible] = useState(aboutPlayed)

  const [hobbiesCommandText, setHobbiesCommandText] = useState(() => (aboutPlayed() ? 'ls ~/hobbies' : ''))
  const [hobbiesCommandDone, setHobbiesCommandDone] = useState(aboutPlayed)
  const [hobbiesVisible, setHobbiesVisible] = useState(aboutPlayed)

  const [skillsCommandText, setSkillsCommandText] = useState(() => (aboutPlayed() ? 'cat resume.txt --unlisted' : ''))
  const [skillsCommandDone, setSkillsCommandDone] = useState(aboutPlayed)
  const [skillsVisible, setSkillsVisible] = useState(aboutPlayed)

  // starts the whole sequence once the terminal scrolls into view
  useEffect(() => {
    if (aboutAlreadyPlayedRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTerminalVisible(true)
      },
      { threshold: 0, rootMargin: '0px 0px -150px 0px' }
    )

    if (terminalRef.current) observer.observe(terminalRef.current)
    return () => observer.disconnect()
  }, [])

  // whoami — typing, then reveal
  useEffect(() => {
    if (aboutAlreadyPlayedRef.current) return
    if (!terminalVisible) return

    const command = 'whoami --verbose'
    let index = 0
    const typing = setInterval(() => {
      if (index <= command.length) {
        setWhoamiCommandText(command.slice(0, index))
        index++
      } else {
        clearInterval(typing)
        setWhoamiCommandDone(true)
      }
    }, whoamiTypingSpeed)

    return () => clearInterval(typing)
  }, [terminalVisible])

  useEffect(() => {
    if (aboutAlreadyPlayedRef.current) return
    if (!whoamiCommandDone) return
    const t = setTimeout(() => setWhoamiVisible(true), sectionRevealDelay)
    return () => clearTimeout(t)
  }, [whoamiCommandDone])

  // spotify — waits a beat after whoami's content shows, then starts typing
  useEffect(() => {
    if (aboutAlreadyPlayedRef.current) return
    if (!whoamiVisible) return

    let typing
    const startDelay = setTimeout(() => {
      const command = 'fetch top_tracks.json --range=year'
      let index = 0
      typing = setInterval(() => {
        if (index <= command.length) {
          setSpotifyCommandText(command.slice(0, index))
          index++
        } else {
          clearInterval(typing)
          setSpotifyCommandDone(true)
        }
      }, spotifyTypingSpeed)
    }, sectionGapDelay)

    return () => {
      clearTimeout(startDelay)
      clearInterval(typing)
    }
  }, [whoamiVisible])

  useEffect(() => {
    if (aboutAlreadyPlayedRef.current) return
    if (!spotifyCommandDone) return
    const t = setTimeout(() => setSpotifyVisible(true), sectionRevealDelay)
    return () => clearTimeout(t)
  }, [spotifyCommandDone])

  // hobbies — waits a beat after spotify's content shows, then starts typing
  useEffect(() => {
    if (aboutAlreadyPlayedRef.current) return
    if (!spotifyVisible) return

    let typing
    const startDelay = setTimeout(() => {
      const command = 'ls ~/hobbies'
      let index = 0
      typing = setInterval(() => {
        if (index <= command.length) {
          setHobbiesCommandText(command.slice(0, index))
          index++
        } else {
          clearInterval(typing)
          setHobbiesCommandDone(true)
        }
      }, hobbiesTypingSpeed)
    }, sectionGapDelay)

    return () => {
      clearTimeout(startDelay)
      clearInterval(typing)
    }
  }, [spotifyVisible])

  useEffect(() => {
    if (aboutAlreadyPlayedRef.current) return
    if (!hobbiesCommandDone) return
    const t = setTimeout(() => setHobbiesVisible(true), sectionRevealDelay)
    return () => clearTimeout(t)
  }, [hobbiesCommandDone])

  // skills — waits a beat after hobbies' content shows, then starts typing
  useEffect(() => {
    if (aboutAlreadyPlayedRef.current) return
    if (!hobbiesVisible) return

    let typing
    const startDelay = setTimeout(() => {
      const command = 'cat resume.txt --unlisted'
      let index = 0
      typing = setInterval(() => {
        if (index <= command.length) {
          setSkillsCommandText(command.slice(0, index))
          index++
        } else {
          clearInterval(typing)
          setSkillsCommandDone(true)
        }
      }, skillsTypingSpeed)
    }, sectionGapDelay)

    return () => {
      clearTimeout(startDelay)
      clearInterval(typing)
    }
  }, [hobbiesVisible])

  useEffect(() => {
    if (aboutAlreadyPlayedRef.current) return
    if (!skillsCommandDone) return
    const t = setTimeout(() => setSkillsVisible(true), sectionRevealDelay)
    return () => clearTimeout(t)
  }, [skillsCommandDone])

  // whole sequence finished, skip straight to the end next time
  useEffect(() => {
    if (skillsVisible) {
      sessionStorage.setItem('aboutTerminalPlayed', 'true')
    }
  }, [skillsVisible])

  return (
    <div className="about-page">
      <div className="about-page-header">
        <p className="command-line">
          <span className="prompt">PS C:\Users&gt;</span> cd ~/about
        </p>
        <h1 className="section-heading">About Me</h1>
      </div>

      <section className="about-terminal" ref={terminalRef}>
        <div className="terminal-bar">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <div className="about-terminal-tab">
          <span className="about-terminal-path">&gt; ~/about</span>
        </div>

        <div className="about-terminal-content">

          {/* Who I Am */}
          <div className="terminal-block">
            <p className="command-line">
              <span className="prompt">$</span> {whoamiCommandText}
              {!whoamiCommandDone && <span className="cursor">|</span>}
            </p>

            {whoamiVisible && (
              <>
                <h2 className="section-heading">Who I Am</h2>
                <p className="about-bio-text">
                  I'm a self-taught web developer and automation specialist from the Philippines. I don't have a CS degree or a bootcamp story. I started learning web development in 2023 by building things, breaking them, fixing them, and taking the time to understand why they worked.
                </p>
                <p className="about-bio-text">
                  That eventually turned into freelance work, which I've been doing professionally since September 2025.
                </p>
                <p className="about-bio-text">
                  Most of what I do comes down to two things: building websites and finding ways to automate repetitive work. I like making things that are actually useful, whether that's a website that works the way it should or a workflow that saves someone from doing the same task over and over.
                </p>
                <p className="about-bio-text">
                  This website is also a project for me to put what I've learned into practice. It's my first React project, and I built it from the fundamentals up rather than relying on a pre-made template. There was a lot of figuring things out along the way, but that's usually how I learn best — understand the basics, then build something real with them.
                </p>
              </>
            )}
          </div>

          {/* Most Played on Spotify */}
          {whoamiVisible && (
            <div className="terminal-block">
              <p className="command-line">
                <span className="prompt">$</span> {spotifyCommandText}
                {!spotifyCommandDone && <span className="cursor">|</span>}
              </p>

              {spotifyVisible && (
                <div className="spotify-section-bg">
                  <h2 className="section-heading">Most Played on Spotify</h2>

                  <div className="spotify-featured-row">
                    <div className="spotify-featured-card">
                      <div className="spotify-avatar-circle">
                        {topArtist?.photo ? (
                          <img src={topArtist.photo} alt={topArtist.name} />
                        ) : (
                          <span>📷</span>
                        )}
                      </div>
                      <p className="spotify-featured-label">Top Artist</p>
                      <p className="spotify-featured-name">{topArtist?.name}</p>
                    </div>

                    <div className="spotify-featured-card">
                      <div className="spotify-album-square">
                        {topSong?.photo ? (
                          <img src={topSong.photo} alt={topSong.title} />
                        ) : (
                          <span>📷</span>
                        )}
                      </div>
                      <p className="spotify-featured-label">Top Song</p>
                      <p className="spotify-featured-name">{topSong?.title}</p>
                      <p className="spotify-featured-sub">{topSong?.artist}</p>
                    </div>
                  </div>

                  <div className="spotify-top-list">
                    <div className="spotify-top-column">
                      {topTracksLeft.map(track => (
                        <a
                          key={track.rank}
                          href={track.url}
                          target="_blank"
                          rel="noreferrer"
                          className="spotify-track-row"
                        >
                          <span className="spotify-track-rank">{track.rank}</span>
                          <div className="spotify-track-thumb">
                            {track.photo ? <img src={track.photo} alt={track.title} /> : <span>📷</span>}
                          </div>
                          <div className="spotify-track-info">
                            <p className="spotify-track-title">{track.title}</p>
                            <p className="spotify-track-artist">{track.artist}</p>
                          </div>
                          <span className="spotify-track-link-icon">↗</span>
                        </a>
                      ))}
                    </div>
                    <div className="spotify-top-column">
                      {topTracksRight.map(track => (
                        <a
                          key={track.rank}
                          href={track.url}
                          target="_blank"
                          rel="noreferrer"
                          className="spotify-track-row"
                        >
                          <span className="spotify-track-rank">{track.rank}</span>
                          <div className="spotify-track-thumb">
                            {track.photo ? <img src={track.photo} alt={track.title} /> : <span>📷</span>}
                          </div>
                          <div className="spotify-track-info">
                            <p className="spotify-track-title">{track.title}</p>
                            <p className="spotify-track-artist">{track.artist}</p>
                          </div>
                          <span className="spotify-track-link-icon">↗</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  <p className="spotify-last-synced">last synced: {lastSynced}</p>
                </div>
              )}
            </div>
          )}

          {/* Life Outside the Code */}
          {spotifyVisible && (
            <div className="terminal-block">
              <p className="command-line">
                <span className="prompt">$</span> {hobbiesCommandText}
                {!hobbiesCommandDone && <span className="cursor">|</span>}
              </p>

              {hobbiesVisible && (
                <>
                  <h2 className="section-heading">Life Outside the Code</h2>

                  <div className="hobbies-tabs">
                    {hobbyTabs.map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        className={`hobby-tab ${activeHobbyTab === tab.id ? 'hobby-tab-active' : ''}`}
                        onClick={() => setActiveHobbyTab(tab.id)}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {activeHobbyTab === 'motorcycle' && (
                    <VehicleHobby
                      items={motorcycles}
                      backstory={hobbyBackstories.motorcycle}
                      selectedId={selectedMotorcycle}
                      onSelect={setSelectedMotorcycle}
                      photoIndex={motorcyclePhotoIndex}
                      onPhotoIndex={setMotorcyclePhotoIndex}
                    />
                  )}

                  {activeHobbyTab === 'cycling' && (
                    <VehicleHobby
                      items={bicycles}
                      backstory={hobbyBackstories.cycling}
                      selectedId={selectedBicycle}
                      onSelect={setSelectedBicycle}
                      photoIndex={bicyclePhotoIndex}
                      onPhotoIndex={setBicyclePhotoIndex}
                    />
                  )}

                  {activeHobbyTab === 'swimming' && (
                    <div className="hobby-panel">
                      <p className="hobby-backstory">{swimmingCaption}</p>
                      <div className="swim-gallery">
                        <div className="swim-main-photo-wrap">
                          <PhotoSlot photo={swimmingPhotos[swimPhotoIndex]?.photo} alt="Swimming" tall />
                          <span className="swim-location-tag">{swimmingPhotos[swimPhotoIndex]?.location}</span>
                        </div>
                        <div className="hobby-thumb-strip">
                          {swimmingPhotos.map((item, i) => (
                            <button
                              key={item.id}
                              type="button"
                              className={`hobby-thumb ${i === swimPhotoIndex ? 'hobby-thumb-active' : ''}`}
                              onClick={() => setSwimPhotoIndex(i)}
                            >
                              {item.photo ? <img src={item.photo} alt={`Swim ${i + 1}`} /> : <span>📷</span>}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeHobbyTab === 'gaming' && (
                    <div className="hobby-panel">
                      <div className="gaming-panel">
                        <PhotoSlot photo={gamingPhoto.photo} alt="Gaming" tall />
                        <p className="hobby-backstory">{gamingCaption}</p>
                      </div>
                    </div>
                  )}

                  {activeHobbyTab === 'scenery' && (
                    <div className="hobby-panel">
                      <h3 className="section-heading">Worth the Detour</h3>
                      <p className="hobby-backstory">{sceneryCaption}</p>
                      <div className="scenery-gallery">
                        <PhotoSlot photo={sceneryPhotos[sceneryPhotoIndex]?.photo} alt="Scenery" tall />
                        <div className="hobby-thumb-strip">
                          {sceneryPhotos.map((item, i) => (
                            <button
                              key={item.id}
                              type="button"
                              className={`hobby-thumb ${i === sceneryPhotoIndex ? 'hobby-thumb-active' : ''}`}
                              onClick={() => setSceneryPhotoIndex(i)}
                            >
                              {item.photo ? <img src={item.photo} alt={`Scenery ${i + 1}`} /> : <span>📷</span>}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* The Skills Not on My Resume */}
          {hobbiesVisible && (
            <div className="terminal-block">
              <p className="command-line">
                <span className="prompt">$</span> {skillsCommandText}
                {!skillsCommandDone && <span className="cursor">|</span>}
              </p>

              {skillsVisible && (
                <>
                  <h2 className="section-heading">The Skills Not on My Resume</h2>

                  <div className="unlisted-skills-grid">
                    {unlistedSkills.map(skill => (
                      <SkillCard
                        key={skill.id}
                        skill={skill}
                        isOpen={skill.id === expandedSkillId}
                        onToggle={() => handleSkillClick(skill)}
                      />
                    ))}

                    <div
                      className={`unlisted-skill-panel ${expandedSkillId ? 'unlisted-skill-panel-open' : ''} ${panelSkill ? `accent-${panelSkill.accent}` : ''}`}
                    >
                      <div className="unlisted-skill-panel-inner">
                        {panelSkill && <SkillDetails skill={panelSkill} />}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </section>
    </div>
  )
}

export default About