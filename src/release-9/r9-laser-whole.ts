import paper from 'paper'
import {
  drawBleed,
  drawDots,
  drawGraphsAndShells,
  drawOutline,
  getPoints,
  getRadius,
} from '../draw'
import { drawTerrain } from '../drawTerrain'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const graphColor = '#333'
const graphThickness = 4
const shellThickness = 2
const shellGap = 39
const proximity = 150
const dotRadius = shellGap * 0.55
// const dotRadius = 18
// const dashArray: [number, number] = [0, 2.6]

export const r9LaserWhole = (
  canvas: HTMLCanvasElement,
  n: number,
  _total: number,
  _waves: boolean,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const shellColor = new paper.Color('white')

  const swatchColor = {
    hue: 0,
    saturation: 0,
    brightness: 0.85,
  }

  const x = canvasW / 2
  const y = canvasH / 2
  const center = new paper.Point(x, y)

  const container = new paper.Path.Rectangle({
    point: [0, 0],
    size: [canvasW, canvasH],
  })

  const swatch = container.clone()
  swatch.fillColor = swatchColor as paper.Color

  const radius = getRadius(proximity, n) * 1.2
  const points = getPoints(center, radius, n, false, true)

  if (n > 2) {
    drawOutline({
      points,
      strokeColor: 'transparent',
      strokeWidth: 0,
      fillColor: 'white',
    })
  }

  if (n === 0) {
    drawTerrain({
      width: canvasW,
      height: canvasH,
      seedCoords: [
        // bottom center
        [0.5 * canvasW, canvasH * 1.1],
        // [0.5 * canvasW, canvasH * 0.5],
      ],
      seedRadiusScale: shellGap * 2,
      seedRadiusMin: shellGap / 2,
      noiseRadius: 0.6,
      noiseCount: 60,
      ringCount: 100,
      strokeWidth: shellThickness,
      strokeColor: shellColor,
      shellGap,
      // omit: 1,
      // opacityScale: 10,
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
      dotRadius: dotRadius - graphThickness,
      // dotRadius: shellGap / 2 + 4,
      // dotRadius: dotRadius - graphThickness,
      // dotRadius: dotRadius + 2,
      // dotRadius: 3,
      // dashArray,
      shellThickness: shellThickness,
      evenGravity: true,
    })
  }

  // if (n > 1) {
  //   const circle = new paper.Path.Circle({
  //     center: center,
  //     radius: radius,
  //     strokeColor: '#777',
  //     strokeWidth: graphThickness * 0.8,
  //     dashArray: [0.125, 6],
  //     strokeCap: 'round',
  //   })
  //   circle.rotate(90, center)
  //   if (n % 2 === 0) circle.rotate(365 / n / 2, center)
  // }

  if (n > 0) {
    drawDots(points, graphColor, dotRadius)
  }

  swatch.sendToBack()

  drawBleed(canvasW, canvasH, BLEED)
}
