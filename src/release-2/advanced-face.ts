import paper from 'paper'
import {
  drawBleed,
  drawDots,
  drawGraphsAndShells,
  getPoints,
  getRadius,
} from '../draw'
import { drawTerrain } from '../drawTerrain'

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

  const isInfinity = n === total
  if (isInfinity) n = 1

  const hue = ((360 * ((n - 1) / (total - 0))) % 360) - 0

  const shellColor = {
    hue: 0,
    saturation: 0,
    brightness: 0,
    alpha: 3 / 4,
  }

  let swatchColor = {
    hue,
    saturation: 0.1,
    brightness: 1,
  }

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
      seedCount: 1,
      seedRadiusScale: shellGap,
      seedRadiusMin: shellGap / 2,
      noiseRadius: 0.6,
      noiseCount: 60,
      ringMax: 100,
      strokeWidth: 1,
      strokeColor: shellColor as paper.Color,
      shellGap,
      dashArray,
    })
  }

  let dotRadius = graphThickness * 7
  if (isInfinity) {
    dotRadius = dotRadius + getRadius(proximity, 12)
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
