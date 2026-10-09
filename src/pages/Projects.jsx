import projects from '../data/projects'
import './Projects.css'
import ProjectCard from '../components/ProjectCard'

const categoryOrder = ['websites', 'database', 'automation']

const categoryLabels = {
  websites: '// websites',
  database: '// database management',
  automation: '// automation'
}

function Projects() {

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
                  <ProjectCard key={project.title} project={project} delay={delay} />
                )
              })}
            </div>
          </div>
        )
      })}

      <p className="terminal-success">✓ {projects.length} projects loaded successfully</p>

    </div>
  )
}

export default Projects