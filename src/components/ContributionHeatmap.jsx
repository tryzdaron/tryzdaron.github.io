import { useState, useEffect } from 'react'

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function ContributionHeatmap({ username }) {
  const [days, setDays] = useState([])
  const [status, setStatus] = useState('loading') // loading | done | error

  useEffect(() => {
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
      .then(res => res.json())
      .then(data => {
        if (!data.contributions) throw new Error('no data')
        setDays(data.contributions)
        setStatus('done')
      })
      .catch(() => setStatus('error'))
  }, [username])

  if (status === 'loading') return <p className="heatmap-note">loading contributions...</p>
  if (status === 'error') {
    return (
        <img
        className="github-stats-img github-graph-img"
        src="https://github-readme-activity-graph-gamma-sooty.vercel.app/graph?username=tryzdaron&theme=react-dark&bg_color=252526&color=4EC9B0&line=569CD6&point=D4D4D4&border=333333"
        alt="GitHub contribution activity graph"
        />
    )
    }

  const total = days.reduce((sum, day) => sum + day.count, 0)

  // empty cells up front so the first day lands on the right weekday row
  const firstWeekday = new Date(days[0].date + 'T00:00:00').getDay()
  const padding = Array.from({ length: firstWeekday })

  // one month label per month, skipped if it would crowd the previous one
  const monthLabels = []
  let lastMonth = -1
  let lastLabelColumn = -10
  days.forEach((day, i) => {
    const column = Math.floor((i + firstWeekday) / 7)
    const month = new Date(day.date + 'T00:00:00').getMonth()
    if (month !== lastMonth) {
      if (column - lastLabelColumn >= 3) {
        monthLabels.push({ name: monthNames[month], column })
        lastLabelColumn = column
      }
      lastMonth = month
    }
  })

  return (
    <div className="heatmap-card">
      <p className="heatmap-title">{total} contributions in the last year</p>

      <div className="heatmap-scroll">
        <div className="heatmap-wrap">
          <div className="heatmap-months">
            {monthLabels.map(label => (
              <span key={label.column} style={{ left: label.column * 12 }}>{label.name}</span>
            ))}
          </div>

          <div className="heatmap-weekdays">
            <span></span><span>Mon</span><span></span><span>Wed</span><span></span><span>Fri</span><span></span>
          </div>

          <div className="heatmap-grid">
            {padding.map((_, i) => (
              <div key={`pad-${i}`} className="heatmap-cell heatmap-pad"></div>
            ))}
            {days.map(day => (
              <div
                key={day.date}
                className={`heatmap-cell heatmap-level-${day.level}`}
                title={`${day.count} contributions on ${day.date}`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="heatmap-legend">
        Less
        {[0, 1, 2, 3, 4].map(level => (
          <div key={level} className={`heatmap-cell heatmap-level-${level}`}></div>
        ))}
        More
      </div>
    </div>
  )
}

export default ContributionHeatmap