import paper from 'paper'
import { drawByLength, getPoints, getRadius } from '../draw'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const graphColor = '#333'
const proximity = 100
const total = 24

export const tarotGraph = (canvas: HTMLCanvasElement, n: number): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const color =
    n > 0
      ? {
          hue: (360 * ((n - 1) / (total + 1)) - 5) % 360,
          saturation: 0.9,
          brightness: 0.9,
        }
      : {
          hue: 0,
          saturation: 0,
          brightness: 1,
        }

  const shellColor = {
    ...color,
    saturation: 0.4,
    brightness: 0.8,
  }

  const x = canvasW / 2
  const y = x
  const center = new paper.Point(x, y)

  const container = new paper.Path.Rectangle({
    point: [0, 0],
    size: [canvasW, canvasH],
  })

  const swatch = container.clone()
  swatch.fillColor = color as paper.Color
  swatch.opacity = 1 / 6

  const radius = getRadius(proximity, n)
  const points = getPoints(center, radius, n)

  drawByLength(
    container,
    center,
    proximity,
    radius,
    canvasH * 1.5,
    n,
    graphColor,
    shellColor,
    points,
    30,
  )
}
