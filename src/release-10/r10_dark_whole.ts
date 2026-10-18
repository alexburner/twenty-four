import paper from 'paper'
import {
  drawBleed,
  drawGraphsAndShells,
  drawOutline,
  drawZeroShells,
  getOddHoleRadius,
  getPoints,
  getRadius,
} from '../draw'
import { drawTerrain } from '../drawTerrain'
import { BLEED, CANVAS_H, CANVAS_W, getSwatchColor } from './r10_common'

const fillColor = new paper.Color('hsla(0, 0%, 100%, 1)')
const graphColor = new paper.Color('#333')
const graphThickness = 6
const shellThickness = 2
const shellGap = 36
const proximity = 150
// const dotRadius = shellGap * 0.5
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
  swatch.fillColor = swatchColor

  const radius = getRadius(proximity, n)
  const points = getPoints(center, radius, n)

  drawOutline({
    points,
    strokeColor: 'transparent',
    strokeWidth: 0,
    fillColor: fillColor,
  })

  if (n === Infinity) {
    swatch.fillColor = graphColor
    const holeRadius = getOddHoleRadius(proximity, Infinity)
    const hole = new paper.Path.Circle({
      center: center,
      radius: holeRadius,
      fillColor: fillColor,
      strokeColor: graphColor,
      strokeWidth: graphThickness,
    })
    const FONT_SIZE = 50
    new paper.PointText({
      content: '?',
      point: [
        hole.position.x + holeRadius * 0.75,
        hole.position.y + FONT_SIZE / 3,
      ],
      justification: 'left',
      fillColor: fillColor,
      fontFamily: 'Helvetica',
      fontSize: FONT_SIZE,
      opacity: 0.5,
    })
    const mask = new paper.Path.Rectangle({
      point: new paper.Point(center.x - holeRadius, center.y - holeRadius),
      size: new paper.Size(holeRadius, holeRadius * 2),
    })
    const group = new paper.Group([mask, hole])
    group.clipped = true
    // const line = new paper.Path.Line({
    //   from: new paper.Point(center.x, center.y - holeRadius * 1.75),
    //   to: new paper.Point(center.x, center.y + holeRadius * 1.75 + 4),
    //   strokeColor: 'white',
    //   strokeWidth: 3,
    //   dashArray: [4, 4],
    //   // strokeCap: 'round',
    // })
    // line.position.x -= line.strokeWidth / 2
    // new paper.Path.Circle({
    //   center: center,
    //   radius: holeRadius - shellThickness * 2,
    //   strokeColor: fillColor,
    //   strokeWidth: shellThickness,
    //   dashArray: [7.5, 9.3],
    // })
    // const FONT_SIZE = 50
    // new paper.PointText({
    //   content: '?',
    //   point: [center.x, center.y + FONT_SIZE / 3],
    //   justification: 'center',
    //   fillColor: graphColor,
    //   fontFamily: 'Helvetica',
    //   fontSize: FONT_SIZE,
    // })
  } else if (n === 0) {
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
      // dotRadius: shellThickness,
      // dotRadius: shellThickness * 2,
      dotRadius: shellGap / 2 + shellThickness * 4,
      // dotRadius: graphThickness * 0.5,
      // dotRadius: dotRadius * 0.75,
      // dotRadius: shellGap / 2 + 4,
      // dotRadius: dotRadius - graphThickness,
      // dotRadius: dotRadius + 2,
      // dotRadius: 3,
      dashArray,
      shellThickness,
    })

    // if (n === 1) {
    //   drawDots([new paper.Point(center)], graphColor, graphThickness)
    // }
    // if (n === 1) {
    //   drawDots([new paper.Point(center)], graphColor, dotRadius)
    // } else {
    //   drawDots(points, graphColor, dotRadius)
    // }
  }

  swatch.sendToBack()

  drawBleed(CANVAS_W, CANVAS_H, BLEED)
}
