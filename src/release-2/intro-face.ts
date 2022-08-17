import paper from 'paper'
import {
  drawBleedRound,
  drawDots,
  drawOutline,
  getPoints,
  getRadius,
} from '../draw'

const BLEED = 36

const canvasW = 300 * 3.5 + BLEED * 2
const canvasH = 300 * 3.5 + BLEED * 2

const graphColor = '#333'
const proximity = 220
const dotRadius = proximity * 0.42

export const introFace = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const hue = ((360 * ((n - 1) / (total + 0))) % 360) - 12

  const swatchColor = {
    hue,
    saturation: 0.7,
    brightness: 1,
  } as paper.Color

  const lightColor = {
    hue,
    saturation: 0.1,
    brightness: 1,
  } as paper.Color

  const x = canvasW / 2
  const y = x
  const center = new paper.Point(x, y)

  const container = new paper.Path.Rectangle({
    point: [0, 0],
    size: [canvasW, canvasH],
  })

  const swatch = container.clone()
  swatch.fillColor = swatchColor

  const radius = getRadius(proximity, n)
  const points = getPoints(center, radius, n)

  if (n > 1) {
    drawOutline({
      points,
      fillColor: lightColor,
      strokeColor: lightColor,
      strokeWidth: (dotRadius * 2) / 4,
    })
  }

  drawDots(points, graphColor, dotRadius)

  swatch.sendToBack()

  drawBleedRound(center, canvasW / 2, BLEED)
}
