import paper from 'paper'
import {
  drawBleed,
  drawGraphsAndShells,
  drawZeroShells,
  getPoints,
  getRadius,
} from '../draw'
import { drawTerrain } from '../drawTerrain'
import { getAdvancedHue } from './r6_common'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const graphColor = '#333'
const graphThickness = 4
const shellGap = 36
const proximity = 150
// const dotRadius = shellGap * 0.45

export const r6AdvancedFaceBack = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
  waves: boolean,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const max = 48
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
    saturation: 0.1,
    brightness: 1,
  }

  if (isInfinity) {
    swatchColor = {
      hue: 0,
      saturation: 0,
      brightness: 1,
    }
  }

  const x = canvasW * 0.5
  const y = canvasH * 0.45
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
  } else if (waves) {
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
      dotRadius: 3,
      // dotRadius: shellGap / 2 + 4,
      // dotRadius: dotRadius - graphThickness,
      // dotRadius: dotRadius + 2,
      // dotRadius: 3,
      dashArray: n > 2 ? [0.5, 4] : [2, 3],
      shellThickness: 2,
    })

    // if (isInfinity) {
    //   Object.values(linesByLength)
    //     .reverse()
    //     .forEach((lines, i, list) => {
    //       const childStrokeColor = new paper.Color({
    //         hue: getAdvancedHue(i, list.length + 1),
    //         saturation: 0.6,
    //         brightness: 0.89,
    //       })
    //       const childGroup = new paper.Group(lines)
    //       childGroup.strokeColor = childStrokeColor
    //       childGroup.blendMode = 'multiply'
    //     })
    // }
  }

  // drawDots(points, graphColor, dotRadius)

  // let fontSize = 48
  // if (isInfinity) fontSize = 110
  // const dPoint: [number, number] = [canvasW / 2, canvasH * 0.87 + fontSize / 3]
  // if (n < 6) {
  //   new paper.PointText({
  //     point: dPoint,
  //     content: n > 0 ? `${n - 1}d` : '',
  //     justification: 'center',
  //     fillColor: graphColor,
  //     fontFamily: 'FuturaLight',
  //     fontSize,
  //     opacity: 0.9,
  //   })
  //   {
  //     const things = [
  //       'no thing',
  //       'point',
  //       'line',
  //       'plane',
  //       'volume',
  //       'hypervolume',
  //     ]
  //     const thingFontSize = fontSize * 0.88
  //     const thingPoint = [dPoint[0], dPoint[1] + thingFontSize * 1.5]
  //     new paper.PointText({
  //       point: thingPoint,
  //       content: things[n]?.split('').join('hair-space') ?? '',
  //       justification: 'center',
  //       fillColor: graphColor,
  //       fontFamily: 'FuturaLight',
  //       fontSize: thingFontSize,
  //       opacity: 0.9,
  //     })
  //   }
  // }

  swatch.sendToBack()

  drawBleed(canvasW, canvasH, BLEED)
}
