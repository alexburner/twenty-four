import paper from 'paper'
import {
  drawBleed,
  drawDots,
  drawInnerOutline,
  drawLines,
  drawOutline,
  getApprox,
  getPoints,
  getProximity,
  spreadLines,
} from '../draw'
import {
  BLEED,
  CANVAS_H,
  CANVAS_W,
  getSwatchColor,
  SWATCH_HEIGHT,
  VIS_HEIGHT,
  VIS_WIDTH,
} from './r10_common'

// const CENTER_X = canvasW / 2
// const COL_GAP = canvasW / 3 + 20
// const COL_GAP = canvasW * 0.37
// const COL_SHIFT = COL_GAP / 2
// const COL_1_X = CENTER_X - COL_SHIFT
// const COL_2_X = CENTER_X + COL_SHIFT
// const X_SHIFT = 20
// const X_SHIFT = canvasW * 0.03

// const X_SHIFT = 0
// const COL_1_X = canvasW / 3 - 5
// const COL_2_X = canvasW * (2 / 3) + 20

// const COL_PADDING = VIS_WIDTH * 0.25
// const COL_PARENT_X = BLEED + COL_PADDING
// const COL_CHILD_X = CANVAS_W - BLEED - COL_PADDING
// const COL_CHILD_X = BLEED + COL_PADDING
// const COL_PARENT_X = CANVAS_W - BLEED - COL_PADDING

const COL_LEFT_X = BLEED + VIS_WIDTH * 0.28
const COL_RIGHT_X = CANVAS_W - BLEED - VIS_WIDTH * 0.3
const COL_PARENT_X = COL_LEFT_X
const COL_CHILD_X = COL_RIGHT_X

const STROKE_COLOR = new paper.Color('#333')
const FILL_COLOR = new paper.Color('white')
const STROKE_WIDTH = 6
const RADIUS = 75
const DOT_RADIUS = 12
const FONT_SIZE = 42

const ROUGHNESS = 100

const EVEN_GRAVITY = false

const STATIC_LIMIT = 10

