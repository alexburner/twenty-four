import paper from 'paper'
import { words } from '../../constants'
import { drawDots, drawGraphsAndShells, getPoints } from '../../draw'
import { drawTerrain } from '../../drawTerrain'

const BLEED = 36

const canvasW = 300 * 5.5 + BLEED * 2
const canvasH = 300 * 8.5 + BLEED * 2

const graphColor = '#333'
const graphThickness = 16
const dashArray: [number, number] = [1, 3]
const shellGap = 36
const proximity = 140

export const r1 = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const hue = ((360 * ((n - 1) / (total + 1))) % 360) - 0

  const isInfinity = n === total
  if (isInfinity) n = 1

  const shellColor = {
    hue: 0,
    saturation: 0,
    brightness: 0,
    alpha: 0,
  }

  let swatchColor = {
    hue,
    saturation: 0,
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

  const radius = 520
  const points = getPoints(center, radius, n)

  if (n === 1 && !isInfinity) {
    const point = points[0]
    if (!point) throw new Error('Unreachable')
    point.y -= radius
  }

  new paper.Path.Circle({
    fillColor: 'white',
    strokeColor: 'black',
    strokeWidth: graphThickness * 0.5,
    opacity: 0.5,
    center: center,
    radius: radius,
    dashArray: [6, 6],
  })

  if (n === 0) {
    drawTerrain({
      width: canvasW,
      height: canvasH,
      seedCoords: [
        // bottom center
        // [0.5 * canvasW, canvasH + 0.125 * canvasH],
        // top center
        // [0.5 * canvasW, -0.125 * canvasH],
        // one side
        // [-0.125 * canvasW, 0.5 * canvasH],
        // one center
        [0.5 * canvasW, 0.5 * canvasW],
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

  let dotRadius = graphThickness * 5
  if (isInfinity) {
    dotRadius = radius + graphThickness
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
      shelln: 65,
      shellGap,
      graphThickness,
      twoTouch: true,
      dotRadius:
        n === 1 && !isInfinity ? dotRadius - graphThickness * 2 : dotRadius,
      dashArray,
    })
  }

  drawDots(points, graphColor, dotRadius)

  let fontSize = 360
  const textPoint: [number, number] = [
    canvasW / 2,
    canvasW + (canvasH - canvasW) / 2,
  ]
  textPoint[1] -= shellGap * 2
  // new Array(5).fill(null).forEach((_, i) => {
  //   new paper.PointText({
  //     point: textPoint,
  //     content: isInfinity ? '∞' : n,
  //     justification: 'center',
  //     fillColor: swatchColor,
  //     fontFamily: isInfinity ? 'Noto Serif JP' : 'FuturaLight',
  //     fontSize,
  //     strokeColor: swatchColor,
  //     strokeWidth: (i + 1) * 4,
  //     strokeJoin: 'round',
  //     strokeCap: 'round',
  //   })
  // })
  new paper.PointText({
    point: textPoint,
    content: isInfinity ? '∞' : n,
    justification: 'center',
    fillColor: graphColor,
    fontFamily: isInfinity ? 'Noto Serif JP' : 'FuturaLight',
    fontSize,
    opacity: 0.9,
  })

  fontSize = 90
  textPoint[1] += fontSize * 1.5

  const word = (isInfinity ? 'infinity' : words[n])?.split('').join(' ')

  // new Array(5).fill(null).forEach((_, i) => {
  //   new paper.PointText({
  //     point: textPoint,
  //     content: word,
  //     justification: 'center',
  //     fillColor: swatchColor,
  //     fontFamily: 'FuturaLight',
  //     fontSize,
  //     strokeColor: swatchColor,
  //     strokeWidth: (i + 1) * 4,
  //     strokeJoin: 'round',
  //     strokeCap: 'round',
  //   })
  // })
  new paper.PointText({
    point: textPoint,
    content: word,
    justification: 'center',
    fillColor: graphColor,
    fontFamily: 'FuturaLight',
    fontSize,
    opacity: 0,
  })

  swatch.sendToBack()
}
