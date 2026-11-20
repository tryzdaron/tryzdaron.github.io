import { useEffect, useRef } from 'react'

// dots start grey and shift through these 3 colors as you scroll down the page
const palettes = {
  light: { stops: [[165, 170, 178], [90, 130, 180], [20, 70, 130]], alpha: 0.35 },
  dark: { stops: [[106, 106, 106], [86, 156, 214], [197, 134, 192]], alpha: 0.25 },
}

const spacing = 26
const dropletRadius = 100

function mixStops(stops, t) {
  const from = t < 0.5 ? stops[0] : stops[1]
  const to = t < 0.5 ? stops[1] : stops[2]
  const k = t < 0.5 ? t * 2 : (t - 0.5) * 2
  const r = Math.round(from[0] + (to[0] - from[0]) * k)
  const g = Math.round(from[1] + (to[1] - from[1]) * k)
  const b = Math.round(from[2] + (to[2] - from[2]) * k)
  return `rgb(${r}, ${g}, ${b})`
}

function DotBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const root = document.documentElement
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let mouseX = 0
    let mouseY = 0
    let hasMouse = false
    let dropX = 0
    let dropY = 0
    let lastRippleX = 0
    let lastRippleY = 0
    let lastRippleTime = 0
    let ripples = []
    let smoothScroll = window.scrollY
    let progress = 0
    let theme = 'light'
    let tealColor = '#08705F'
    let frameId

    // the droplet uses your --teal so it follows the theme on its own
    function readTheme() {
      theme = root.dataset.theme === 'dark' ? 'dark' : 'light'
      tealColor = getComputedStyle(root).getPropertyValue('--teal').trim() || '#4EC9B0'
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (!dropX) {
        dropX = width / 2
        dropY = height / 2
      }
    }

    function getProgress() {
      const max = root.scrollHeight - window.innerHeight
      return max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0
    }

    function addRipple(x, y) {
      const now = performance.now()
      ripples.push({ x, y, start: now })
      if (ripples.length > 6) ripples.shift()
      lastRippleX = x
      lastRippleY = y
      lastRippleTime = now
    }

    function onPointerMove(e) {
      if (e.pointerType !== 'mouse') return
      mouseX = e.clientX
      mouseY = e.clientY
      hasMouse = true
    }

    function onPointerDown(e) {
      if (!reduceMotion) addRipple(e.clientX, e.clientY)
    }

    function onMouseLeave() {
      hasMouse = false
    }

    function draw(now) {
      const palette = palettes[theme]
      smoothScroll += (window.scrollY - smoothScroll) * 0.12
      progress += (getProgress() - progress) * 0.1

      const t = now / 1000
      const targetX = hasMouse ? mouseX : width / 2 + Math.cos(t * 0.7) * width * 0.3
      const targetY = hasMouse ? mouseY : height / 2 + Math.sin(t * 0.9) * height * 0.28
      dropX += (targetX - dropX) * 0.08
      dropY += (targetY - dropY) * 0.08

      const moved = Math.hypot(dropX - lastRippleX, dropY - lastRippleY)
      if (!reduceMotion && moved > 140 && now - lastRippleTime > 400) {
        addRipple(dropX, dropY)
      }
      ripples = ripples.filter((r) => now - r.start < 1400)

      const shift = reduceMotion ? 0 : smoothScroll * 0.15
      const period = Math.ceil(height / spacing) * spacing + spacing
      const baseColor = mixStops(palette.stops, progress)
      const baseAlpha = palette.alpha + 0.4 * progress

      ctx.clearRect(0, 0, width, height)

      for (let x = spacing / 2; x < width; x += spacing) {
        for (let row = spacing / 2; row < period; row += spacing) {
          let y = (row - shift) % period
          if (y < 0) y += period
          if (y > height + 12) continue

          let light = 0
          let offX = 0
          let offY = 0

          const dx = x - dropX
          const dy = y - dropY
          const distSq = dx * dx + dy * dy
          if (!reduceMotion && distSq < dropletRadius * dropletRadius) {
            const dist = Math.sqrt(distSq)
            const k = 1 - dist / dropletRadius
            light = k * k
            if (dist > 0.1) {
              const push = k * k * 9
              offX = (dx / dist) * push
              offY = (dy / dist) * push
            }
          }

          for (const r of ripples) {
            const age = (now - r.start) / 1000
            const rx = x - r.x
            const ry = y - r.y
            const ringDist = Math.abs(Math.sqrt(rx * rx + ry * ry) - age * 150)
            const w = Math.max(0, 1 - ringDist / 24) * Math.max(0, 1 - age / 1.4)
            if (w > light) light = w
          }

          ctx.globalAlpha = Math.min(1, baseAlpha + (1 - baseAlpha) * light)
          ctx.fillStyle = light > 0.04 ? tealColor : baseColor
          ctx.beginPath()
          ctx.arc(x + offX, y + offY, 1.4 + 1.8 * light, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.globalAlpha = 1
      frameId = requestAnimationFrame(draw)
    }

    readTheme()
    resize()
    progress = getProgress()

    const observer = new MutationObserver(readTheme)
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] })

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerdown', onPointerDown)
    root.addEventListener('mouseleave', onMouseLeave)
    frameId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frameId)
      observer.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      root.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="dot-bg" aria-hidden="true" />
}

export default DotBackground