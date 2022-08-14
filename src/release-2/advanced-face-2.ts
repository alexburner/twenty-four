import paper from 'paper'
import { words } from '../constants'
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
const shellGap = 36
const proximity = 160

export const advancedFace = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const isInfinity = n === 13
  if (isInfinity) n = 1

  const hue = ((360 * ((n - 1) / (total - 0))) % 360) - 0

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

  if (n === 0 || isInfinity) {
    shellColor = {
      hue: 0,
      saturation: 0,
      brightness: 0.8,
    }
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
      // voidWidth: canvasW * (1 / 2),
      // voidHeight: canvasH * (1 / 2),
      seedCount: 16,
      seedRadiusScale: shellGap,
      seedRadiusMin: shellGap / 2,
      noiseRadius: 0.6,
      noiseCount: 60,
      ringMax: 32,
      strokeWidth: 1,
      strokeColor: shellColor as paper.Color,
      shellGap,
    })
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
    })
  }

  if (n === 1) {
    const dotRadius = isInfinity ? shellGap * 4 + 1 : graphThickness * 2
    drawDots(points, graphColor, dotRadius)
  }

  const fontSize = 64
  const textPoint: [number, number] = [
    canvasW / 2,
    canvasH - fontSize * 3 + fontSize * (3 / 12) - BLEED - 4,
  ]
  new Array(5).fill(null).forEach((_, i) => {
    new paper.PointText({
      point: textPoint,
      content: isInfinity ? '∞' : n,
      justification: 'center',
      fillColor: swatchColor,
      fontFamily: isInfinity ? 'Montserrat' : 'Futura-Light',
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
    fontFamily: isInfinity ? 'Montserrat' : 'Futura-Light',
    fontSize,
    opacity: 0.9,
  })

  const word = words[n]?.split('').join(' ')
  const infinity = 'infinity'.split('').join(' ')
  const fontSizeWord = 48
  const textPointWord = [canvasW / 2, canvasH - fontSizeWord * 2 - BLEED - 4]
  new Array(5).fill(null).forEach((_, i) => {
    new paper.PointText({
      point: textPointWord,
      content: isInfinity ? infinity : word,
      justification: 'center',
      fillColor: swatchColor,
      fontFamily: 'Futura-Light',
      fontSize: fontSizeWord,
      strokeColor: swatchColor,
      strokeWidth: (i + 1) * 4,
      strokeJoin: 'round',
      strokeCap: 'round',
    })
  })
  new paper.PointText({
    point: textPointWord,
    content: isInfinity ? infinity : word,
    justification: 'center',
    fillColor: graphColor,
    fontFamily: 'Futura-Light',
    fontSize: fontSizeWord,
    opacity: 0.9,
  })

  swatch.sendToBack()

  drawBleed(canvasW, canvasH, BLEED)
}
