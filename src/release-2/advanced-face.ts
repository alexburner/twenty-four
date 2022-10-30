import paper from 'paper'
import {
  drawBleed,
  drawDots,
  drawGraphsAndShells,
  getPoints,
  getRadius,
} from '../draw'
import { drawTerrain } from '../drawTerrain'
import { getAdvancedHue } from './r2-common'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const graphColor = '#333'
const graphThickness = 3
const dashArray: [number, number] = [1, 3]
const shellGap = 36
const proximity = 140

export const advancedFace = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const hue = getAdvancedHue(n, total)

  const isInfinity = n === total
  if (isInfinity) n = 1

  const shellColor = {
    hue: 0,
    saturation: 0,
    brightness: 0,
    alpha: 3 / 4,
  }

  let swatchColor = {
    hue,
    saturation: 0.075,
    brightness: 1,
  }

  // const fixedN = isInfinity ? total : n
  // const rybHue = ((360 * ((fixedN - 1) / (total - 0))) % 360) - 0
  // swatchColor = getRYB(0, 0, rybHue, 1, 0.15) as unknown as paper.Color

  if (n === 0 || isInfinity) {
    swatchColor = {
      hue: 0,
      saturation: 0,
      brightness: 1,
    }
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

  if (n === 0) {
    drawTerrain({
      width: canvasW,
      height: canvasH,
      seedCoords: [
        // bottom center
        [0.5 * canvasW, canvasH + 0.125 * canvasH],
        // top center
        // [0.5 * canvasW, -0.125 * canvasH],
        // one side
        // [-0.125 * canvasW, 0.5 * canvasH],
        // one center
        // [0.5 * canvasW, 0.5 * canvasW],
        // one bottom
        // [0.5, 1.2],
        // two
        // [-0.2, 1 / 3],
        // [1.2, 2 / 3],
        // two vert
        // [0.5, -0.5],
        // [0.5, 1.1],
        // three
        // [-0.2, 1 / 4],
        // [1.2, 2 / 4],
        // [-0.2, 3 / 4],
      ],
      seedRadiusScale: shellGap * 2,
      seedRadiusMin: shellGap / 2,
      noiseRadius: 0.6,
      noiseCount: 60,
      ringCount: 100,
      strokeWidth: 1,
      strokeColor: shellColor as paper.Color,
      shellGap,
      dashArray,
    })
  }

  let dotRadius = graphThickness * 7
  if (isInfinity) {
    dotRadius = getRadius(proximity, 12) // + graphThickness // + dotThickness
  }

  if (n > 0) {
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
      shellGap,
      graphThickness,
      twoTouch: true,
      dotRadius:
        n === 1 && !isInfinity ? dotRadius - graphThickness * 2 : dotRadius,
      dashArray,
    })
  }

  drawDots(points, graphColor, dotRadius)

  const fontSize = 64
  const textPoint: [number, number] = [
    canvasW / 2,
    canvasH - fontSize * 2 - BLEED - 20,
  ]
  if (n === 0) textPoint[1] += 0
  if (n === 1) textPoint[1] += 3
  if (n === 3) textPoint[1] -= 8
  if (n === 4) textPoint[1] += 10
  if (n === 5) textPoint[1] -= 3
  if (n === 6) textPoint[1] += 2
  if (n === 7) textPoint[1] -= 10
  if (n === 8) textPoint[1] += 1
  if (n === 9) textPoint[1] -= 0
  if (n === 10) textPoint[1] -= 13
  if (n === 11) textPoint[1] += 9
  if (isInfinity) textPoint[1] += 3
  new Array(5).fill(null).forEach((_, i) => {
    new paper.PointText({
      point: textPoint,
      content: isInfinity ? '∞' : n,
      justification: 'center',
      fillColor: swatchColor,
      fontFamily: isInfinity ? 'Noto Serif JP' : 'Futura-Light',
      fontSize,
      strokeColor: swatchColor,
      strokeWidth: (i + 1) * 4,
      strokeJoin: 'round',
      strokeCap: 'round',
    })
  })
  new paper.PointText({
    point: textPoint,
    content: isInfinity ? '∞' : n,
    justification: 'center',
    fillColor: graphColor,
    fontFamily: isInfinity ? 'Noto Serif JP' : 'Futura-Light',
    fontSize,
    opacity: 0.9,
  })

  swatch.sendToBack()

  drawBleed(canvasW, canvasH, BLEED)
}
