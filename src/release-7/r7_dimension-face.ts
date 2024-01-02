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

const graphColor = '#333'
const graphThickness = 4
const shellGap = 36
const proximity = 150

const dotRadius = graphThickness * 3

export const r7DimensionFace = (
  canvas: HTMLCanvasElement,
  n: number,
  _total: number,
  waves: boolean,
): void => {
  // total = 14

  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  // const hue = getAdvancedHue(n, total)

  const shellColor = new paper.Color('black')
  shellColor.alpha = 0.5

  const swatchColor = {
    hue: 0,
    saturation: 0,
    brightness: 1,
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

  if (waves && n === 0) {
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
      center: new paper.Point(center.x, center.y + 2),
      size: canvasH * 1.5,
      radius,
      shelln: 31,
      shellColor,
      shellGap,
      dashArray: [2, 3],
      shellThickness: 2,
    })
  }

  if (n > 0) {
    // const linesByLength = drawGraphsAndShells({
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
      graphThickness: graphThickness,
      twoTouch: true,
      dotRadius: 6,
      // dotRadius: shellGap / 2 + 4,
      // dotRadius: dotRadius - graphThickness,
      // dotRadius: dotRadius + 2,
      // dotRadius: 3,
      dashArray: n > 2 ? [0.5, 4] : [2, 3],
      shellThickness: 2,
    })
  }

  if (n === 1) drawDots(points, graphColor, dotRadius)

  const fontSize = 54
  const dPoint: [number, number] = [
    canvasW / 2,
    // canvasH - BLEED * 2 - fontSize / 3 - 4,
    // canvasH - canvasW / 2.75 + fontSize / 3,
    // canvasH * 0.75,
    canvasH - BLEED * 6.8,
  ]
  new paper.PointText({
    point: dPoint,
    content: n === 0 ? '' : `${n - 1}${n === 2 ? '' : ' '}D`,
    justification: 'center',
    fillColor: graphColor,
    fontFamily: 'FuturaLight',
    fontSize: fontSize * 1.25,
  })
  {
    const things = [
      'no thing',
      'point',
      'line',
      'plane',
      'volume',
      'hypervolume',
      'hyper2volume',
      'hyper3volume',
    ]
    const thingFontSize = fontSize * 1
    const thingPoint = new paper.Point(
      dPoint[0],
      dPoint[1] + thingFontSize * 1.67,
    )
    new paper.PointText({
      point: thingPoint,
      content: things[n]?.split('').join(' ') ?? '',
      justification: 'center',
      fillColor: graphColor,
      fontFamily: 'FuturaLight',
      fontSize: thingFontSize,
      opacity: 0.9,
    })

    // const things2 = [
    //   undefined,
    //   undefined,
    //   'triangle',
    //   'tetrahedron',
    //   'pentachoron',
    //   'hexateron',
    //   'heptapeton',
    // ]
    // let thing2 = things2[n - 1]
    // thing2 = thing2 ? thing2.split('').join(' ') : undefined
    // if (thing2) {
    //   const thing2Point = thingPoint.clone()
    //   thing2Point.y += thingFontSize * 1.5
    //   new paper.PointText({
    //     point: thing2Point,
    //     content: thing2,
    //     justification: 'center',
    //     fillColor: graphColor,
    //     fontFamily: 'FuturaLight',
    //     fontSize: thingFontSize * 1,
    //     opacity: 0.5,
    //   })
    // }
  }

  swatch.sendToBack()

  drawBleed(canvasW, canvasH, BLEED)
}
