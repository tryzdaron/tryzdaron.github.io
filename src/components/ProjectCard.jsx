import { useState } from 'react'

function ProjectCard({ project, delay }) {
  const [open, setOpen] = useState(false)

  const finished = project.status === 'finished'

  // turns the title into a commit-style name, like cleanco-australia
  const commitName = project.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  const toggle = () => setOpen(!open)

  return (
    <div
      className={`project-card ${open ? 'project-card-open' : ''}`}
      style={delay !== undefined ? { animationDelay: `${delay}s` } : undefined}
    >
      <div
        className="project-card-head"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            toggle()
          }
        }}
      >
        <div className="project-card-top">
          <p className="project-title">{project.title}</p>
          {!finished && <span className="status-pill">in progress</span>}
        </div>
        <p className="project-desc">{project.subtitle}</p>
        <span className="project-view-hint">
          {open ? 'hide details' : 'view details'}{' '}
          <span className={`project-arrow ${open ? 'project-arrow-open' : ''}`}>→</span>
        </span>
      </div>

      <div className={`project-details ${open ? 'project-details-open' : ''}`}>
        <div className="project-details-inner">
          <div className="project-details-body">
            <p className="project-commit">
              commit {commitName}{' '}
              <span className="project-commit-head">
                (HEAD -&gt; {finished ? 'finished' : 'in-progress'})
              </span>
            </p>

            <p className="project-line">
              <span className="project-line-label">Role:</span> {project.role}
            </p>
            <p className="project-line">
              <span className="project-line-label">{finished ? 'Result:' : 'Goal:'}</span> {project.outcome}
            </p>
            {project.note && (
              <p className="project-line">
                <span className="project-line-label">Note:</span> {project.note}
              </p>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="project-visit-link"
              >
                ↗ visit site
              </a>
            )}

            <div className="project-tags">
              {project.tags.map(tag => (
                <span key={tag} className="project-tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard