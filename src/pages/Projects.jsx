import { useState } from 'react'
import projects from '../data/projects'
import ProjectModal from '../components/ProjectModal'
import './Projects.css'

const categoryOrder = ['websites', 'database', 'automation']

const categoryLabels = {
  websites: '// websites',
  database: '// database management',
  automation: '// automation'
}

function Projects() {
  const [selectedProject, setSelectedProject] = useState(null)

  let rowIndex = 0

  return (
    <div className="projects-page">
      <p className="command-line">
        <span className="prompt">PS C:\Users&gt;</span> cat projects.json
      </p>
      <h1 className="section-heading">All Projects</h1>

      {categoryOrder.map(category => {
        const items = projects.filter(project => project.category === category)
        if (items.length === 0) return null

        const groupDelay = 0.1 + rowIndex * 0.15

        return (
          <div key={category} className="projects-page-group">
            <p
              className="code-comment code-comment-animated"
              style={{ animationDelay: `${groupDelay}s` }}
            >
              {categoryLabels[category]}
            </p>
            <div className="projects-grid">
              {items.map(project => {
                const delay = 0.1 + rowIndex * 0.15
                rowIndex++

                return (
                  <div
                    key={project.title}
                    className="project-card"
                    style={{ animationDelay: `${delay}s` }}
                    onClick={() => setSelectedProject(project)}
                  >
                    {project.status !== 'finished' && (
                      <span className="status-pill project-row-status">in progress</span>
                    )}
                    <p className="project-title">{project.title}</p>
                    <p className="project-desc">
                      {project.subtitle} <span className="project-view-hint">view details →</span>
                    </p>
                    <p className={`project-outcome ${project.status === 'finished' ? 'project-outcome-done' : 'project-outcome-progress'}`}>
                      {project.outcome}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      <p className="terminal-success">✓ {projects.length} projects loaded successfully</p>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  )
}

export default Projects