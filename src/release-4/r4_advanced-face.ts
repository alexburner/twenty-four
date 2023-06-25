import paper from 'paper'
import {
  drawBleed,
  drawDots,
  drawGraphsAndShells,
  drawZeroShells,
  getPoints,
  getRadius,
} from '../draw'
import { drawTerrain } from '../drawTerrain'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const strokeColor = '#333' as unknown as paper.Color
const graphColor = '#333'
const graphThickness = 3
const shellGap = 36
const proximity = 140

export const r4AdvancedFace = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
  waves: boolean,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const isInfinity = n === total
  if (isInfinity) n = 1

  const shellColor = {
    hue: 0,
    saturation: 0,
    brightness: 0.6,
  }

  const swatchColor = {
    hue: 0,
    saturation: 0,
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

  const infinityRadius = getRadius(proximity, 12)

  if (n === 0 && waves) {
    drawTerrain({
      width: canvasW,
      height: canvasH,
      seedCoords: [
        // bottom center
        [0.5 * canvasW, canvasH + 0.125 * canvasH],
      ],
      seedRadiusScale: shellGap * 2,
      seedRadiusMin: shellGap / 2,
      noiseRadius: 0.6,
      noiseCount: 60,
      ringCount: 100,
      strokeWidth: 1,
      strokeColor: shellColor as paper.Color,
      shellGap,
    })
  } else if (n === 0) {
    drawZeroShells({
      center: new paper.Point(center.x, center.y - shellGap / 2),
      size: canvasH * 1.5,
      radius,
      shelln: 31,
      shellColor,
      shellThickness: 1,
      shellGap,
    })
  }

  const dotRadius = shellGap / 2

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
        n === 1
          ? isInfinity
            ? infinityRadius - dotRadius * 0.75
            : dotRadius - graphThickness * 2
          : dotRadius,
    })
  }

  if (isInfinity) {
    new paper.Path.Circle({
      center,
      radius: infinityRadius,
      strokeColor: graphColor,
      strokeWidth: dotRadius * 2,
    })

    const gap = graphThickness * 2
    const interiorRadius = infinityRadius - dotRadius - graphThickness
    const count = Math.ceil(interiorRadius / gap)
    for (let i = 0; i < count; i++) {
      new paper.Path.Circle({
        center,
        radius: interiorRadius - gap * i,
        strokeColor: graphColor,
        strokeWidth: graphThickness,
      })
    }
  } else {
    drawDots(points, graphColor, dotRadius)
  }

  let fontSize = 100
  if (isInfinity) fontSize = 110
  const textPoint: [number, number] = [
    canvasW / 2,
    canvasH - canvasW / 2.5 + fontSize / 3,
  ]
  new paper.PointText({
    point: textPoint,
    content: isInfinity ? '∞' : n,
    justification: 'center',
    fillColor: graphColor,
    fontFamily: isInfinity ? 'Noto Serif JP' : 'Futura-Light',
    fontSize,
    opacity: 0.9,
  })

  if (n === 0) {
    // nothing
    const word = 'nothing'.split('').join(' ')
    const wordFontSize = 48 * 1.125
    const ySpace = BLEED * 2 + wordFontSize / 2 - 5
    const wordPoint = new paper.Point([canvasW / 2, canvasH - ySpace])
    new paper.PointText({
      point: wordPoint,
      content: word,
      justification: 'center',
      fillColor: strokeColor,
      fontFamily: 'Futura-Light',
      fontSize: wordFontSize,
    })
  }
  if (n >= 1 && n <= 5 && !isInfinity) {
    // dimensions
    const dimensions = ['0d', '1d', '2d', '3d', '4d']
    const forms = ['point', 'line', 'plane', 'volume', 'bulk']
    const dimension =
      n === 2 ? dimensions[n - 1] : dimensions[n - 1]?.split('').join(' ')
    const form = forms[n - 1]?.split('').join(' ')
    const wordFontSize = 48 * 1.125
    const xSpace = BLEED * 2 + wordFontSize * 0.64
    const ySpace = BLEED * 2 + wordFontSize / 2 - 5
    const dimensionPoint = new paper.Point([xSpace, canvasH - ySpace])
    const formPoint = new paper.Point([canvasW - xSpace, canvasH - ySpace])
    new paper.PointText({
      point: dimensionPoint,
      content: dimension,
      justification: 'left',
      fillColor: strokeColor,
      fontFamily: 'Futura-Light',
      fontSize: wordFontSize,
    })
    new paper.PointText({
      point: formPoint,
      content: form,
      justification: 'right',
      fillColor: strokeColor,
      fontFamily: 'Futura-Light',
      fontSize: wordFontSize,
    })
  }

  swatch.sendToBack()

  drawBleed(canvasW, canvasH, BLEED)
}
