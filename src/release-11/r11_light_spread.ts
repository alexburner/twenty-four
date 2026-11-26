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
  FINE_STROKE_DASH,
  FINE_STROKE_WIDTH,
  getSwatchColor,
  SWATCH_HEIGHT,
  VIS_HEIGHT,
  VIS_WIDTH,
} from './r11_common'

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

// let COL_LEFT_X = BLEED + VIS_WIDTH * 0.3
// let COL_RIGHT_X = CANVAS_W - COL_LEFT_X
// const X_SHIFT = -20
// COL_LEFT_X += X_SHIFT
// COL_RIGHT_X += X_SHIFT

const STROKE_COLOR = new paper.Color('#333')
const FILL_COLOR = new paper.Color('white')
const STROKE_WIDTH = FINE_STROKE_WIDTH * (8 / 3)
const RADIUS = 75
const DOT_RADIUS = FINE_STROKE_WIDTH * (15 / 3)
const FONT_SIZE = 44

const ROUGHNESS = 100

const EVEN_GRAVITY = false

// const STATIC_LIMIT = 6

// const yPadding = RADIUS * 1.25
// const yDistance = yPadding + RADIUS
const DOT_DISTANCE_MIN = RADIUS * 2.5 + DOT_RADIUS
// const LINES_HEIGHT_MAX = 800
// const TOTAL_HEIGHT_MAX = LINES_HEIGHT_MAX + DOT_DISTANCE_MIN
const TOTAL_HEIGHT_MAX = VIS_HEIGHT - RADIUS * 5.5
const LINES_HEIGHT_MAX = TOTAL_HEIGHT_MAX - DOT_DISTANCE_MIN

const DOT_FUDGE = DOT_RADIUS * 0.5

const CENTER_X = CANVAS_W / 2
// const COL_GAP = RADIUS * 4
// const COL_GAP = VIS_WIDTH / 3 + RADIUS * 0.5
// const COL_LEFT_X = CENTER_X - COL_GAP / 2
// const COL_RIGHT_X = CENTER_X + COL_GAP / 2
const COL_LEFT_X = CENTER_X - VIS_WIDTH / 4
const COL_RIGHT_X = CENTER_X + VIS_WIDTH / 4

const COL_PARENT_X = COL_LEFT_X
const COL_CHILD_X = COL_RIGHT_X

