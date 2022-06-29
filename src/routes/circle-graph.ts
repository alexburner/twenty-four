import paper from 'paper'
import { white } from '../constants'
import { drawByLength, getPoints, getRadius } from '../draw'

const BLEED = 36

const canvasW = 300 * 3.5 + BLEED * 2
const canvasH = 300 * 3.5 + BLEED * 2

const graphColor = '#333'
const proximity = 140

export const circleGraph = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const hue = ((360 * ((n - 1) / (total + 1))) % 360) - 8

  let shellColor = {
    hue,
    saturation: 1,
    brightness: 0.9,
  }

  let swatchColor = {
    hue,
    saturation: 0.1,
    brightness: 1,
  }

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

  const radius = getRadius(proximity, n)
  const points = getPoints(center, radius, n)

  drawByLength({
    container,
    center,
    proximity,
    radius,
    size: canvasH * 1.5,
    n,
    graphColor,
    shellColor,
    points,
    shelln: 30,
    shellGap: 36,
  })

  swatch.sendToBack()
}
