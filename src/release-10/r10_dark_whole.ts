import paper from 'paper'
import {
  drawBleed,
  drawDots,
  drawGraphsAndShells,
  drawOutline,
  drawZeroShells,
  getPoints,
  getRadius,
} from '../draw'
import { drawTerrain } from '../drawTerrain'
import { BLEED, CANVAS_H, CANVAS_W, getSwatchColor } from './r10_common'

const graphColor = '#333'
const graphThickness = 6
const shellThickness = 2
const shellGap = 36
const proximity = 150
const dotRadius = shellGap * 0.5
// const dashArray: [number, number] = [0, 2.6]
const dashArray = undefined

export const r10DarkWhole = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
  waves: boolean,
): void => {
  waves = true

  canvas.style.width = `${CANVAS_W}px`
  canvas.style.height = `${CANVAS_H}px`
  paper.setup(canvas)

  const shellColor = new paper.Color('white')

  const swatchColor = getSwatchColor(n, total)

  const x = CANVAS_W / 2
  const y = CANVAS_H / 2
  const center = new paper.Point(x, y)

  const container = new paper.Path.Rectangle({
    point: [0, 0],
    size: [CANVAS_W, CANVAS_H],
  })

  const swatch = container.clone()
  swatch.fillColor = swatchColor as paper.Color

  const radius = getRadius(proximity, n)
  const points = getPoints(center, radius, n)

  drawOutline({
    points,
    strokeColor: 'transparent',
    strokeWidth: 0,
    fillColor: 'hsla(0, 0%, 100%, 1)',
  })

  if (n === 0) {
    if (waves) {
      drawTerrain({
        width: CANVAS_W,
        height: CANVAS_H,
        seedCoords: [
          // bottom center
          [0.5 * CANVAS_W, CANVAS_H * 1.1],
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
    } else {
      drawZeroShells({
        center: new paper.Point(center.x, center.y),
        size: CANVAS_H * 1.5,
        radius,
        shelln: 31,
        shellColor,
        shellGap,
        dashArray,
        shellThickness,
      })
    }
  } else if (n > 0) {
    // const linesByLength = drawGraphsAndShells({
    drawGraphsAndShells({
      container,
      center,
      proximity,
      radius,
      size: CANVAS_H * 1.5,
      n,
      graphColor,
      shellColor,
      points,
      shelln: 31,
      shellGap,
      graphThickness: graphThickness,
      twoTouch: true,
      dotRadius: dotRadius * 0.75,
      // dotRadius: shellGap / 2 + 4,
      // dotRadius: dotRadius - graphThickness,
      // dotRadius: dotRadius + 2,
      // dotRadius: 3,
      dashArray,
      shellThickness,
    })

    if (n === 1) {
      drawDots([new paper.Point(center)], graphColor, dotRadius)
    } else {
      drawDots(points, graphColor, dotRadius)
    }
  }

  swatch.sendToBack()

  drawBleed(CANVAS_W, CANVAS_H, BLEED)
}