export const r11LightSpread = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
  _waves: boolean,
): void => {
  canvas.style.width = `${CANVAS_W}px`
  canvas.style.height = `${CANVAS_H}px`
  // canvas.style.transform = 'rotate(180deg) scale(-1, 1)'
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

  // const centerLine =
  new paper.Path.Line({
    from: new paper.Point([CANVAS_W / 2, BLEED]),
    to: new paper.Point([CANVAS_W / 2, CANVAS_H - BLEED]),
    strokeColor: STROKE_COLOR,
    strokeWidth: FINE_STROKE_WIDTH,
    strokeCap: 'round',
    dashArray: FINE_STROKE_DASH,
  })

  if (n === Infinity) {
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
    const cFactorDots = drawCircle(new paper.Point([COL_CHILD_X, origin.y]))
    const cFactorFace = drawCircle(
      new paper.Point([
        COL_CHILD_X,
        origin.y + DOT_DISTANCE_MIN + LINES_HEIGHT_MAX,
      ]),
      {
        strokeColor: STROKE_COLOR,
        strokeWidth: STROKE_WIDTH,
        fillColor: FILL_COLOR,
      },
    )
    // const cFactorFactors = drawCircle(
    //   new paper.Point([
    //     COL_CHILD_X,
    //     // cFactorDots.position.y +
    //     //   (cFactorFace.position.y - cFactorDots.position.y) / 2,
    //     // cFactorDots.position.y +
    //     //   DOT_DISTANCE_MIN +
    //     //   LINES_HEIGHT_MAX / 2 +
    //     //   // RADIUS * -0.5,
    //     //   RADIUS * -0,
    //     // origin.y + TOTAL_HEIGHT_MAX - RADIUS * 0.75,
    //     origin.y + TOTAL_HEIGHT_MAX / 2,
    //   ]),
    //   {
    //     fillColor: FILL_COLOR,
    //     opacity: cFactorDots.opacity,
    //   },
    // )
    // const cFactorFactors2 = cFactorFactors.clone()
    // cFactorFactors2.position.y -= RADIUS * 0.67
    // // const cFactorFactors3 = cFactorFactors2.clone()
    // // cFactorFactors3.position.y -= RADIUS * 0.67
    const questionCircle = drawCircle(
      new paper.Point([COL_CHILD_X, origin.y + TOTAL_HEIGHT_MAX / 2]),
    )
    questionCircle.opacity = 0
    const questionMark = new paper.PointText({
      content: '?',
      // point: [cFactorFactors.position.x, cFactorFactors.position.y],
      point: questionCircle.position,
      justification: 'center',
      fillColor: STROKE_COLOR,
      fontFamily: 'NotoSansJP-Regular',
      fontSize: FONT_SIZE * 1.125,
      // opacity: 0.75,
    })
    // infinityText.fontSize = FONT_SIZE * 1.25
    // infinityText.position.y += FONT_SIZE * 0.125
    // questionMark.position.y -= FONT_SIZE * 1.25
    questionMark.position.y += FONT_SIZE / 3
    // // questionMark.rotate(180)
    // // questionMark.scale(-1, 1)
    const cFactorFactorsGroup = new paper.Group([
      // cFactorFactors3,
      // cFactorFactors2,
      // cFactorFactors,
      questionCircle,
      questionMark,
    ])
    positionGroup.addChildren([
      cFactorFactorsGroup,
      rectTail,
      cLineFace,
      cLineTail,
      cDots,
      cFactorFace,
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
    // zero-point group
    positionGroup.addChild(drawCircle(origin))

    // factor group
    const factorGroup = drawDots(
      [new paper.Point([COL_CHILD_X, origin.y - RADIUS])],
      STROKE_COLOR,
      DOT_RADIUS,
    )
    positionGroup.addChild(factorGroup)
    positionGroup.addChild(drawCircle(new paper.Point([COL_CHILD_X, origin.y])))
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

    const postCount = Object.keys(linesByLength).length + 1 // + 1 for dots
    const fenceCount = postCount - 1

    // let distanceA = RADIUS * 4
    // if (n >= 2 && n <= 3) distanceA += RADIUS * 1.25
    // if (n >= 4 && n <= 5) distanceA += RADIUS * 0.75
    // if (n >= 6 && n <= 7) distanceA += RADIUS * -0.25
    const distanceA = (1 / (postCount + 1)) * VIS_HEIGHT
    const totalHeightA = fenceCount * distanceA

    let linesDistance: number
    let dotDistance: number
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

    console.log('linesDistance', linesDistance, 'dotDistance', dotDistance)

    const spread = spreadLines({
      linesByLength,
      distance: linesDistance,
      radius: RADIUS,
      center: new paper.Point(origin.x, origin.y),
      reverse: true,
    })

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
  // swatch.sendToBack()
  swatch.bringToFront()

  const bg = container.clone()
  bg.fillColor = bgColor
  bg.sendToBack()

  setTimeout(() => {
    // positionGroup.bounds.bottom = CANVAS_H - BLEED - yPadding
    // positionGroup.bounds.top = SWATCH_HEIGHT + BLEED + RADIUS

    // positionGroup.bounds.top =
    // SWATCH_HEIGHT + BLEED + VIS_WIDTH / 4 - RADIUS * 1.67
    // if (n <= 7) {
    positionGroup.position.y = VIS_HEIGHT / 2 + SWATCH_HEIGHT - DOT_RADIUS * 2.5
    // positionGroup.position.y -= 4
    // }

    // positionGroup.position.y =
    //   (CANVAS_H - SWATCH_HEIGHT - BLEED) / 2 + SWATCH_HEIGHT
    // if (n >= 10) positionGroup.bounds.bottom = CANVAS_H - BLEED - 80
    // positionGroup.position.y -= 10 // nudge
    positionGroup.scale(
      0.98,
      // new paper.Point([CANVAS_W / 2, SWATCH_HEIGHT + BLEED]),
    )
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
  circle.rotate(90)
  circle.rotate(0.55)
  return circle
}

const drawText = (args: {
  y: number
  shape: number | string
  factor: number | string
}): paper.Group => {
  const TEXT_Y = args.y + (FONT_SIZE * 1) / 3

  const textShape = new paper.PointText({
    content: args.shape,
    point: [COL_CHILD_X + RADIUS + RADIUS * 0.25 * 0.96, TEXT_Y],
    justification: 'left',
    fillColor: STROKE_COLOR,
    fontFamily: 'Futura',
    fontSize: FONT_SIZE,
  })

  const textFactor = new paper.PointText({
    content: args.factor,
    point: [COL_CHILD_X - RADIUS - RADIUS * 0.25 * 0.96, TEXT_Y],
    justification: 'right',
    fillColor: STROKE_COLOR,
    fontFamily: 'Futura',
    fontSize: FONT_SIZE,
  })

  const infinityText =
    args.shape === Infinity
      ? textShape
      : args.factor === Infinity
      ? textFactor
      : null
  if (infinityText) {
    infinityText.content = '∞'
    infinityText.fontFamily = 'NotoSansJP-SemiBold'
    infinityText.fontSize = FONT_SIZE * 1.25
    infinityText.position.y += FONT_SIZE * 0.125
    // infinityText.position.x +=
    // FONT_SIZE * 0.0125 * (args.factor === Infinity ? 1 : -1)
  }

  const textGroup = new paper.Group()
  // textShape.rotate(180)
  // textFactor.rotate(180)
  // textShape.scale(-1, 1)
  // textFactor.scale(-1, 1)
  textGroup.addChild(textShape)
  textGroup.addChild(textFactor)
  // textGroup.opacity = 0.75
  return textGroup
}
