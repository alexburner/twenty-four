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
    saturation: 0.2,
    brightness: 0.95,
  }

  const swatchColor =
    n > 0
      ? {
          ...color,
          saturation: 0.2,
          brightness: 0.95,
        }
      : color

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

  drawByLength(
    container,
    center,
    proximity,
    radius,
    canvasH * 1.5,
    n,
    shellColor,
    shellColor,
    points,
    30,
    36,
  )

  drawDots(points, graphColor, 36)

  new paper.PointText({
    point: [canvasW / 2, canvasW + (canvasH - canvasW) / 2],
    content: n,
    justification: 'center',
    fillColor: color,
    fontFamily: 'Futura',
    fontSize: 100,
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
    fontSize: 100,
  })

  swatch.sendToBack()
}
