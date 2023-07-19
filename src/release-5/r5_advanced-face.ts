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
import { getAdvancedHue, oneDotRadius } from './r5_common'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const graphColor = '#333'
const graphThickness = 3
const shellGap = 36
const proximity = 150

export const r5AdvancedFace = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
  waves: boolean,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const max = 52
  const isInfinity = n >= total - 1
  if (isInfinity && n === total - 1) n = max - 1
  else if (isInfinity) n = max
  // n += 70

  const hue = getAdvancedHue(n, total)

  const shellColor = {
    hue: 0,
    saturation: 0,
    brightness: 0,
  }

  let swatchColor = {
    hue,
    saturation: 0.075,
    brightness: 1,
  }

  if (isInfinity) {
    swatchColor = {
      hue: 0,
      saturation: 0,
      brightness: 1,
    }
  }

  const x = canvasW / 2
  const y = canvasH / 3
  const center = new paper.Point(x, y)

  const container = new paper.Path.Rectangle({
    point: [0, 0],
    size: [canvasW, canvasH],
  })

  const swatch = container.clone()
  swatch.fillColor = swatchColor as paper.Color

  const radius = getRadius(proximity, n)
  const points = getPoints(center, radius, n)

  // const infinityRadius = getRadius(proximity, 45) // - graphThickness / 2
  const infinityRadius = getRadius(proximity, total) + 2

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
      center: new paper.Point(center.x, center.y - 5),
      size: canvasH * 1.5,
      radius,
      shelln: 31,
      shellColor,
      shellThickness: 1,
      shellGap,
      dashArray: [1, 3],
    })
  }

  // const dotRadius = (shellGap * 3) / 6

  if (n > 0) {
    const linesByLength = drawGraphsAndShells({
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
      dotRadius: n === 1 ? (isInfinity ? infinityRadius : 0) : 0,
      dashArray: [1, 3],
    })

    if (isInfinity) {
      Object.values(linesByLength).forEach((lines, i, list) => {
        const childStrokeColor = new paper.Color({
          hue: getAdvancedHue(i, list.length),
          saturation: 0.6,
          brightness: 0.89,
        })
        const childGroup = new paper.Group(lines)
        childGroup.strokeColor = childStrokeColor
        childGroup.blendMode = 'multiply'
      })
    }
  }

  if (isInfinity && n === 1) {
    const gap = graphThickness * 2
    const count = Math.ceil(infinityRadius / gap)
    for (let i = 0; i < count; i++) {
      new paper.Path.Circle({
        center,
        radius: infinityRadius - gap * i,
        strokeColor: graphColor,
        strokeWidth: graphThickness,
      })
    }
  } else if (n >= 1 && n <= 4) {
    // drawDots(points, graphColor, dotRadius)
    if (n === 1) drawDots(points, graphColor, oneDotRadius)
  }

  const fontSize = 81
  // if (isInfinity) fontSize *= 1.5
  const yBottom = canvasH - BLEED * 2 + fontSize / 3
  const yNudge = -fontSize
  const textPoint: [number, number] = [
    canvasW / 2,
    yBottom + yNudge,
    // canvasH - canvasW / 2.5 + fontSize / 3,
  ]
  if (!isInfinity) {
    new paper.PointText({
      point: textPoint,
      content: n,
      justification: 'center',
      fillColor: graphColor,
      fontFamily: 'FuturaLight',
      fontSize,
      opacity: 0.9,
    })
  }

  // if (n === 0) {
  //   // nothing
  //   const word = 'nothing'.split('').join('')
  //   const wordFontSize = 48 * 1.125
  //   const ySpace = BLEED * 2 + wordFontSize / 2 - 5
  //   const wordPoint = new paper.Point([canvasW / 2, canvasH - ySpace])
  //   new paper.PointText({
  //     point: wordPoint,
  //     content: word,
  //     justification: 'center',
  //     fillColor: strokeColor,
  //     fontFamily: 'FuturaLight',
  //     fontSize: wordFontSize,
  //   })
  // }
  if (n > Infinity) {
    // dimensions
    const dimensions = ['', '0d', '1d', '2d', '3d', '4d', '']
    const forms = ['nothing', 'point', 'line', 'plane', 'volume', 'bulk', '']
    let dimension = n === 2 ? dimensions[n] : dimensions[n]?.split('').join(' ')
    let form = forms[n]?.split('').join(' ')
    if (isInfinity) {
      dimension = '+D'
      form = 'all thing'
    }
    const wordFontSize = 44
    const xSpace = BLEED * 2 + wordFontSize * 0.4
    const ySpace = BLEED * 2 + wordFontSize / 2 - 5
    const formPoint = new paper.Point([canvasW / 2, canvasH - ySpace])
    const dimensionPoint = new paper.Point([xSpace, canvasH - ySpace])
    const opacity = 0.67
    new paper.PointText({
      point: dimensionPoint,
      content: dimension,
      justification: 'left',
      fillColor: isInfinity ? swatchColor : graphColor,
      fontFamily: 'FuturaLight',
      fontSize: wordFontSize,
      opacity,
    })
    new paper.PointText({
      point: formPoint,
      content: form,
      justification: 'center',
      fillColor: isInfinity ? swatchColor : graphColor,
      fontFamily: 'FuturaLight',
      fontSize: wordFontSize,
      opacity,
    })
  }

  swatch.sendToBack()

  drawBleed(canvasW, canvasH, BLEED)
}