export const r10LightSpread = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
  _waves: boolean,
): void => {
  canvas.style.width = `${CANVAS_W}px`
  canvas.style.height = `${CANVAS_H}px`
  paper.setup(canvas)

  const shapesByLength: Record<number, number> = {}
  const largestShape = total
  for (let shape = 2; shape <= largestShape; shape++) {
    const length = getApprox(getProximity(RADIUS, shape), ROUGHNESS)
    shapesByLength[length] = shape
  }

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

  const origin = new paper.Point(COL_PARENT_X, CANVAS_H / 2)
  const points = getPoints(origin, RADIUS, n, true, EVEN_GRAVITY)

  const positionGroup = new paper.Group()

  // const outlineY = origin.y
  // const textX = outlineX - outlineRadius * 1.8
  // const textY = outlineY + fontSize * 0.4

  if (n === 0) {
    /**
     * -> 0
     */
    positionGroup.addChild(drawCircle(origin))
    positionGroup.addChild(drawCircle(new paper.Point([COL_CHILD_X, origin.y])))
    positionGroup.addChild(
      drawDots(
        [new paper.Point([COL_CHILD_X, origin.y - RADIUS])],
        STROKE_COLOR,
        DOT_RADIUS,
      ),
    )
    positionGroup.addChild(
      drawText({
        y: origin.y,
        shape: 1,
        factor: 0,
      }),
    )
  } else if (n === 1) {
    /**
     * -> 1
     */

    // zero-point group
    const childDotGroup = drawDots(points, STROKE_COLOR, DOT_RADIUS)
    positionGroup.addChild(childDotGroup)
    positionGroup.addChild(drawCircle(origin))

    // factor group
    const factorGroup = drawDots(
      [new paper.Point([COL_CHILD_X, childDotGroup.position.y])],
      STROKE_COLOR,
      DOT_RADIUS,
    )
    positionGroup.addChild(factorGroup)
    positionGroup.addChild(drawCircle(new paper.Point([COL_CHILD_X, origin.y])))

    positionGroup.addChild(
      drawText({
        y: origin.y,
        shape: 1,
        factor: 1,
      }),
    )
  } else if (n > 1) {
    /**
     * -> n
     */

    const linesByLength = drawLines({
      points,
      strokeColor: STROKE_COLOR,
      strokeWidth: STROKE_WIDTH,
    })

    let distance: number
    let dotDistance: number
    if (n < STATIC_LIMIT) {
      const groupCount = Object.keys(linesByLength).length + 1
      const reduction = n < 4 ? BLEED * 4 : n < 6 ? BLEED * 3 : BLEED * 0
      const height = VIS_HEIGHT - reduction
      distance = height / (groupCount + 1)
      dotDistance = distance - RADIUS
    } else {
      const groupCount = Object.keys(linesByLength).length + 1
      const goalLength = 818
      const postCount = groupCount - 1
      const fenceCount = postCount - 1
      const fenceLength = goalLength / fenceCount
      distance = fenceLength
      dotDistance = Math.max(distance - RADIUS, RADIUS * 1.4)
      if (dotDistance === distance - RADIUS) {
        // dots equidistant: recalculate for "true" height
        const realGoalLength = goalLength + RADIUS + RADIUS * 1.4
        const realFenceLength = realGoalLength / postCount
        distance = realFenceLength
        dotDistance = distance - RADIUS
      }
    }

    const spread = spreadLines({
      linesByLength,
      distance,
      radius: RADIUS,
      center: new paper.Point(origin.x, origin.y),
      reverse: true,
    })

    // spread.position.y += n > 11 ? radius * 2.67 : spreadDistance

    positionGroup.addChild(spread)

    spread.children.forEach((childGroup, i) => {
      if (n < 100) {
        const skip = i + 1
        const fill = drawInnerOutline({
          points,
          strokeColor: 'transparent',
          strokeWidth: 0,
          fillColor: FILL_COLOR,
          skip,
        })
        const thing = spread.children.length - i - 1
        fill.position.y += distance * thing
        const circle = drawCircle(childGroup.position)
        setTimeout(() => {
          positionGroup.addChild(fill)
          positionGroup.addChild(childGroup)
          positionGroup.addChild(circle)
          childGroup.sendToBack()
          fill.sendToBack()
          circle.sendToBack()
        }, 1 + thing * 2)
      }

      const child = childGroup.children[0] as paper.Path
      const length = getApprox(child.length, ROUGHNESS)
      const shape = shapesByLength[length]
      if (!shape) return
      let factor = (childGroup.children.length - 1) / shape
      if (shape === 2) factor *= 2 // ?
      if (shape === 2 && n % 2) return // ???
      if (factor === n) return // ????
      if (n % shape != 0) {
        // accuracy gets shaky as n grows
        // -> floating point fuzz?
        if (n === 360) {
          console.log('—— skipping child ——')
          console.log('factor', factor)
          console.log('n', n)
          console.log('shape', shape)
          console.log('remainder', n % shape)
        }
        return
      }
      if (!factor) return

      const outlineOrigin = new paper.Point([
        COL_CHILD_X,
        childGroup.position.y,
      ])
      const outline = drawOutline({
        points: getPoints(outlineOrigin, RADIUS, shape, false, EVEN_GRAVITY),
        strokeColor: STROKE_COLOR,
        strokeWidth: STROKE_WIDTH,
        fillColor: FILL_COLOR,
      })
      positionGroup.addChild(outline)
      positionGroup.addChild(drawCircle(outlineOrigin))
      positionGroup.addChild(
        drawText({
          y: outlineOrigin.y,
          shape: shape,
          factor: factor,
        }),
      )
    })

    {
      // zero-point group
      const childDotGroup = drawDots(points, STROKE_COLOR, DOT_RADIUS)
      childDotGroup.addChild(drawCircle(origin))

      // zero-point factor group
      const factorGroup = drawDots(
        [new paper.Point([COL_CHILD_X, origin.y])],
        STROKE_COLOR,
        DOT_RADIUS,
      )
      factorGroup.addChild(
        drawCircle(
          new paper.Point([
            factorGroup.position.x,
            factorGroup.position.y + RADIUS,
          ]),
        ),
      )
      factorGroup.position.y -= RADIUS

      const text = drawText({
        y: origin.y,
        shape: 1,
        factor: n,
      })

      // Final nudge
      const pointGroup = new paper.Group()
      pointGroup.addChild(childDotGroup)
      pointGroup.addChild(factorGroup)
      pointGroup.addChild(text)
      pointGroup.position.y = spread.bounds.topCenter.y
      pointGroup.position.y -= dotDistance
      // pointGroup.position.y -=
      //   n < STATIC_LIMIT ? distance - RADIUS : RADIUS * 1.4
      positionGroup.addChild(pointGroup)
    }
  }

  const swatch = container.clone()
  swatch.fillColor = swatchColor
  // swatch.position.y += canvasH - SWATCH_HEIGHT - BLEED
  swatch.position.y -= swatch.bounds.height
  swatch.position.y += SWATCH_HEIGHT + BLEED
  swatch.sendToBack()

  const bg = container.clone()
  bg.fillColor = bgColor
  bg.sendToBack()

  setTimeout(() => {
    positionGroup.position.y =
      (CANVAS_H - SWATCH_HEIGHT - BLEED) / 2 + SWATCH_HEIGHT
    // positionGroup.position.y -= 10 // nudge
    positionGroup.scale(0.98)
  }, 1000)

  drawBleed(CANVAS_W, CANVAS_H, BLEED)
}

