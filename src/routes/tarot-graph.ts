import paper from 'paper'
import { drawByLength, getPoints, getRadius } from '../draw'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const graphColor = '#333'
const proximity = 90

const words = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty',
  'twenty one',
  'twenty two',
  'twenty three',
  'twenty four',
]

export const tarotGraph = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const color = {
    hue: (360 * (n / (total + 2))) % 360,
    saturation: 0.9,
    brightness: 0.9,
  }

  const shellColor = {
    ...color,
    saturation: 1,
    brightness: 0.8,
  }

  const swatchColor = {
    ...color,
    saturation: 0.12,
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
    36,
  )

  new Array(3).fill(null).forEach((_, i) => {
    new paper.PointText({
      point: [canvasW / 2, canvasW + (canvasH - canvasW) / 2],
      content: words[n],
      justification: 'center',
      fillColor: swatchColor,
      fontFamily: 'Futura-Light',
      fontSize: 80,
      strokeColor: swatchColor,
      strokeWidth: (i + 1) * 10 - 5,
      strokeJoin: 'round',
      strokeCap: 'round',
    })
  })

  new paper.PointText({
    point: [canvasW / 2, canvasW + (canvasH - canvasW) / 2],
    content: words[n],
    justification: 'center',
    fillColor: graphColor,
    fontFamily: 'Futura-Light',
    fontSize: 80,
    opacity: 0.9,
  })

  swatch.sendToBack()
}
