import paper from 'paper'
import {
  drawBleed,
  drawDots,
  drawGraphsAndShells,
  getOddHoleRadius,
  getPoints,
  getRadius,
} from '../draw'
import { drawTerrain } from '../drawTerrain'
import { BLEED, CANVAS_H, CANVAS_W, getSwatchColor } from './r11_common'

const fillColor = new paper.Color('hsla(0, 0%, 100%, 1)')
const graphColor = fillColor // new paper.Color('#333')
const graphThickness = 10
const shellThickness = 2
const shellGap = 18 // graphThickness * 1.25 //18
const proximity = 190
// const dotRadius = shellGap * 0.5
// const dashArray: [number, number] = [0, 2.6]
const dashArray = undefined

export const r11DarkWhole = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
  _waves: boolean,
): void => {
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
  swatch.fillColor = swatchColor

  const radius = getRadius(proximity, n)
  const points = getPoints(center, radius, n, false, false, -90)

  // drawOutline({
  //   points,
  //   strokeColor: 'transparent',
  //   strokeWidth: 0,
  //   // fillColor: fillColor,
  // })

  if (n >= 359) {
    swatch.fillColor = graphColor
    if (n % 2 || n == Infinity) {
      const holeRadius = getOddHoleRadius(proximity, Infinity)
      const hole = new paper.Path.Circle({
        center: center,
        radius: holeRadius,
        fillColor: swatchColor,
        strokeColor: graphColor,
        strokeWidth: graphThickness,
      })
      if (n === Infinity) {
        const FONT_SIZE = 50
        new paper.PointText({
          content: '?',
          point: [
            hole.position.x + holeRadius * 1.25,
            hole.position.y + FONT_SIZE / 3,
          ],
          justification: 'left',
          fillColor: swatchColor,
          fontFamily: 'NotoSansJP-Regular',
          fontSize: FONT_SIZE,
          opacity: 0.5,
        })
      }
    }
  } else if (n === 0) {
    // waves
    drawTerrain({
      width: CANVAS_W,
      height: CANVAS_H,
      seedCoords: [
        // bottom center
        // [0.5 * CANVAS_W, CANVAS_H * 1.1],
        // center center
        // [0.5 * CANVAS_W, CANVAS_H * 0.5],
        // right center
        // [CANVAS_W + shellGap * 5, CANVAS_H * 0.5],
        // left center
        [-shellGap * 8, CANVAS_H * 0.5],
        // right center
        // [CANVAS_W + shellGap * 8, CANVAS_H * 0.5],
        // [CANVAS_W + shellGap * 5, CANVAS_H * 0.75],
        // [CANVAS_W / 2, -shellGap * 5],
      ],
      seedRadiusScale: shellGap * 2,
      seedRadiusMin: shellGap / 2,
      noiseRadius: 0.6,
      noiseCount: 60,
      ringCount: 110,
      strokeWidth: shellThickness,
      strokeColor: shellColor,
      shellGap,
      // omit: 4,
      // opacityScale: 10,
    })
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
      shelln: 70 - n * 2,
      shellGap,
      graphThickness,
      twoTouch: true,
      // dotRadius: shellThickness,
      // dotRadius: shellThickness * 2,
      // dotRadius: shellGap / 2 + shellThickness * 3,
      dotRadius: graphThickness / 2 + shellThickness + 1,
      // dotRadius: graphThickness / 2
      // dotRadius: dotRadius * 0.75,
      // dotRadius: shellGap / 2 + 4,
      // dotRadius: dotRadius - graphThickness,
      // dotRadius: dotRadius + 2,
      // dotRadius: 3,
      dashArray,
      shellThickness,
      evenGravity: n === 2 ? true : false,
      firstShellNudge: graphThickness / 2 - shellThickness, // / 2,
    })

    if (n === 1) {
      drawDots([new paper.Point(center)], graphColor, graphThickness)
    }
    // if (n === 1) {
    //   drawDots([new paper.Point(center)], graphColor, dotRadius)
    // } else {
    //   drawDots(points, graphColor, dotRadius)
    // }
  }

  swatch.sendToBack()

  drawBleed(CANVAS_W, CANVAS_H, BLEED)
}
