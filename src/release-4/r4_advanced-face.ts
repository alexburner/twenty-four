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
import { getAdvancedHue, oneDotRadius } from './r4_common'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const strokeColor = '#333' as unknown as paper.Color
const graphColor = '#333'
const graphThickness = 3
const shellGap = 36
const proximity = 150

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
  // const isInfinity = false
  if (isInfinity) n = 1

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
      center: new paper.Point(center.x, center.y - shellGap / 2),
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
      dotRadius: n === 1 ? (isInfinity ? infinityRadius : 0) : 0,
      dashArray: [1, 3],
    })
  }

  if (isInfinity) {
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

  let fontSize = 100
  if (isInfinity) fontSize *= 1.5
  const textPoint: [number, number] = [
    canvasW / 2,
    canvasH - canvasW / 2.5 + fontSize / 3,
  ]
  new paper.PointText({
    point: textPoint,
    content: isInfinity ? '∞' : n,
    justification: 'center',
    fillColor: graphColor,
    // fillColor: isInfinity ? swatchColor : graphColor,
    fontFamily: isInfinity ? 'Noto Serif JP' : 'Futura-Light',
    fontSize,
    opacity: 0.9,
  })

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
  //     fontFamily: 'Futura-Light',
  //     fontSize: wordFontSize,
  //   })
  // }
  if (n >= 0 && n <= 6) {
    // dimensions
    const dimensions = ['_D', '0D', '1D', '2D', '3D', '4D']
    const forms = ['nothing', 'point', 'line', 'plane', 'volume', 'bulk']
    let dimension = n === 2 ? dimensions[n] : dimensions[n]?.split('').join(' ')
    let form = forms[n]?.split('').join(' ')
    if (isInfinity) {
      dimension = '+D'
      form = 'all thing'
    }
    const wordFontSize = 46
    const xSpace = BLEED * 2 + wordFontSize * 0.4
    const ySpace = BLEED * 2 + wordFontSize / 2 - 5
    const dimensionPoint = new paper.Point([canvasW - xSpace, canvasH - ySpace])
    const formPoint = new paper.Point([xSpace, canvasH - ySpace])
    new paper.PointText({
      point: formPoint,
      content: dimension,
      justification: 'left',
      fillColor: strokeColor,
      fontFamily: 'Futura-Light',
      fontSize: wordFontSize,
    })
    new paper.PointText({
      point: dimensionPoint,
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
