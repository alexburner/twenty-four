import paper from 'paper'
import { drawBleed, drawDots, drawLines, getPoints } from '../draw'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const strokeColor = new paper.Color('#333')
const secondaryStroke = strokeColor.clone()
secondaryStroke.alpha = 0.75
const strokeWidth = 4
const radius = 80
// const radiusx = 80
// const proximity = 125

const dotRadius = 9
const shadowStrokeWidth = 2
const lineDashArray: [number, number] = [0.25, 3]
const dotDashArray: [number, number] = [0.365, 3]
const textFontSize = 48 * 0.9

/**
 * angels on a pin
 */
export const r7DimensionBack = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
  _waves: boolean,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const swatchColor = {
    hue: 0,
    saturation: 0,
    brightness: 1,
  }

  const container = new paper.Path.Rectangle({
    point: [0, 0],
    size: [canvasW, canvasH],
  })

  const swatch = container.clone()
  swatch.fillColor = swatchColor as paper.Color

  const center = new paper.Point(canvasW / 2, canvasH / 2)
  // const radius = n > 1 ? getRadius(proximity, n) : 0
  // const nBoost2 = n * 2
  // const radius = radiusx + nBoost2
  const points = getPoints(center, radius, n, true)

  const xnudge = canvasW * 0.012
  const col2x = canvasW * 0.33 + BLEED + xnudge - radius * 0.5
  const col1x = canvasW * 0.67 + BLEED + xnudge

  const wholeGroup = new paper.Group()
  {
    const wholeRadius = radius + radius * 0.1 * (n - 2)
    const wholePoints = getPoints(center, wholeRadius, n, true)
    let formGroup: paper.Group | undefined
    if (n === 1) {
      const dots = drawDots(wholePoints, strokeColor, dotRadius)
      formGroup = dots
      formGroup.position.y = center.y
      wholeGroup.addChild(formGroup)
    } else {
      const linesByLength = drawLines({
        points: wholePoints,
        strokeColor,
        strokeWidth: strokeWidth,
      })
      const lines = Object.values(linesByLength).flat()
      formGroup = new paper.Group(lines)
      formGroup.position.y = center.y
      wholeGroup.addChild(formGroup)
    }
    formGroup.position.x = col2x

    // new paper.Path.Circle({
    //   center: [col2x, center.y],
    //   radius: wholeRadius,
    //   strokeColor,
    //   strokeWidth,
    // })

    // const rect = new paper.Path.Rectangle(formGroup.bounds)
    // rect.strokeColor = strokeColor
    // rect.strokeWidth = strokeWidth

    let d = `${n - 1}D`
    if (n !== 2) d = d.split('').join(' ')
    const things = [
      'point',
      'line',
      'plane',
      'volume',
      'hypervolume',
      'hyper2volume',
    ]
    const thing = things[n - 1]?.split('').join(' ')

    const nBoost = (total - n) * (radius * 0.04)
    const textDistance =
      formGroup.bounds.height / 2 + textFontSize * 2.0 + nBoost
    const dPoint = new paper.Point([
      col2x,
      canvasH / 2 - textDistance * 0.94 + textFontSize / 3,
    ])
    if (n === 3) dPoint.y += formGroup.bounds.height * 0.05
    const thingPoint = new paper.Point([
      col2x,
      canvasH / 2 + textDistance + textFontSize / 3,
    ])

    wholeGroup.addChild(
      new paper.PointText({
        point: dPoint,
        content: d,
        justification: 'center',
        fillColor: strokeColor,
        fontFamily: 'FuturaLight',
        fontSize: textFontSize,
      }),
    )
    wholeGroup.addChild(
      new paper.PointText({
        point: thingPoint,
        content: thing,
        justification: 'center',
        fillColor: strokeColor,
        fontFamily: 'FuturaLight',
        fontSize: textFontSize * 1.1,
      }),
    )

    const things2 = [
      undefined,
      undefined,
      'triangle',
      'tetrahedron',
      'pentachoron',
      'hexateron',
    ]
    let thing2 = things2[n - 1]
    thing2 = thing2 ? thing2.split('').join(' ') : undefined
    if (thing2) {
      const thing2Point = thingPoint.clone()
      thing2Point.y += textFontSize * 1.5
      wholeGroup.addChild(
        new paper.PointText({
          point: thing2Point,
          content: thing2,
          justification: 'center',
          fillColor: strokeColor,
          fontFamily: 'FuturaLight',
          fontSize: textFontSize * 1,
          opacity: 0.5,
        }),
      )
    }
  }

  const col1Group = new paper.Group()
  points.map((_point, i) => {
    const surfaceGroup = new paper.Group()
    const shadowGroup = new paper.Group()
    // if (n > 1) {
    //   const circle = new paper.Path.Circle({
    //     center,
    //     radius,
    //   })
    //   shadowGroup.addChild(circle)
    // }
    if (n === 1) {
      const dots = drawDots(
        points,
        swatchColor,
        dotRadius,
        secondaryStroke,
        shadowStrokeWidth,
        dotDashArray,
      )
      shadowGroup.addChild(dots)
    } else {
      const linesByLength = drawLines({
        points,
        strokeColor: secondaryStroke,
        strokeWidth: shadowStrokeWidth,
        dashArray: lineDashArray,
      })
      const lines = Object.values(linesByLength).flat()
      const lineGroup = new paper.Group(lines)
      shadowGroup.addChild(lineGroup)
    }

    surfaceGroup.addChild(shadowGroup)

    {
      const subPoints = [...points]
      // subPoints.reverse()
      const removed = subPoints.splice((i + 1) % points.length, 1)
      if (removed[0]) {
        const circle = new paper.Path.Circle({
          center: removed[0],
          radius: dotRadius + strokeWidth / 2,
          fillColor: swatchColor,
        })
        surfaceGroup.addChild(circle)
        const dots = drawDots(
          removed,
          swatchColor,
          dotRadius,
          secondaryStroke,
          shadowStrokeWidth,
          dotDashArray,
        )
        surfaceGroup.addChild(dots)
      }
      if (subPoints.length === 1) {
        const dots = drawDots(subPoints, strokeColor, dotRadius)
        surfaceGroup.addChild(dots)
      } else {
        const linesByLength = drawLines({
          points: subPoints,
          strokeColor,
          strokeWidth,
        })
        const lines = Object.values(linesByLength).flat()
        const lineGroup = new paper.Group(lines)
        surfaceGroup.addChild(lineGroup)
      }
    }

    if (n > 1) {
      const spreadDistance = radius * 2.42
      let nBoost = 0 //(total - n) * (radius * 0.1)
      if (n === 2) nBoost = radius * 0.33
      surfaceGroup.position.y += i * (spreadDistance + nBoost)
    }

    col1Group.addChild(surfaceGroup)
  })

  col1Group.position.y = center.y
  col1Group.position.x = col1x

  if (n > 0) {
    let d = n > 1 ? `${n - 2}D` : ''
    if (n !== 3) d = d.split('').join(' ')
    const things = [
      '',
      'points',
      'lines',
      'planes',
      'volumes',
      'hypervolumes',
      'hyper2volumes',
    ]
    const thing = things[n - 1]?.split('').join(' ')

    // const rect = new paper.Path.Rectangle(col1Group.bounds)
    // rect.strokeColor = strokeColor
    // rect.strokeWidth = strokeWidth

    const textDistance = col1Group.bounds.height / 2 + textFontSize * 1.5
    const dPoint = new paper.Point([
      col1x,
      canvasH / 2 - textDistance * 1 + textFontSize / 3,
    ])
    const thingPoint = new paper.Point([
      col1x,
      canvasH / 2 + textDistance + textFontSize / 3,
    ])

    col1Group.addChild(
      new paper.PointText({
        point: dPoint,
        content: d,
        justification: 'center',
        fillColor: strokeColor,
        fontFamily: 'FuturaLight',
        fontSize: textFontSize * 0.88,
      }),
    )
    col1Group.addChild(
      new paper.PointText({
        point: thingPoint,
        content: thing,
        justification: 'center',
        fillColor: strokeColor,
        fontFamily: 'FuturaLight',
        fontSize: textFontSize * 1.1 * 0.88,
      }),
    )
  }

  // positionGroup.addChild(wholeGroup)
  // positionGroup.position.y -= textFontSize

  swatch.sendToBack()

  drawBleed(canvasW, canvasH, BLEED)
}
