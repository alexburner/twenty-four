import { bgColor, BLEED } from './constants'
import { beginnerBack } from './release-1/beginner-back'
import { beginnerFace } from './release-1/beginner-face'
import { elementaryBack } from './release-1/elementary-back'
import { elementaryFace } from './release-1/elementary-face'
import { advancedBack } from './release-2/advanced-back'
import { advancedFace } from './release-2/advanced-face'
import { introBack } from './release-2/intro-back'
import { introFace } from './release-2/intro-face'
import { r3AdvancedBack } from './release-3/r3_advanced-back'
import { r3AdvancedFace } from './release-3/r3_advanced-face'
import { r3IntroBack } from './release-3/r3_intro-back'
import { r3IntroFace } from './release-3/r3_intro-face'
import { r4AdvancedBack } from './release-4/r4_advanced-back'
import { r4AdvancedFace } from './release-4/r4_advanced-face'
import { r5AdvancedBack } from './release-5/r5_advanced-back'
import { r5AdvancedFace } from './release-5/r5_advanced-face'
import { r5DimensionBack } from './release-5/r5_dimension-back'
import { r5DimensionFace } from './release-5/r5_dimension-face'
import { r6AdvancedBack } from './release-6/r6_advanced-back'
import { r6AdvancedBackBack } from './release-6/r6_advanced-back-back'
import { r6AdvancedFace } from './release-6/r6_advanced-face'
import { r6AdvancedFaceBack } from './release-6/r6_advanced-face-back'
import { r7InfoColors } from './release-7/r7-info-colors'
import { r7TimesTable } from './release-7/r7-times-table'
import { r7TimesTableBack } from './release-7/r7-times-table-back'
import { r7AdvancedBack } from './release-7/r7_advanced-back'
import { r7AdvancedBackBack } from './release-7/r7_advanced-back-back'
import { r7AdvancedFace } from './release-7/r7_advanced-face'
import { r7AdvancedFaceBack } from './release-7/r7_advanced-face-back'
import { r7BigBack } from './release-7/r7_big-back'
import { r7BigFace } from './release-7/r7_big-face'
import { r7DimensionBack } from './release-7/r7_dimension-back'
import { r7DimensionFace } from './release-7/r7_dimension-face'
import { chainOfBeing } from './routes/chain-of-being'
import { circleDots } from './routes/circle-dots'
import { circleGraph } from './routes/circle-graph'
import { colorTest } from './routes/color-test'
import { fields } from './routes/fields'
import { r1 } from './routes/flyers/r1'
import { perlin } from './routes/perlin'
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
import { wave } from './routes/wave'
import './style.css'

document.body.style.backgroundColor = bgColor
document.title = document.location.hash.substring(1) ?? 'learning cards'

const r7Index = (drawFn: typeof r7TimesTable, count: number): void => {
  document.body.style.backgroundColor = '#EEE'
  document.body.style.padding = '50px'
  for (let i = 0; i < count; i++) {
    const canvas = document.createElement('canvas')
    canvas.style.margin = `${50 - BLEED}px`
    canvas.style.display = 'inline-block'
    canvas.style.borderRadius = '100px'
    document.body.appendChild(canvas)
    drawFn(canvas, i, count)
  }
}

const r7Range = (
  drawFn: typeof r7AdvancedFace,
  start: number,
  end: number,
): void => {
  document.body.style.backgroundColor = '#EEE'
  document.body.style.padding = '50px'
  for (let i = start; i <= end; i++) {
    const canvas = document.createElement('canvas')
    canvas.style.margin = `${50 - BLEED}px`
    canvas.style.display = 'inline-block'
    canvas.style.borderRadius = '100px'
    document.body.appendChild(canvas)
    drawFn(canvas, i, end, false)
  }
}

const r7List = (drawFn: typeof r7AdvancedFace, list: number[]): void => {
  document.body.style.backgroundColor = '#EEE'
  document.body.style.padding = '50px'
  list.forEach((n) => {
    const canvas = document.createElement('canvas')
    canvas.style.margin = `${50 - BLEED}px`
    canvas.style.display = 'inline-block'
    canvas.style.borderRadius = '100px'
    document.body.appendChild(canvas)
    drawFn(canvas, n, n, false)
  })
}

const r6Advanced = (
  drawFn: typeof r5AdvancedFace,
  init: number,
  limit: number,
): void => {
  document.body.style.backgroundColor = '#EEE'
  document.body.style.padding = '50px'
  for (let i = init; i <= limit; i++) {
    const canvas = document.createElement('canvas')
    canvas.style.margin = `${50 - BLEED}px`
    canvas.style.display = 'inline-block'
    canvas.style.borderRadius = '100px'
    document.body.appendChild(canvas)
    drawFn(canvas, i, limit, false)
  }
}

const r5Advanced = (
  drawFn: typeof r5AdvancedFace,
  init: number,
  limit: number,
): void => {
  document.body.style.backgroundColor = '#EEE'
  document.body.style.padding = '50px'
  for (let i = init; i <= limit; i++) {
    const canvas = document.createElement('canvas')
    canvas.style.margin = `${50 - BLEED}px`
    canvas.style.display = 'inline-block'
    canvas.style.borderRadius = '100px'
    document.body.appendChild(canvas)
    drawFn(canvas, i, limit, false)
  }
}

