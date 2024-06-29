import paper from 'paper'
import {
  drawBleed,
  drawDots,
  drawGraphsAndShells,
  drawOutline,
  getPoints,
} from '../draw'

const BLEED = 36

const canvasW = 300 * 5 + BLEED * 2
const canvasH = 300 * 7 + BLEED * 2

const graphColor = new paper.Color('black')
const fillColor = new paper.Color('white')
const circleColor = new paper.Color('black')
circleColor.alpha = 0.5
const graphThickness = 16
const circleThickness = graphThickness * 0.5
const proximity = 150
const radius = 415
const dotRadius = 80

export const r8JumboSimple = (...props: Parameters<typeof r8Jumbo>): void => {
  props[4] = true
  r8Jumbo(...props)
}

export const r8Jumbo = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
  _waves: boolean,
  simple?: boolean,
): void => {
  /**
   * Playground game (summoning circle)
   * - evenly space yourselves in a ring
   * - > once settled, give each person chalk
   * - draw a circle around your feet
   * - connect your dot to everyone else's
   */

  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const hue = ((360 * ((n - 0.8) / (total + 3.95))) % 360) + 0

  const swatchColor = new paper.Color({
    hue,
    saturation: 0.42,
    brightness: 0.99,
  })

  const shellColor = new paper.Color('transparent')

  const x = canvasW / 2
  const y = canvasW / 2
  const center = new paper.Point(x, y)

  const container = new paper.Path.Rectangle({
    point: [0, 0],
    size: [canvasW, canvasH],
  })

  const swatch = container.clone()
  swatch.fillColor = swatchColor as paper.Color

  const points = getPoints(center, radius, n, true)

  new paper.Path.Circle({
    center,
    radius,
    strokeColor: circleColor,
    strokeWidth: circleThickness,
    strokeCap: 'round',
    strokeJoin: 'round',
    dashArray: [0, circleThickness * 1.455],
  })

  drawOutline({
    points,
    strokeColor: graphColor,
    strokeWidth: simple ? 4 : 0,
    fillColor,
  })

  if (n > 0 && !simple) {
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
      graphThickness: graphThickness,
    })
  }

  drawDots(points, graphColor, dotRadius)

  const fontSize = 420
  const pointText = center.clone()
  pointText.y = canvasH * 0.78
  pointText.y += fontSize * 0.33
  new paper.PointText({
    point: pointText,
    content: n,
    justification: 'center',
    fillColor: graphColor,
    fontFamily: 'Futura',
    fontSize,
  })

  swatch.sendToBack()

  drawBleed(canvasW, canvasH, BLEED)
}
