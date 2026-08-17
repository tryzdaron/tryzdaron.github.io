function ProjectModal({ project, onClose }) {
  if (!project) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="project-modal" onClick={(e) => e.stopPropagation()}>

        {project.screenshot && (
          <div className="modal-browser-frame">
            <div className="modal-browser-bar">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
              <span className="modal-browser-url">{project.liveUrl || project.title}</span>
            </div>
            <img className="modal-screenshot" src={project.screenshot} alt={project.title} />
          </div>
        )}

        <div className="modal-body">
          <div className="modal-header">
            <p className="modal-title">{project.title}</p>
            <div className="modal-header-right">
              {project.status !== 'finished' && (
                <span className="status-pill">in progress</span>
              )}
              <button className="modal-close" onClick={onClose}>✕</button>
            </div>
          </div>

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="modal-visit-link"
            >
              ↗ visit site
            </a>
          )}

          <div className="detail-row">
            <p className="detail-label">Role</p>
            <p className="detail-text">{project.role}</p>
          </div>

          <div className="detail-row">
            <p className="detail-label">Outcome</p>
            <p className="detail-text">{project.outcome}</p>
          </div>

          {project.note && (
            <div className="detail-row">
              <p className="detail-label">Note</p>
              <p className="detail-text">{project.note}</p>
            </div>
          )}

          <p className="tags-label">Tags:</p>
          <div className="project-tags">
            {project.tags.map(tag => (
              <span key={tag} className="project-tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectModal