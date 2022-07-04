import paper from 'paper'
import { drawDots, getPoints, getRadius } from '../draw'

const BLEED = 36

const canvasW = 300 * 3.5 + BLEED * 2
const canvasH = 300 * 3.5 + BLEED * 2

const graphColor = '#333'
const proximity = 200

export const splitYoungFront = (
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
    saturation: 0.6,
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

  const dotSize = 86
  const radius = getRadius(proximity, n)
  const points = getPoints(center, radius, n)
  drawDots(points, graphColor, dotSize)

  swatch.sendToBack()
}
