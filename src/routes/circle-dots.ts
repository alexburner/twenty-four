import paper from 'paper'
import { white } from '../constants'
import { drawGraphsAndShells, drawDots, getPoints, getRadius } from '../draw'

const BLEED = 36

const canvasW = 300 * 3.5 + BLEED * 2
const canvasH = 300 * 3.5 + BLEED * 2

const graphColor = '#333'
const proximity = 100

export const circleDots = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const hue = ((360 * ((n - 1) / (total + 0))) % 360) - 8

  let swatchColor = {
    hue,
    saturation: 1 / 3,
    brightness: 1,
  }

  let shellColor = swatchColor

  if (n === 0) {
    shellColor = white
    swatchColor = white
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

  const dotSize = 42
  const radiusN = getRadius(proximity, n)
  const radiusTotal = getRadius(proximity, total)
  const radiusAvg = (radiusN + radiusTotal) / 2

  const points = getPoints(center, radiusN, n)

  drawGraphsAndShells({
    container,
    center,
    proximity,
    radius: radiusN,
    size: canvasH * 1.5,
    n,
    graphColor: shellColor,
    shellColor,
    points,
    shelln: 0,
  })

  // < special 1 hacks >
  const radius2 = getRadius(proximity, 2)
  const radius3 = getRadius(proximity, 3)
  const diff32 = radius3 - radius2
  const radius1 = radius2 - diff32
  const radiusAvg1 = (radius1 + radiusTotal) / 2
  // < / special 1 hacks >

  const dotGroup = drawDots(points, graphColor, dotSize)
  const dotScale =
    n === 1
      ? (radiusAvg1 + dotSize) / (radius1 + dotSize)
      : (radiusAvg + dotSize) / (radiusN + dotSize)
  dotGroup.scale(dotScale, center)

  swatch.sendToBack()
}
