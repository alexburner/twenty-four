import paper from 'paper'
import { drawBleed, drawDots, drawLines, getPoints } from '../draw'
import { numberToWords, polygonName } from '../util'
import {
  BLEED,
  CANVAS_H,
  CANVAS_W,
  getSwatchColor,
  SWATCH_HEIGHT,
  VIS_HEIGHT,
} from './r10_common'

const STROKE_COLOR = new paper.Color('#333')
const STROKE_WIDTH = 2
const RADIUS = 140
const DOT_RADIUS = 16

const EVEN_GRAVITY = false

export const r10LightText = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
  _waves: boolean,
): void => {
  canvas.style.width = `${CANVAS_W}px`
  canvas.style.height = `${CANVAS_H}px`
  paper.setup(canvas)

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
    const numeralSize = 200
    const wordSize = 64
    const numeral = new paper.PointText({
      point: [CANVAS_W / 2, 0],
      content: n === Infinity ? '∞' : n,
      justification: 'center',
      fillColor: STROKE_COLOR,
      fontFamily: n === Infinity ? 'LINESeedJP-Regular' : 'Futura',
      fontSize: n === Infinity ? numeralSize * 1.6 : numeralSize,
    })
    if (n === Infinity) numeral.position.y += 50
    const word = new paper.PointText({
      // point: [CANVAS_W / 2, numeral.bounds.bottomCenter.y + wordSize * 0.75],
      point: [CANVAS_W / 2, numeralSize / 3.33 + wordSize * 0.75],
      content: numberToWords(n),
      justification: 'center',
      // fillColor: STROKE_COLOR,
      fillColor: '#333333DD',
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
    const origin = new paper.Point(CANVAS_W / 2, VIS_HEIGHT * 0.29)
    // const origin = new paper.Point(CANVAS_W / 2, -VIS_HEIGHT * 0.41)
    const points = getPoints(origin, RADIUS, n, true, EVEN_GRAVITY)
    const circle = drawCircle(
      origin,
      n === Infinity
        ? {
            radius: RADIUS + DOT_RADIUS,
            fillColor: STROKE_COLOR,
            opacity: 1,
          }
        : {},
    )
    const dots = drawDots(points, STROKE_COLOR, DOT_RADIUS)
    const linesByLength = drawLines({
      points: points,
      strokeColor: STROKE_COLOR,
      strokeWidth: STROKE_WIDTH,
    })
    const lines = Object.values(linesByLength).flat()
    const linesGroup = new paper.Group(lines)
    const nameSize = 64
    const name = new paper.PointText({
      point: [
        CANVAS_W / 2,
        circle.position.y + RADIUS + nameSize * 1.5 + DOT_RADIUS * 1.33,
      ],
      content: polygonName(n),
      justification: 'center',
      // fillColor: STROKE_COLOR,
      fillColor: '#333333DD',
      fontFamily: 'FuturaLight',
      fontSize: nameSize,
    })
    shapeGroup.addChild(circle)
    shapeGroup.addChild(linesGroup)
    shapeGroup.addChild(dots)
    shapeGroup.addChild(name)
    positionGroup.addChild(shapeGroup)
  }

  const swatch = container.clone()
  swatch.fillColor = swatchColor
  swatch.position.y += CANVAS_H - SWATCH_HEIGHT - BLEED
  swatch.sendToBack()

  const bg = container.clone()
  bg.fillColor = bgColor
  bg.sendToBack()

  // positionGroup.position.y = (CANVAS_H - SWATCH_HEIGHT - BLEED) / 2
  positionGroup.bounds.bottom = (CANVAS_H - SWATCH_HEIGHT - BLEED) * 0.833
  // positionGroup.position.y += 20
  positionGroup.position.y += 30
  // positionGroup.position.y += 40

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
    strokeColor?: paper.Color
    fillColor?: paper.Color
    opacity?: number
  },
): paper.Path.Circle =>
  new paper.Path.Circle({
    center: center,
    radius: args.radius ?? RADIUS,
    strokeColor: args.strokeColor ?? STROKE_COLOR,
    strokeWidth: 2,
    fillColor: args.fillColor,
    opacity: args.opacity ?? 0.25,
  })
