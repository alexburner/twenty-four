import { bgColor } from './constants'
import { colorTest } from './routes/color-test'
import { fields } from './routes/fields'
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
}
