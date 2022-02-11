import { bgColor } from './constants'
import { colorTest } from './routes/color-test'
import './style.css'

document.body.style.backgroundColor = bgColor

const canvas = document.getElementById('canvas')
if (!(canvas instanceof HTMLCanvasElement)) throw new Error('Bad #canvas')

switch (document.location.pathname) {
  case '/color-test':
    colorTest(canvas)
    break
}
