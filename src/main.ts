import { bgColor, BLEED } from './constants'
import { beginnerBack } from './release-1/beginner-back'
import { beginnerFace } from './release-1/beginner-face'
import { elementaryBack } from './release-1/elementary-back'
import { elementaryFace } from './release-1/elementary-face'
import { circleDots } from './routes/circle-dots'
import { circleGraph } from './routes/circle-graph'
import { colorTest } from './routes/color-test'
import { fields } from './routes/fields'
import { splitOldBack } from './routes/split-old-back'
import { splitOldFront } from './routes/split-old-front'
import { splitYoungBack } from './routes/split-young-back'
import { splitYoungFront } from './routes/split-young-front'
import { split2OldBack } from './routes/split2-old-back'
import { split2OldFront } from './routes/split2-old-front'
import { split2YoungBack } from './routes/split2-young-back'
import { split2YoungFront } from './routes/split2-young-front'
import { tarotDots } from './routes/tarot-dots'
import { tarotGraph } from './routes/tarot-graph'
import { terrain } from './routes/terrain'
import './style.css'

document.body.style.backgroundColor = bgColor
document.title = document.location.hash.substring(1) ?? 'learning cards'

switch (document.location.hash) {
  case '#color-test': {
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    colorTest(canvas)
    break
  }
  case '#fields': {
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    fields(canvas)
    break
  }
  case '#tarot-graph': {
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    const hash = document.location.hash.substring(1) || undefined
    const hashN = hash ? Number(hash) : NaN
    const n = Number.isFinite(hashN) ? hashN : 12
    tarotGraph(canvas, n, 20)
    break
  }
  case '#tarot-dots': {
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    const hash = document.location.hash.substring(1) || undefined
    const hashN = hash ? Number(hash) : NaN
    const n = Number.isFinite(hashN) ? hashN : 12
    tarotDots(canvas, n, 20)
    break
  }
  case '#tarot-graph-spread': {
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
  case '#tarot-dots-spread': {
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
  case '#circle-graph-spread': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '50px'
    for (let i = 0, l = 20; i <= l; i++) {
      const canvas = document.createElement('canvas')
      canvas.style.margin = '50px'
      canvas.style.display = 'inline-block'
      canvas.style.borderRadius = '1000px'
      document.body.appendChild(canvas)
      circleGraph(canvas, i, l)
    }
    break
  }
  case '#circle-dots-spread': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '50px'
    for (let i = 0, l = 20; i <= l; i++) {
      const canvas = document.createElement('canvas')
      canvas.style.margin = '50px'
      canvas.style.display = 'inline-block'
      canvas.style.borderRadius = '1000px'
      document.body.appendChild(canvas)
      circleDots(canvas, i, l)
    }
    break
  }
  case '#split-young-front': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '50px'
    for (let i = 0, l = 10; i <= l; i++) {
      const canvas = document.createElement('canvas')
      canvas.style.margin = '50px'
      canvas.style.display = 'inline-block'
      canvas.style.borderRadius = '1000px'
      document.body.appendChild(canvas)
      splitYoungFront(canvas, i, l)
    }
    break
  }
  case '#split-young-back': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '50px'
    for (let i = 0, l = 10; i <= l; i++) {
      const canvas = document.createElement('canvas')
      canvas.style.margin = '50px'
      canvas.style.display = 'inline-block'
      canvas.style.borderRadius = '1000px'
      document.body.appendChild(canvas)
      splitYoungBack(canvas, i, l)
    }
    break
  }
  case '#split-old-front': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '50px'
    for (let i = 0, l = 20; i <= l; i++) {
      const canvas = document.createElement('canvas')
      canvas.style.margin = '50px'
      canvas.style.display = 'inline-block'
      canvas.style.borderRadius = '1000px'
      document.body.appendChild(canvas)
      splitOldFront(canvas, i, l)
    }
    break
  }
  case '#split-old-back': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '50px'
    for (let i = 0, l = 20; i <= l; i++) {
      const canvas = document.createElement('canvas')
      canvas.style.margin = '50px'
      canvas.style.display = 'inline-block'
      canvas.style.borderRadius = '1000px'
      document.body.appendChild(canvas)
      splitOldBack(canvas, i, l)
    }
    break
  }
  case '#split2-young-front': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '50px'
    for (let i = 1, l = 10; i <= l; i++) {
      const canvas = document.createElement('canvas')
      canvas.style.margin = '50px'
      canvas.style.display = 'inline-block'
      canvas.style.borderRadius = '50px'
      document.body.appendChild(canvas)
      split2YoungFront(canvas, i, l)
    }
    break
  }
  case '#split2-young-back': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '50px'
    for (let i = 1, l = 10; i <= l; i++) {
      const canvas = document.createElement('canvas')
      canvas.style.margin = '50px'
      canvas.style.display = 'inline-block'
      canvas.style.borderRadius = '50px'
      document.body.appendChild(canvas)
      split2YoungBack(canvas, i, l)
    }
    break
  }
  case '#split2-old-front': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '50px'
    for (let i = 0, l = 20; i <= l; i++) {
      const canvas = document.createElement('canvas')
      canvas.style.margin = '50px'
      canvas.style.display = 'inline-block'
      canvas.style.borderRadius = '50px'
      document.body.appendChild(canvas)
      split2OldFront(canvas, i, l)
    }
    break
  }
  case '#split2-old-back': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '50px'
    for (let i = 0, l = 20; i <= l; i++) {
      const canvas = document.createElement('canvas')
      canvas.style.margin = '50px'
      canvas.style.display = 'inline-block'
      canvas.style.borderRadius = '50px'
      document.body.appendChild(canvas)
      split2OldBack(canvas, i, l)
    }
    break
  }
  case '#r1-elementary-face': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '50px'
    for (let i = 0, l = 12; i <= l; i++) {
      const canvas = document.createElement('canvas')
      canvas.style.margin = `${50 - BLEED}px`
      canvas.style.display = 'inline-block'
      canvas.style.borderRadius = '100px'
      document.body.appendChild(canvas)
      elementaryFace(canvas, i, l)
    }
    break
  }
  case '#r1-elementary-back': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '50px'
    for (let i = 1, l = 12; i <= l; i++) {
      const canvas = document.createElement('canvas')
      canvas.style.margin = `${50 - BLEED}px`
      canvas.style.display = 'inline-block'
      canvas.style.borderRadius = '100px'
      document.body.appendChild(canvas)
      elementaryBack(canvas, i, l)
    }
    break
  }
  case '#r1-beginner-face': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '50px'
    for (let i = 1, l = 10; i <= l; i++) {
      const canvas = document.createElement('canvas')
      canvas.style.margin = `${50 - BLEED}px`
      canvas.style.display = 'inline-block'
      canvas.style.borderRadius = '100px'
      document.body.appendChild(canvas)
      beginnerFace(canvas, i, l)
    }
    break
  }
  case '#r1-beginner-back': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '50px'
    for (let i = 1, l = 10; i <= l; i++) {
      const canvas = document.createElement('canvas')
      canvas.style.margin = `${50 - BLEED}px`
      canvas.style.display = 'inline-block'
      canvas.style.borderRadius = '100px'
      document.body.appendChild(canvas)
      beginnerBack(canvas, i, l)
    }
    break
  }
  case '#terrain': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '300px'
    const canvas = document.createElement('canvas')
    canvas.style.margin = '300px'
    canvas.style.display = 'inline-block'
    canvas.style.borderRadius = '50px'
    document.body.appendChild(canvas)
    terrain(canvas)
    break
  }
}

// Shift + D = Download
let hasDownloaded = false
document.addEventListener('keydown', async (e) => {
  if (e.key === 'D' && !hasDownloaded) {
    hasDownloaded = true
    const canvases = Array.from(document.getElementsByTagName('canvas'))
    for (const canvas of canvases) {
      void (await downloadCanvas(canvas))
    }
  }
})

const downloadCanvas = (canvas: HTMLCanvasElement): Promise<void> =>
  new Promise((resolve) =>
    canvas.toBlob((blob) => {
      if (blob === null) return
      const a = window.document.createElement('a')
      const url = window.URL.createObjectURL(blob)
      a.href = url
      a.download = document.title
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      resolve()
    }),
  )
