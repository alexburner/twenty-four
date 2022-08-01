import paper from 'paper'
import { drawBleed, drawDots, drawLines, getPoints, spreadLines } from '../draw'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const strokeColor = '#333' as unknown as paper.Color
const strokeWidth = 5
const radius = 80

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

  const container = new paper.Path.Rectangle({
    point: [0, 0],
    size: [canvasW, canvasH],
  })

  const swatch = container.clone()
  swatch.fillColor = swatchColor as paper.Color

  const center = new paper.Point(canvasW / 2, canvasH / 2)
  const points = getPoints(center, radius, n)

  if (n === 1) {
    drawDots(points, strokeColor, strokeWidth * 2)
  }

  const linesByLength = drawLines({
    points,
    strokeColor,
    strokeWidth: 5,
  })

  const lengthCount = Object.keys(linesByLength).length

  const spread = spreadLines({
    linesByLength,
    distance: radius * 2 + (radius * 3) / lengthCount,
  })

  spread.position = center

  swatch.sendToBack()

  drawBleed(canvasW, canvasH, BLEED)
}
