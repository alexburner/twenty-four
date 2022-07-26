import paper from 'paper'
import { words } from '../constants'
import { drawDots, drawGraphsAndShells, getPoints, getRadius } from '../draw'
import { drawTerrain } from '../drawTerrain'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const graphColor = '#333'
const graphThickness = 3
const shellGap = 36
const proximity = 160

export const elementaryFace = (
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
    drawDots(points, graphColor, graphThickness * 2)
  }

  const fontSize = 72
  const textPoint: [number, number] = [
    canvasW / 2,
    canvasH - fontSize * 3 - fontSize * (6 / 12),
  ]
  new Array(5).fill(null).forEach((_, i) => {
    new paper.PointText({
      point: textPoint,
      content: n,
      justification: 'center',
      fillColor: swatchColor,
      fontFamily: 'Futura-Light',
      fontSize,
      strokeColor: swatchColor,
      strokeWidth: (i + 1) * 4,
      strokeJoin: 'round',
      strokeCap: 'round',
    })
  })
  new paper.PointText({
    point: textPoint,
    content: n,
    justification: 'center',
    fillColor: graphColor,
    fontFamily: 'Futura-Light',
    fontSize,
    opacity: 0.9,
  })

  const word = words[n]?.split('').join(' ')
  const fontSizeWord = 48
  const textPointWord = [canvasW / 2, canvasH - fontSizeWord * 3]
  new Array(5).fill(null).forEach((_, i) => {
    new paper.PointText({
      point: textPointWord,
      content: word,
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
    content: word,
    justification: 'center',
    fillColor: graphColor,
    fontFamily: 'Futura-Light',
    fontSize: fontSizeWord,
    opacity: 0.9,
  })

  swatch.sendToBack()
}
