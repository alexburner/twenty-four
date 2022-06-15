import paper from 'paper'
import { drawByLength, drawDots, getPoints, getRadius } from '../draw'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const graphColor = '#333'
const proximity = 90

export const tarotDots = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const color = {
    hue: (360 * ((n - 1) / (total + 2))) % 360,
    saturation: 0.9,
    brightness: 0.9,
  }

  const shellColor = {
    ...color,
    saturation: 0.2,
    brightness: 0.95,
  }

  const swatchColor = {
    ...color,
    saturation: 0.2,
    brightness: 0.95,
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

  const dotSize = 36
  const radiusN = getRadius(proximity, n > 2 ? n : 2)
  const radiusTotal = getRadius(proximity, total)
  const radiusAvg = (radiusN + radiusTotal) / 2

  const points = getPoints(center, radiusN, n)

  drawByLength(
    container,
    center,
    proximity,
    radiusN,
    canvasH * 1.5,
    n,
    shellColor,
    shellColor,
    points,
    30,
    36,
  )

  const dotGroup = drawDots(points, graphColor, dotSize)
  const dotScale =
    n > 1
      ? (radiusAvg + dotSize) / (radiusN + dotSize)
      : (radiusAvg + dotSize) / (dotSize * 2)
  // : (radiusTotal + dotSize) / dotSize
  // : (radiusTotal + dotSize) / (getRadius(proximity, 2) + dotSize)
  dotGroup.scale(dotScale, center)

  new paper.PointText({
    point: [canvasW / 2, canvasW + (canvasH - canvasW) / 2],
    content: n,
    justification: 'center',
    fillColor: color,
    fontFamily: 'Futura',
    fontSize: 160,
    strokeColor: swatchColor,
    strokeWidth: 18,
    strokeJoin: 'round',
    strokeCap: 'round',
  })

  new paper.PointText({
    point: [canvasW / 2, canvasW + (canvasH - canvasW) / 2],
    content: n,
    justification: 'center',
    fillColor: graphColor,
    fontFamily: 'Futura',
    fontSize: 160,
  })

  swatch.sendToBack()
}
