import paper from 'paper'
import { words } from '../constants'
import { drawGraphsAndShells, getPoints, getRadius } from '../draw'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const graphColor = '#333'
const proximity = 90

export const split2OldBack = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const hue = ((360 * ((n - 1) / (total + 1))) % 360) - 0

  const shellColor = {
    hue,
    saturation: 1,
    brightness: 0.9,
  }

  const swatchColor = {
    hue,
    saturation: 0.1,
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

  drawGraphsAndShells({
    container,
    center,
    proximity,
    radius,
    size: canvasH * 1.5,
    n,
    graphColor,
    shellColor,
    points,
    shelln: 31,
    shellGap: 36,
    graphThickness: 3,
    twoTouch: true,
  })

  const word = words[n]?.split('').join(' ')

  const fontSize = 48
  const textPoint = [canvasW / 2, canvasH - fontSize * 3]

  new Array(5).fill(null).forEach((_, i) => {
    new paper.PointText({
      point: textPoint,
      content: word,
      justification: 'center',
      fillColor: swatchColor,
      fontFamily: 'FuturaLight',
      fontSize,
      strokeColor: swatchColor,
      strokeWidth: (i + 1) * 4,
      strokeJoin: 'round',
      strokeCap: 'round',
    })
  })

  new paper.PointText({
    point: textPoint,
    content: word,
    justification: 'center',
    fillColor: graphColor,
    fontFamily: 'FuturaLight',
    fontSize,
    opacity: 0.9,
  })

  swatch.sendToBack()
}
