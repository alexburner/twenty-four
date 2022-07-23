import paper from 'paper'
import { drawGraphsAndShells, drawDots, getPoints, getRadius } from '../draw'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const graphColor = '#333'
const proximity = 90

export const split2OldFront = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const hue = ((360 * ((n - 1) / (total + 1))) % 360) - 0

  const swatchColor = {
    hue,
    saturation: 1 / 3,
    brightness: 1,
  }

  const shellColor = swatchColor

  const x = canvasW / 2
  const y = x
  const center = new paper.Point(x, y)

  const container = new paper.Path.Rectangle({
    point: [0, 0],
    size: [canvasW, canvasH],
  })

  const swatch = container.clone()
  swatch.fillColor = swatchColor as paper.Color

  const dotSize = 38
  const radius = getRadius(proximity, n)

  const points = getPoints(center, radius, n)

  drawGraphsAndShells({
    container,
    center,
    proximity,
    radius,
    size: canvasH * 1.5,
    n,
    graphColor: shellColor,
    shellColor,
    points,
    shelln: 0,
  })

  drawDots(points, graphColor, dotSize)

  new paper.PointText({
    point: [canvasW / 2, canvasW + (canvasH - canvasW) / 2],
    content: n,
    justification: 'center',
    fillColor: graphColor,
    fontFamily: 'Futura',
    fontSize: 140,
  })

  swatch.sendToBack()
}
