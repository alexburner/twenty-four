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
  case '/tarot-graph-spread': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '50px'
    for (let i = 1, l = 21; i <= l; i++) {
      const n = i % l // zero last
      const canvas = document.createElement('canvas')
      canvas.style.margin = '50px'
      canvas.style.display = 'inline-block'
      document.body.appendChild(canvas)
      tarotGraph(canvas, n, l - 1)
    }
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
  case '/tarot-dots-spread': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '50px'
    for (let i = 1, l = 21; i <= l; i++) {
      const n = i % l // zero last
      const canvas = document.createElement('canvas')
      canvas.style.margin = '50px'
      canvas.style.display = 'inline-block'
      document.body.appendChild(canvas)
      tarotDots(canvas, n, l - 1)
    }
    break
  }
}
