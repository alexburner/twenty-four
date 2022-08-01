import paper from 'paper'
import { getPoints, getRadius } from '../draw'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const graphColor = '#333'
const proximity = 90

export const elementaryBack = (
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

  const x = canvasW / 2
  const y = x
  const center = new paper.Point(x, y)

  const container = new paper.Path.Rectangle({
    point: [0, 0],
    size: [canvasW, canvasH],
  })

  const swatch = container.clone()
  swatch.fillColor = swatchColor as paper.Color

  const radius = getRadius(proximity, n)
  const points = getPoints(center, radius, n)

  // drawGraphsAndShells({
  //   container,
  //   center,
  //   proximity,
  //   radius,
  //   size: canvasH * 1.5,
  //   n,
  //   graphColor: shellColor,
  //   shellColor,
  //   points,
  //   shelln: 0,
  // })

  swatch.sendToBack()
}
