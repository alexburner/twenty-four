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

// const COL_LEFT_X = BLEED + VIS_WIDTH * 0.28
// const COL_RIGHT_X = CANVAS_W - BLEED - VIS_WIDTH * 0.3
let COL_LEFT_X = BLEED + VIS_WIDTH * 0.3
let COL_RIGHT_X = CANVAS_W - COL_LEFT_X
const X_SHIFT = -20
COL_LEFT_X += X_SHIFT
COL_RIGHT_X += X_SHIFT
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

// const STATIC_LIMIT = 6

// const yPadding = RADIUS * 1.25
// const yDistance = yPadding + RADIUS
const DOT_DISTANCE_MIN = RADIUS * 2.5 + DOT_RADIUS
// const LINES_HEIGHT_MAX = 800
// const TOTAL_HEIGHT_MAX = LINES_HEIGHT_MAX + DOT_DISTANCE_MIN
const TOTAL_HEIGHT_MAX = VIS_HEIGHT - RADIUS * 4
const LINES_HEIGHT_MAX = TOTAL_HEIGHT_MAX - DOT_DISTANCE_MIN

const DOT_FUDGE = DOT_RADIUS * 0.5

export const r10LightSpread = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
  _waves: boolean,
): void => {
  canvas.style.width = `${CANVAS_W}px`
  canvas.style.height = `${CANVAS_H}px`
  canvas.style.transform = 'rotate(180deg) scale(-1, 1)'
  paper.setup(canvas)

  const shapesByLength: Record<number, number> = {}
  if (n !== Infinity) {
    const largestShape = total
    for (let shape = 2; shape <= largestShape; shape++) {
      const length = getApprox(getProximity(RADIUS, shape), ROUGHNESS)
      shapesByLength[length] = shape
    }
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

  let spreadChildrenLength = 0

  // const outlineY = origin.y
  // const textX = outlineX - outlineRadius * 1.8
  // const textY = outlineY + fontSize * 0.4

  if (n === Infinity) {
    console.log('hello')
    const cDots = drawCircle(new paper.Point([origin.x, origin.y]), {
      strokeColor: STROKE_COLOR,
      strokeWidth: DOT_RADIUS * 2,
    })
    const cLineTail = drawCircle(
      new paper.Point([origin.x, origin.y + DOT_DISTANCE_MIN]),
      {
        fillColor: STROKE_COLOR,
        strokeColor: STROKE_COLOR,
        strokeWidth: STROKE_WIDTH,
      },
    )
    const cLineFace = drawCircle(
      new paper.Point([
        origin.x,
        origin.y + DOT_DISTANCE_MIN + LINES_HEIGHT_MAX,
      ]),
      {
        fillColor: FILL_COLOR,
        strokeColor: STROKE_COLOR,
        strokeWidth: STROKE_WIDTH,
      },
    )
    const rectTail = new paper.Path.Rectangle({
      point: [cLineTail.position.x - RADIUS, cLineTail.position.y],
      size: [RADIUS * 2, LINES_HEIGHT_MAX],
      fillColor: STROKE_COLOR,
      strokeColor: STROKE_COLOR,
      strokeWidth: STROKE_WIDTH,
    })
    const cFactorDots = drawCircle(new paper.Point([COL_RIGHT_X, origin.y]))
    const cFactorFace = drawCircle(
      new paper.Point([
        COL_RIGHT_X,
        origin.y + DOT_DISTANCE_MIN + LINES_HEIGHT_MAX,
      ]),
      {
        strokeColor: STROKE_COLOR,
        strokeWidth: STROKE_WIDTH,
      },
    )
    const cFactorFactors = drawCircle(
      new paper.Point([
        COL_RIGHT_X,
        // cFactorDots.position.y +
        //   (cFactorFace.position.y - cFactorDots.position.y) / 2,
        cFactorDots.position.y +
          DOT_DISTANCE_MIN +
          LINES_HEIGHT_MAX / 2 +
          // RADIUS * -0.5,
          RADIUS * -0,
      ]),
      {
        fillColor: FILL_COLOR,
        opacity: cFactorDots.opacity,
      },
    )
    const cFactorFactors2 = cFactorFactors.clone()
    cFactorFactors2.position.y -= RADIUS * 0.67
    const cFactorFactors3 = cFactorFactors2.clone()
    cFactorFactors3.position.y -= RADIUS * 0.67
    positionGroup.addChildren([
      rectTail,
      cLineFace,
      cLineTail,
      cDots,
      cFactorFace,
      cFactorFactors3,
      cFactorFactors2,
      cFactorFactors,
      cFactorDots,
    ])
    positionGroup.addChild(
      drawText({
        y: cFactorFace.position.y,
        shape: Infinity,
        factor: 1,
      }),
    )
    // positionGroup.addChild(
    //   drawText({
    //     y: cFactorFactors.position.y,
    //     shape: 'm',
    //     factor: 'n',
    //   }),
    // )
    const questionMark = new paper.PointText({
      content: '?',
      point: [cFactorFactors.position.x, cFactorFactors.position.y],
      justification: 'center',
      fillColor: STROKE_COLOR,
      fontFamily: 'Helvetica',
      fontSize: FONT_SIZE * 1.25,
      opacity: 0.75,
    })
    questionMark.position.y += FONT_SIZE / 3
    questionMark.rotate(180)
    questionMark.scale(-1, 1)
    positionGroup.addChild(questionMark)
    positionGroup.addChild(
      drawText({
        y: cFactorDots.position.y,
        shape: 1,
        factor: Infinity,
      }),
    )
    positionGroup.addChild(
      drawDots(
        [
          new paper.Point([
            cFactorDots.position.x,
            cFactorDots.position.y - RADIUS,
          ]),
        ],
        STROKE_COLOR,
        DOT_RADIUS,
      ),
    )
  } else if (n === 0) {
    /**
     * -> 0
     */
    positionGroup.addChild(drawCircle(origin))
    positionGroup.addChild(drawCircle(new paper.Point([COL_CHILD_X, origin.y])))
    positionGroup.addChild(
      drawText({
        y: origin.y,
        shape: 0,
        factor: 1,
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

    const postCount = Object.keys(linesByLength).length + 1 // + 1 for dots
    const fenceCount = postCount - 1

    let linesDistance: number
    let dotDistance: number

    // const distanceA = COL_RIGHT_X - COL_LEFT_X + DOT_RADIUS
    let distanceA = RADIUS * 4
    if (n >= 2 && n <= 3) distanceA += RADIUS * 1.25
    if (n >= 4 && n <= 5) distanceA += RADIUS * 1
    const totalHeightA = fenceCount * distanceA
    if (totalHeightA < TOTAL_HEIGHT_MAX) {
      // A: ideal distance
      console.log('n', n, '--- A', distanceA)
      linesDistance = distanceA
      dotDistance = distanceA + DOT_FUDGE
    } else {
      const distanceB = TOTAL_HEIGHT_MAX / fenceCount
      if (distanceB > DOT_DISTANCE_MIN) {
        // B: squished distance shared w/ dot
        console.log('n', n, '--- B', distanceB)
        linesDistance = distanceB
        dotDistance = distanceB + DOT_FUDGE
      } else {
        // C: squished lines distance, separate dot
        console.log('n', n, '--- C')
        linesDistance = LINES_HEIGHT_MAX / (fenceCount - 1)
        dotDistance = DOT_DISTANCE_MIN
      }
    }

    if (n >= 8 && n <= 9) {
      const yNudge = RADIUS * -0.5
      linesDistance += yNudge
      dotDistance += yNudge
    }

    console.log('linesDistance', linesDistance, 'dotDistance', dotDistance)

    const spread = spreadLines({
      linesByLength,
      distance: linesDistance,
      radius: RADIUS,
      center: new paper.Point(origin.x, origin.y),
      reverse: true,
    })

    // spread.position.y += n > 11 ? radius * 2.67 : spreadDistance

    positionGroup.addChild(spread)

    spreadChildrenLength = spread.children.length
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
        fill.position.y += linesDistance * thing
        const circle = drawCircle(childGroup.position)
        setTimeout(() => {
          positionGroup.addChild(fill)
          positionGroup.addChild(childGroup)
          positionGroup.addChild(circle)
          childGroup.sendToBack()
          fill.sendToBack()
          circle.sendToBack()
        }, (i + 1) * 1)
        // }, 1 + thing * 2)
        // }, (spread.children.length - i) * 100)
      } else {
        if (i === 0) {
          const fill = drawOutline({
            points,
            strokeColor: STROKE_COLOR,
            strokeWidth: STROKE_WIDTH,
            fillColor: FILL_COLOR,
          })
          setTimeout(() => {
            positionGroup.addChild(fill)
            positionGroup.addChild(childGroup)
            childGroup.bringToFront()
            fill.bringToFront()
            setTimeout(() => {
              fill.position = childGroup.position
            })
          }, spreadChildrenLength * 2)
        }
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
      const outlineCircle = drawCircle(outlineOrigin)
      const outlineText = drawText({
        y: outlineOrigin.y,
        shape: shape,
        factor: factor,
      })

      setTimeout(() => {
        positionGroup.addChild(outline)
        positionGroup.addChild(outlineCircle)
        positionGroup.addChild(outlineText)
        outline.sendToBack()
        outlineCircle.sendToBack()
        outlineText.sendToBack()
      }, (i + 1) * 1)
    })

    {
      // factor 1 - dot
      const childDotGroup = drawDots(points, STROKE_COLOR, DOT_RADIUS)
      childDotGroup.addChild(drawCircle(origin))
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
      // pointGroup.position.y = spread.bounds.topCenter.y
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
    // positionGroup.bounds.bottom = CANVAS_H - BLEED - yPadding
    // positionGroup.bounds.top = SWATCH_HEIGHT + BLEED + RADIUS
    positionGroup.position.y =
      (CANVAS_H - SWATCH_HEIGHT - BLEED) / 2 + SWATCH_HEIGHT
    if (n >= 10) positionGroup.bounds.bottom = CANVAS_H - BLEED - 80
    // positionGroup.position.y -= 10 // nudge
    positionGroup.scale(0.98)
  }, spreadChildrenLength * 2)

  drawBleed(CANVAS_W, CANVAS_H, BLEED)
}

const drawCircle = (
  center: paper.Point,
  args: {
    radius?: number
    strokeWidth?: number
    strokeColor?: paper.Color
    fillColor?: paper.Color
    opacity?: number
  } = {},
): paper.Path.Circle => {
  const defaultStrokeColor = new paper.Color(STROKE_COLOR)
  defaultStrokeColor.alpha = 0.25
  return new paper.Path.Circle({
    center: center,
    radius: args.radius ?? RADIUS,
    strokeWidth: args.strokeWidth ?? 2,
    strokeColor: args.strokeColor ?? defaultStrokeColor,
    fillColor: args.fillColor,
    opacity: args.opacity ?? 1,
  })
}

const drawText = (args: {
  y: number
  shape: number | string
  factor: number | string
}): paper.Group => {
  const TEXT_Y = args.y + (FONT_SIZE * 1) / 3

  const textShape = new paper.PointText({
    content: args.shape,
    point: [COL_RIGHT_X + RADIUS * 1.33, TEXT_Y],
    justification: 'left',
    fillColor: STROKE_COLOR,
    fontFamily: 'FuturaLight',
    fontSize: FONT_SIZE,
  })

  const textFactor = new paper.PointText({
    content: args.factor,
    point: [COL_RIGHT_X - RADIUS * 1.25, TEXT_Y],
    justification: 'right',
    fillColor: STROKE_COLOR,
    fontFamily: 'FuturaLight',
    fontSize: FONT_SIZE,
  })

  if (args.shape === Infinity) {
    textShape.content = '∞'
    textShape.fontFamily = 'LINESeedJP-Thin'
    textShape.fontSize = FONT_SIZE * 1.6
    textShape.position.y += FONT_SIZE * 0.15
    textShape.position.x -= FONT_SIZE * 0.15
  }

  if (args.factor === Infinity) {
    textFactor.content = '∞'
    textFactor.fontFamily = 'LINESeedJP-Thin'
    textFactor.fontSize = FONT_SIZE * 1.6
    textFactor.position.y += FONT_SIZE * 0.15
    textFactor.position.x += FONT_SIZE * 0.15
  }

  const textGroup = new paper.Group()
  textShape.rotate(180)
  textFactor.rotate(180)
  textShape.scale(-1, 1)
  textFactor.scale(-1, 1)
  textGroup.addChild(textShape)
  textGroup.addChild(textFactor)
  textGroup.opacity = 0.75
  return textGroup
}