const r4Advanced = (drawFn: typeof r4AdvancedFace): void => {
  document.body.style.backgroundColor = '#EEE'
  document.body.style.padding = '50px'
  for (let i = 0, l = 22; i <= l; i++) {
    const canvas = document.createElement('canvas')
    canvas.style.margin = `${50 - BLEED}px`
    canvas.style.display = 'inline-block'
    canvas.style.borderRadius = '100px'
    document.body.appendChild(canvas)
    drawFn(canvas, i, l, false)
  }
}

const r3Advanced = (drawFn: typeof advancedBack): void => {
  document.body.style.backgroundColor = '#EEE'
  document.body.style.padding = '50px'
  for (let i = 0, l = 13; i <= l; i++) {
    const canvas = document.createElement('canvas')
    canvas.style.margin = `${50 - BLEED}px`
    canvas.style.display = 'inline-block'
    canvas.style.borderRadius = '100px'
    document.body.appendChild(canvas)
    drawFn(canvas, i, l)
  }
}

const r3Intro = (drawFn: typeof advancedBack): void => {
  document.body.style.backgroundColor = '#EEE'
  document.body.style.padding = '50px'
  for (let i = 1, l = 9; i <= l; i++) {
    const canvas = document.createElement('canvas')
    canvas.style.margin = `${50 - BLEED}px`
    canvas.style.display = 'inline-block'
    canvas.style.borderRadius = '1000px'
    document.body.appendChild(canvas)
    drawFn(canvas, i, l)
  }
}

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
  case '#wave': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '300px'
    const canvas = document.createElement('canvas')
    canvas.style.margin = '300px'
    canvas.style.display = 'inline-block'
    canvas.style.borderRadius = '50px'
    document.body.appendChild(canvas)
    wave(canvas)
    break
  }
  case '#perlin': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '300px'
    const canvas = document.createElement('canvas')
    canvas.style.margin = '300px'
    canvas.style.display = 'inline-block'
    // canvas.style.borderRadius = '50px'
    document.body.appendChild(canvas)
    perlin(canvas)
    break
  }
  case '#flyers/r1': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '50px'
    for (let i = 0, l = 11; i <= l; i++) {
      const canvas = document.createElement('canvas')
      canvas.style.margin = `${50 - BLEED}px`
      canvas.style.display = 'inline-block'
      document.body.appendChild(canvas)
      r1(canvas, i, l)
    }
    break
  }
  case '#chain-of-being': {
    chainOfBeing()
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
  case '#r1-elementary-face-zero': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '50px'
    const i = 0
    const l = 12
    const canvas = document.createElement('canvas')
    canvas.style.margin = `${50 - BLEED}px`
    canvas.style.display = 'inline-block'
    canvas.style.borderRadius = '100px'
    document.body.appendChild(canvas)
    elementaryFace(canvas, i, l)
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
    for (let i = 0, l = 12; i <= l; i++) {
      const canvas = document.createElement('canvas')
      canvas.style.margin = `${50 - BLEED}px`
      canvas.style.display = 'inline-block'
      canvas.style.borderRadius = '100px'
      document.body.appendChild(canvas)
      elementaryBack(canvas, i, l)
    }
    break
  }
  case '#r1-elementary': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '50px'
    for (let i = 0, l = 12; i <= l; i++) {
      {
        const canvas = document.createElement('canvas')
        canvas.style.margin = `${120 - BLEED}px`
        canvas.style.marginRight = '0px'
        canvas.style.display = 'inline-block'
        canvas.style.borderRadius = '100px'
        document.body.appendChild(canvas)
        elementaryFace(canvas, i, l)
      }
      {
        const canvas = document.createElement('canvas')
        canvas.style.margin = `${120 - BLEED}px`
        canvas.style.marginLeft = '0px'
        canvas.style.display = 'inline-block'
        canvas.style.borderRadius = '100px'
        document.body.appendChild(canvas)
        elementaryBack(canvas, i, l)
      }
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
  case '#r2-advanced': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '50px'
    for (let i = 0, l = 13; i <= l; i++) {
      {
        const canvas = document.createElement('canvas')
        canvas.style.margin = `${120 - BLEED}px`
        canvas.style.marginRight = '0px'
        canvas.style.display = 'inline-block'
        canvas.style.borderRadius = '100px'
        document.body.appendChild(canvas)
        advancedBack(canvas, i, l)
      }
      {
        const canvas = document.createElement('canvas')
        canvas.style.margin = `${120 - BLEED}px`
        canvas.style.marginLeft = '0px'
        canvas.style.display = 'inline-block'
        canvas.style.borderRadius = '100px'
        document.body.appendChild(canvas)
        advancedFace(canvas, i, l)
      }
    }
    break
  }
  case '#r2-advanced-face-zero': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '50px'
    const i = 0
    const l = 13
    const canvas = document.createElement('canvas')
    canvas.style.display = 'inline-block'
    canvas.style.borderRadius = '100px'
    document.body.appendChild(canvas)
    advancedFace(canvas, i, l)
    break
  }
  case '#r2-advanced-face': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '50px'
    for (let i = 0, l = 13; i <= l; i++) {
      const canvas = document.createElement('canvas')
      canvas.style.margin = `${50 - BLEED}px`
      canvas.style.display = 'inline-block'
      canvas.style.borderRadius = '100px'
      document.body.appendChild(canvas)
      advancedFace(canvas, i, l)
    }
    break
  }
  case '#r2-advanced-back': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '50px'
    for (let i = 0, l = 13; i <= l; i++) {
      const canvas = document.createElement('canvas')
      canvas.style.margin = `${50 - BLEED}px`
      canvas.style.display = 'inline-block'
      canvas.style.borderRadius = '100px'
      document.body.appendChild(canvas)
      advancedBack(canvas, i, l)
    }
    break
  }
  case '#r2-intro': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '50px'
    for (let i = 1, l = 10; i <= l; i++) {
      {
        const canvas = document.createElement('canvas')
        canvas.style.margin = `${120 - BLEED}px`
        canvas.style.marginRight = '0px'
        canvas.style.display = 'inline-block'
        canvas.style.borderRadius = '1000px'
        document.body.appendChild(canvas)
        introFace(canvas, i, l)
      }
      {
        const canvas = document.createElement('canvas')
        canvas.style.margin = `${120 - BLEED}px`
        canvas.style.marginLeft = '0px'
        canvas.style.display = 'inline-block'
        canvas.style.borderRadius = '1000px'
        document.body.appendChild(canvas)
        introBack(canvas, i, l)
      }
    }
    break
  }
  case '#r2-intro-face': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '50px'
    for (let i = 1, l = 10; i <= l; i++) {
      const canvas = document.createElement('canvas')
      canvas.style.margin = `${50 - BLEED}px`
      canvas.style.display = 'inline-block'
      canvas.style.borderRadius = '1000px'
      document.body.appendChild(canvas)
      introFace(canvas, i, l)
    }
    break
  }
  case '#r2-intro-back': {
    document.body.style.backgroundColor = '#EEE'
    document.body.style.padding = '50px'
    for (let i = 1, l = 10; i <= l; i++) {
      const canvas = document.createElement('canvas')
      canvas.style.margin = `${50 - BLEED}px`
      canvas.style.display = 'inline-block'
      canvas.style.borderRadius = '1000px'
      document.body.appendChild(canvas)
      introBack(canvas, i, l)
    }
    break
  }
  case '#r3-advanced-face': {
    r3Advanced(r3AdvancedFace)
    break
  }
  case '#r3-advanced-back': {
    r3Advanced(r3AdvancedBack)
    break
  }
  case '#r3-intro-face': {
    r3Intro(r3IntroFace)
    break
  }
  case '#r3-intro-back': {
    r3Intro(r3IntroBack)
    break
  }
  case '#r4-face': {
    r4Advanced(r4AdvancedFace)
    break
  }
  case '#r4-back': {
    r4Advanced(r4AdvancedBack)
    break
  }
  case '#r5-face': {
    r5Advanced(r5AdvancedFace, 0, 14)
    break
  }
  case '#r5-back': {
    r5Advanced(r5AdvancedBack, 0, 14)
    break
  }
  case '#r5-d-face': {
    r5Advanced(r5DimensionFace, 1, 6)
    break
  }
  case '#r5-d-back': {
    r5Advanced(r5DimensionBack, 1, 6)
    break
  }
  case '#r6-face': {
    r6Advanced(r6AdvancedFace, 0, 14)
    break
  }
  case '#r6-back': {
    r6Advanced(r6AdvancedBack, 0, 14)
    break
  }
  case '#r6-face-back': {
    r6Advanced(r6AdvancedFaceBack, 0, 14)
    break
  }
  case '#r6-back-back': {
    r6Advanced(r6AdvancedBackBack, 0, 14)
    break
  }
  case '#r7-face': {
    r7Range(r7AdvancedFace, 0, 14)
    break
  }
  case '#r7-back': {
    r7Range(r7AdvancedBack, 0, 14)
    break
  }
  case '#r7-face-back': {
    r7Range(r7AdvancedFaceBack, 0, 14)
    break
  }
  case '#r7-back-back': {
    r7Range(r7AdvancedBackBack, 0, 14)
    break
  }
  case '#r7-big-face': {
    r7List(r7BigFace, [47, 48])
    break
  }
  case '#r7-big-back': {
    r7List(r7BigBack, [47, 48])
    break
  }
  case '#r7-d-face': {
    r7Range(r7DimensionFace, 1, 6)
    break
  }
  case '#r7-d-back': {
    r7Range(r7DimensionBack, 1, 6)
    break
  }
  case '#r7-table-face': {
    r7Index(r7TimesTable, 4)
    break
  }
  case '#r7-table-back': {
    r7Index(r7TimesTableBack, 4)
    break
  }
  case '#r7-info-angles': {
    r7Index(r7InfoColors, 1)
    break
  }
  case '#r7-info-colors': {
    r7Index(r7InfoColors, 1)
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
