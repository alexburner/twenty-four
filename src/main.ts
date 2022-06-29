import { bgColor } from './constants'
import { colorTest } from './routes/color-test'
import { fields } from './routes/fields'
import { tarotDots } from './routes/tarot-dots'
import { tarotGraph } from './routes/tarot-graph'
import './style.css'

document.body.style.backgroundColor = bgColor

switch (document.location.pathname) {
  case '/color-test': {
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    colorTest(canvas)
    break
  }
  case '/fields': {
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    fields(canvas)
    break
  }
  case '/tarot-graph': {
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    const hash = document.location.hash.substring(1) || undefined
    const hashN = hash ? Number(hash) : NaN
    const n = Number.isFinite(hashN) ? hashN : 12
    tarotGraph(canvas, n, 20)
    break
  }
  case '/tarot-dots': {
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    const hash = document.location.hash.substring(1) || undefined
    const hashN = hash ? Number(hash) : NaN
    const n = Number.isFinite(hashN) ? hashN : 12
    tarotDots(canvas, n, 20)
    break
  }
  case '/tarot-graph-spread': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '50px'
    for (let i = 0, l = 20; i <= l; i++) {
      const canvas = document.createElement('canvas')
      canvas.style.margin = '50px'
      canvas.style.display = 'inline-block'
      canvas.style.borderRadius = '50px'
      document.body.appendChild(canvas)
      tarotGraph(canvas, i, l)
    }
    break
  }
  case '/tarot-dots-spread': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '50px'
    for (let i = 0, l = 20; i <= l; i++) {
      const canvas = document.createElement('canvas')
      canvas.style.margin = '50px'
      canvas.style.display = 'inline-block'
      canvas.style.borderRadius = '50px'
      document.body.appendChild(canvas)
      tarotDots(canvas, i, l)
    }
    break
  }
}

// Shift + D = Download
let hasDownloaded = false
document.addEventListener('keydown', (e) => {
  if (e.key === 'D' && !hasDownloaded) {
    hasDownloaded = true
    Array.from(document.getElementsByTagName('canvas')).forEach((canvas) => {
      canvas.toBlob((blob) => {
        if (blob === null) return
        const a = window.document.createElement('a')
        const url = window.URL.createObjectURL(blob)
        a.href = url
        a.download = document.location.pathname.slice(1)
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      })
    })
  }
})