const drawCircle = (center: paper.Point): paper.Path.Circle =>
  new paper.Path.Circle({
    center: center,
    radius: RADIUS,
    strokeColor: STROKE_COLOR,
    strokeWidth: 2,
    opacity: 0.25,
  })

const drawText = (args: {
  y: number
  shape: number
  factor: number
}): paper.Group => {
  const TEXT_Y = args.y + (FONT_SIZE * 1) / 3

  const textShape = new paper.PointText({
    content: `${args.shape}`,
    point: [COL_RIGHT_X + RADIUS * 1.33, TEXT_Y],
    justification: 'left',
    fillColor: STROKE_COLOR,
    fontFamily: 'FuturaLight',
    fontSize: FONT_SIZE,
  })

  const textFactor = new paper.PointText({
    content: `${args.factor}`,
    // point: [(COL_RIGHT_X - COL_LEFT_X) / 2 + COL_LEFT_X, TEXT_Y],
    point: [COL_RIGHT_X - RADIUS * 1.25, TEXT_Y],
    justification: 'right',
    fillColor: STROKE_COLOR,
    fontFamily: 'FuturaLight',
    fontSize: FONT_SIZE,
  })

  const textGroup = new paper.Group()
  textGroup.addChild(textShape)
  textGroup.addChild(textFactor)
  return textGroup

  // const NUDGE = FONT_SIZE / 3
  // const textEquation = new paper.PointText({
  //   content: `${args.shape} × ${args.factor}`,
  //   // center
  //   point: [CANVAS_W / 2 - FONT_SIZE / 2.67, args.y + NUDGE],
  //   justification: 'center',
  //   // left
  //   // point: [COL_CHILD_X + RADIUS * 1.5, args.y + NUDGE],
  //   // justification: 'left',
  //   // right
  //   // point: [COL_PARENT_X - RADIUS * 2.09, args.y + NUDGE],
  //   // justification: 'right',
  //   fillColor: STROKE_COLOR,
  //   fontFamily: 'FuturaLight',
  //   fontSize: FONT_SIZE,
  // })
  // if (String(args.shape)[0] === '1') textEquation.position.x -= 2
  // const textEqual = new paper.PointText({
  //   content: ' =',
  //   point: [
  //     textEquation.bounds.rightCenter.x,
  //     textEquation.position.y + NUDGE - 2,
  //   ],
  //   justification: 'left',
  //   fillColor: STROKE_COLOR,
  //   fontFamily: 'FuturaLight',
  //   fontSize: FONT_SIZE,
  // })
  // const textGroup = new paper.Group()
  // textGroup.addChild(textEquation)
  // textGroup.addChild(textEqual)
  // return textGroup

  // return new paper.Group([
  //   new paper.PointText({
  //     content: args.shape,
  //     point: [COL_CHILD_X + RADIUS * 1.5, args.y + NUDGE],
  //     justification: 'left',
  //     fillColor: STROKE_COLOR,
  //     fontFamily: 'FuturaLight',
  //     fontSize: FONT_SIZE,
  //   }),
  //   new paper.PointText({
  //     content: '×',
  //     point: [CANVAS_W / 2, args.y + NUDGE],
  //     justification: 'center',
  //     fillColor: STROKE_COLOR,
  //     fontFamily: 'FuturaLight',
  //     fontSize: FONT_SIZE,
  //   }),
  //   new paper.PointText({
  //     content: args.factor,
  //     point: [COL_PARENT_X - RADIUS * 1.5, args.y + NUDGE],
  //     justification: 'right',
  //     fillColor: STROKE_COLOR,
  //     fontFamily: 'FuturaLight',
  //     fontSize: FONT_SIZE,
  //   }),
  // ])
}
