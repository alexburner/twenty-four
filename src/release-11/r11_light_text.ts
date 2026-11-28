import paper from 'paper'
import { drawBleed, drawDots, drawLines, getPoints } from '../draw'
import { getPolygonName, getSimplexName, numberToWords } from '../util'
import {
  BLEED,
  CANVAS_H,
  CANVAS_W,
  FINE_STROKE_DASH,
  FINE_STROKE_WIDTH,
  getSwatchColor,
  SWATCH_HEIGHT,
  VIS_HEIGHT,
} from './r11_common'

const SCALE = 1.0

const STROKE_COLOR = new paper.Color('#333')
const STROKE_WIDTH = FINE_STROKE_WIDTH
const RADIUS = 180 * SCALE
const DOT_RADIUS = 24 * SCALE

const NAME_SIZE = 64

const EVEN_GRAVITY = true

export const r11LightText = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
  _waves: boolean,
): void => {
  canvas.style.width = `${CANVAS_W}px`
  canvas.style.height = `${CANVAS_H}px`
  paper.setup(canvas)

  /*
  0 - - void - - -1d
  1 - - point - - 0d
  2 - - line - - 1d
  3 - - triangle - - 2d
  4 - square - tetrahedron - 3d
  5 - pentagon - pentachoron - 4d
  ...etc
  */
  const polygonName = getPolygonName(n)
  const simplexName = new paper.PointText({
    content: getSimplexName(n - 1),
    justification: 'center',
    fillColor: STROKE_COLOR,
    fontFamily: 'FuturaLight',
    fontSize: NAME_SIZE,
  })
  console.log('1 - - point - - 1d')

  const bgColor = new paper.Color({
    hue: 0,
    saturation: 0,
    brightness: 1,
  })

  const swatchColor = getSwatchColor(n, total)

  const container = new paper.Path.Rectangle({
    point: [0, 0],
    size: [CANVAS_W, CANVAS_H],
  })

  const positionGroup = new paper.Group()

  // Number
  {
    const numberGroup = new paper.Group()
    const numeralSize = 250 * SCALE
    const wordSize = 64
    const numeral = new paper.PointText({
      point: [CANVAS_W / 2, 0],
      content: n === Infinity ? '∞' : n,
      justification: 'center',
      fillColor: STROKE_COLOR,
      // fontFamily: n === Infinity ? 'NotoSansJP-Regular' : 'Futura',
      // fontSize: n === Infinity ? numeralSize * 1.6 : numeralSize,
      fontFamily: n === Infinity ? 'NotoSansJP-SemiBold' : 'Futura',
      fontSize: n === Infinity ? numeralSize * 1.25 : numeralSize,
      // fontFamily: 'NotoSansJP-SemiBold',
      // fontSize: numeralSize * 1.25,
    })
    if (n === Infinity) numeral.position.y += 33 //25 // 50
    if (n === Infinity) {
      setTimeout(() => (numeral.position.y += 24))
    }
    const word = new paper.PointText({
      // point: [CANVAS_W / 2, numeral.bounds.bottomCenter.y + wordSize * 0.75],
      // point: [CANVAS_W / 2, numeralSize / 3.33 + wordSize * 0.75],
      point: [CANVAS_W / 2, wordSize * 1.75],
      content: numberToWords(n),
      justification: 'center',
      fillColor: STROKE_COLOR,
      fontFamily: 'FuturaLight',
      fontSize: wordSize,
    })
    numberGroup.addChild(numeral)
    numberGroup.addChild(word)
    positionGroup.addChild(numberGroup)
  }

  // Shape
  {
    const shapeGroup = new paper.Group()
    // const origin = new paper.Point(CANVAS_W / 2, VIS_HEIGHT * 0.3)
    // const origin = new paper.Point(CANVAS_W / 2, VIS_HEIGHT * 0.29)
    const origin = new paper.Point(CANVAS_W / 2, VIS_HEIGHT * 0.31)
    // const origin = new paper.Point(CANVAS_W / 2, -VIS_HEIGHT * 0.41)
    const points = getPoints(origin, RADIUS, n, true, EVEN_GRAVITY)
    const circle = drawCircle(
      origin,
      n < 359
        ? {}
        : {
            radius: RADIUS + DOT_RADIUS,
            fillColor: STROKE_COLOR,
          },
    )
    shapeGroup.addChild(circle)
    if (n < 359) {
      const dots = drawDots(points, STROKE_COLOR, DOT_RADIUS)
      shapeGroup.addChild(dots)

      const linesByLength = drawLines({
        points: points,
        strokeColor: STROKE_COLOR,
        strokeWidth: STROKE_WIDTH,
      })
      const lines = Object.values(linesByLength).flat()
      const linesGroup = new paper.Group(lines)
      shapeGroup.addChild(linesGroup)
    }
    const name = new paper.PointText({
      point: [
        CANVAS_W / 2,
        // circle.position.y + RADIUS + nameSize * 1.75 + DOT_RADIUS * 0.75,
        circle.position.y + RADIUS * 1.2 + DOT_RADIUS * 1.2 + NAME_SIZE,
        // circle.position.y + RADIUS * 1.2 + DOT_RADIUS * 0.75 + nameSize,
        // circle.position.y + RADIUS * 1.28 + nameSize,
      ],
      content: polygonName,
      justification: 'center',
      fillColor: STROKE_COLOR,
      fontFamily: 'FuturaLight',
      fontSize: NAME_SIZE,
    })
    shapeGroup.addChild(name)
    if (n > 3) {
      if (simplexName.fillColor) simplexName.fillColor.alpha = 0.5
      simplexName.bounds.topCenter = name.bounds.topCenter
      // simplexName.bounds.top += nameSize * 1.5
      simplexName.bounds.top += NAME_SIZE * 1.25
      shapeGroup.addChild(simplexName)

      // const nameTextGap = simplexName.bounds.top - name.bounds.bottom
      // const simplexLineTop = simplexName.bounds.top - nameTextGap / 2
      // const longestTextWidth = Math.max(
      //   name.bounds.width,
      //   simplexName.bounds.width,
      // )
      // const simplexLineWidth = longestTextWidth + nameSize * 2.33
      // const simplexLine = new paper.Path.Line({
      //   from: new paper.Point([0, simplexLineTop]),
      //   to: new paper.Point([simplexLineWidth, simplexLineTop]),
      //   strokeColor: STROKE_COLOR,
      //   strokeWidth: FINE_STROKE_WIDTH,
      //   strokeCap: 'round',
      //   dashArray: FINE_STROKE_DASH,
      // })
      // simplexLine.position.x = CANVAS_W / 2
      // simplexLine.position.y += FINE_STROKE_WIDTH * 0.5
      // shapeGroup.addChild(simplexLine)
    }
    positionGroup.addChild(shapeGroup)
  }

  const swatch = container.clone()
  swatch.fillColor = swatchColor
  swatch.position.y += CANVAS_H - SWATCH_HEIGHT - BLEED
  swatch.sendToBack()

  const bg = container.clone()
  bg.fillColor = bgColor
  bg.sendToBack()

  positionGroup.bounds.top = BLEED + SWATCH_HEIGHT * 1.4
  if (n === Infinity) {
    // HACKS: hand measured height diff (from NotoSansJP vs Futura)
    const n360Height = 1073.15
    const nInfinityHeight = 1096.4
    const yNudge = nInfinityHeight - n360Height
    positionGroup.bounds.top -= yNudge
  }

  drawBleed(CANVAS_W, CANVAS_H, BLEED)

  // update letter spacing for all text
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Unreachable?')
  ctx.letterSpacing = '3px'
  paper.view.update()
}

const drawCircle = (
  center: paper.Point,
  args: {
    radius?: number
    strokeWidth?: number
    strokeColor?: paper.Color
    fillColor?: paper.Color
  } = {},
): paper.Path.Circle => {
  const defaultStrokeColor = new paper.Color(STROKE_COLOR)
  const strokeWidth = args.strokeWidth ?? FINE_STROKE_WIDTH
  const circle = new paper.Path.Circle({
    center: center,
    radius: args.radius ?? RADIUS,
    fillColor: args.fillColor,
    strokeColor: args.strokeColor ?? defaultStrokeColor,
    strokeWidth: strokeWidth,
    strokeCap: 'round',
    dashArray:
      args.strokeWidth || args.fillColor ? undefined : FINE_STROKE_DASH,
  })
  circle.rotate(-90)
  return circle
}
