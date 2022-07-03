import paper from 'paper'
import { words } from '../constants'
import { drawOutline, getPoints, getRadius } from '../draw'

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

  // const radius = 200

  const proximity = 70
  const radiusN = getRadius(proximity, n)
  const radiusTotal = getRadius(proximity, total)
  const radiusAvg = (radiusN + radiusTotal) / 2

  const radius =
    n === 0 ? 0 : n === 1 ? proximity : n === 2 ? radiusAvg * 0.75 : radiusAvg

  let shapeShift = 100
  if (n === 1) shapeShift += proximity / 2
  if (n === 2) shapeShift += radiusAvg * 0.25

  let fontShift = radius + 20
  if (n === 0) fontShift = 0
  if (n === 1) fontShift = 40
  if (n === 3) fontShift -= 40
  if (n === 5) fontShift -= 20

  const points = getPoints(center, radius, n)

  const outline = drawOutline({
    center,
    points,
    graphColor,
    graphThickness: 4,
  })

  outline.position.y -= shapeShift

  const word = words[n]?.split('').join('')
  const fontSize = 100
  new paper.PointText({
    point: [center.x, center.y + fontSize / 3 + fontShift],
    content: word,
    justification: 'center',
    fillColor: graphColor,
    fontFamily: 'Futura-Light',
    fontSize,
    opacity: 0.9,
  })

  swatch.sendToBack()
}
