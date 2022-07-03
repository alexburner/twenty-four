import paper from 'paper'
import { words } from '../constants'

const BLEED = 36

const canvasW = 300 * 3.5 + BLEED * 2
const canvasH = 300 * 3.5 + BLEED * 2

const graphColor = '#333'

export const splitOldBack = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const hue = ((360 * ((n - 0) / (total + 1))) % 360) - 8

  const swatchColor = {
    hue,
    saturation: 0.33,
    brightness: 0.99,
  }

  const x = canvasW / 2
  const y = x
  const center = new paper.Point(x, y)

  const container = new paper.Path.Rectangle({
    point: [0, 0],
    size: [canvasW, canvasH],
  })

  const swatch = container.clone()
  swatch.fillColor = swatchColor as paper.Color

  const word = words[n]?.split('').join(' ')
  const fontSize = 120
  new paper.PointText({
    point: [center.x, center.y + fontSize / 3],
    content: word,
    justification: 'center',
    fillColor: graphColor,
    fontFamily: 'Futura-Light',
    fontSize,
    opacity: 0.9,
  })

  swatch.sendToBack()
}
