import paper from 'paper'
import { drawBleed, drawDots, drawLines, getPoints } from '../draw'

const BLEED = 36

const CANVAS_W = 300 * 11 + BLEED * 2
const CANVAS_H = 300 * 9 + BLEED * 2

const TOTAL = 15

const RADIUS = 60
const DOT_RADIUS = 6
const STROKE_WIDTH = 2
const STROKE_COLOR = new paper.Color('#333')
const TEXT_COLOR = new paper.Color('black')
const BG_COLOR = new paper.Color('white')

export const r10DTable = (canvas: HTMLCanvasElement): void => {
  // Beginning
  canvas.style.width = `${CANVAS_W}px`
  canvas.style.height = `${CANVAS_H}px`
  paper.setup(canvas)
  const container = new paper.Path.Rectangle({
    point: [0, 0],
    size: [CANVAS_W, CANVAS_H],
  })
  const swatch = container.clone()
  swatch.fillColor = BG_COLOR

  // Middle
  const tableGroup = new paper.Group()
  for (let n = 0; n <= TOTAL; n++) {
    const rowOrigin = new paper.Point(RADIUS * 2, n * RADIUS * 2.67)
    const rowGroup = drawTableRow(rowOrigin, n, RADIUS * 2.67)
    tableGroup.addChild(rowGroup)
  }

  // tableGroup.position.x = CANVAS_W / 2
  // tableGroup.position.x += RADIUS * 0.5
  tableGroup.position.y = CANVAS_H / 2

  // End
  swatch.sendToBack()
  drawBleed(CANVAS_W, CANVAS_H, BLEED)
}

const drawTableRow = (
  origin: paper.Point,
  n: number,
  padding: number,
): paper.Group => {
  const rowGroup = new paper.Group()
  const points = getPoints(origin, RADIUS, n, true)

  // Label
  {
    const d = `${n - 1}D`
    const dText = new paper.PointText({
      point: origin,
      content: d,
      justification: 'center',
      fillColor: TEXT_COLOR,
      fontFamily: 'FuturaLight',
      fontSize: 30,
    })
    dText.position.y = origin.y
    rowGroup.addChild(dText)
  }

  // Whole
  {
    const wholeGroup = new paper.Group()

    wholeGroup.addChild(drawCircle(origin))

    const dots = drawDots(points, STROKE_COLOR, DOT_RADIUS)
    wholeGroup.addChild(dots)

    const linesByLength = drawLines({
      points: points,
      strokeColor: STROKE_COLOR,
      strokeWidth: STROKE_WIDTH,
    })
    const lines = Object.values(linesByLength).flat()
    const linesGroup = new paper.Group(lines)
    wholeGroup.addChild(linesGroup)

    wholeGroup.position.x += RADIUS * 2.25
    rowGroup.addChild(wholeGroup)
  }

  // Spread
  {
    const spreadGroup = new paper.Group()
    for (let i = 0; i < points.length; i++) {
      const subGroup = new paper.Group()
      const subPoints = [...points]
      const removeIndex = i - 2
      // const removeIndex = Math.floor(points.length / 2) - 0 + i
      subPoints.reverse()
      subPoints.splice(removeIndex % points.length, 1)

      subGroup.addChild(drawCircle(origin))

      const dots = drawDots(subPoints, STROKE_COLOR, DOT_RADIUS)
      subGroup.addChild(dots)
      const linesByLength = drawLines({
        points: subPoints,
        strokeColor: STROKE_COLOR,
        strokeWidth: STROKE_WIDTH,
      })

      const lines = Object.values(linesByLength).flat()
      const lineGroup = new paper.Group(lines)
      subGroup.addChild(lineGroup)
      subGroup.position.x += (i + 1) * padding
      spreadGroup.addChild(subGroup)
    }
    spreadGroup.position.x += RADIUS * 2.75
    rowGroup.addChild(spreadGroup)
  }

  return rowGroup
}

const drawCircle = (center: paper.Point): paper.Path.Circle =>
  new paper.Path.Circle({
    center: center,
    radius: RADIUS,
    strokeColor: STROKE_COLOR,
    strokeWidth: STROKE_WIDTH,
    opacity: 0.25,
  })
