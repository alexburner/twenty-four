import paper from 'paper'
import { drawBleed, drawDots, drawLines, getPoints } from '../draw'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const strokeColor = '#333' as unknown as paper.Color
const strokeWidth = 4
const radius = 80
// const radiusx = 80
// const proximity = 125

const dotRadius = 7
const shadowStrokeWidth = 2
const dashArray: [number, number] = [0.5, 6]
const textFontSize = 45

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

  const col2x = canvasW * 0.33 + BLEED - radius * 0.5
  const col1x = canvasW * 0.67 + BLEED

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

    const d = `${n - 1}D`
    // if (n !== 2) d = d.split('').join('')
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
      formGroup.bounds.height / 2 + textFontSize * 2.4 + nBoost
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
        fontSize: textFontSize * 0.92,
      }),
    )
    wholeGroup.addChild(
      new paper.PointText({
        point: thingPoint,
        content: thing,
        justification: 'center',
        fillColor: strokeColor,
        fontFamily: 'FuturaLight',
        fontSize: textFontSize * 0.98,
      }),
    )
  }

  const positionGroup = new paper.Group()

  const pointGroups = points.map((_point, i) => {
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
        strokeColor,
        shadowStrokeWidth,
        [0.5, 4],
      )
      shadowGroup.addChild(dots)
    } else {
      const linesByLength = drawLines({
        points,
        strokeColor,
        strokeWidth: shadowStrokeWidth,
        dashArray,
      })
      const lines = Object.values(linesByLength).flat()
      const lineGroup = new paper.Group(lines)
      shadowGroup.addChild(lineGroup)
    }

    const pointGroup = new paper.Group()
    pointGroup.addChild(shadowGroup)

    {
      const subPoints = [...points]
      // subPoints.reverse()
      const removed = subPoints.splice((i + 1) % points.length, 1)
      if (removed.length) {
        const dots = drawDots(
          removed,
          'transparent',
          dotRadius,
          // strokeColor,
          // shadowStrokeWidth,
          // [0.5, 4],
        )
        pointGroup.addChild(dots)
      }
      if (subPoints.length === 1) {
        const dots = drawDots(subPoints, strokeColor, dotRadius)
        pointGroup.addChild(dots)
      } else {
        const linesByLength = drawLines({
          points: subPoints,
          strokeColor,
          strokeWidth,
        })
        const lines = Object.values(linesByLength).flat()
        const lineGroup = new paper.Group(lines)
        pointGroup.addChild(lineGroup)
      }
    }

    if (n > 1) {
      const spreadDistance = radius * 2.42
      const nBoost = (total - n) * (radius * 0.1)
      pointGroup.position.y += i * (spreadDistance + nBoost)
    }

    positionGroup.addChild(pointGroup)

    return pointGroup
  })

  positionGroup.position.y = center.y
  positionGroup.position.x = col1x

  if (n > 1) {
    // surface text
    const lastSurface = pointGroups[pointGroups.length - 1]
    if (lastSurface) {
      const texts = [
        '',
        'point',
        'line',
        'plane',
        'volume',
        'hypervolume',
        'hyper2volume',
      ].map((t) => `${t}s`)
      let text = texts[n - 1]?.split('').join(' ')
      text = `${n - 2}D\n${text}`
      const textPoint = new paper.Point([
        lastSurface.position.x,
        lastSurface.position.y + radius * 2,
      ])
      if (n === 2) textPoint.y -= textFontSize * 0.67
      if (n === 3) textPoint.y -= textFontSize * 1
      if (n === 5) textPoint.y -= textFontSize * 0.125
      const nBoost = (total - n) * (radius * 0.23)
      textPoint.y += nBoost
      positionGroup.addChild(
        new paper.PointText({
          point: textPoint,
          content: text,
          justification: 'center',
          fillColor: strokeColor,
          fontFamily: 'FuturaLight',
          fontSize: textFontSize * 0.88,
          // opacity: 0.88,
        }),
      )
    }
  }

  // positionGroup.addChild(wholeGroup)
  // positionGroup.position.y -= textFontSize

  swatch.sendToBack()

  drawBleed(canvasW, canvasH, BLEED)
}
