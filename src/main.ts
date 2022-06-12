import { bgColor } from './constants'
import { colorTest } from './routes/color-test'
import { fields } from './routes/fields'
import { tarotFront } from './routes/tarot-front'
import './style.css'

document.body.style.backgroundColor = bgColor

const canvas = document.getElementById('canvas')
if (!(canvas instanceof HTMLCanvasElement)) throw new Error('Bad #canvas')

switch (document.location.pathname) {
  case '/color-test':
    colorTest(canvas)
    break
  case '/fields':
    fields(canvas)
    break
  case '/tarot-front': {
    const hash = document.location.hash.substring(1) || undefined
    const hashN = hash ? Number(hash) : NaN
    const n = Number.isFinite(hashN) ? hashN : 12
    tarotFront(canvas, n)
    break
  }
}
