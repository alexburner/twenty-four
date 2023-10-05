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

const dotRadius = 10

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

  const col1x = canvasW * 0.33 + BLEED
  const col2x = canvasW * 0.67 + BLEED

  {
    const wholeGroup = new paper.Group()
    if (n === 1) {
      const dots = drawDots(points, strokeColor, dotRadius)
      wholeGroup.addChild(dots)
      wholeGroup.position.y = canvasH / 2
    } else {
      const linesByLength = drawLines({
        points,
        strokeColor,
        strokeWidth: 3,
        // dashArray: [1, 4],
      })
      const lines = Object.values(linesByLength).flat()
      const lineGroup = new paper.Group(lines)
      wholeGroup.addChild(lineGroup)
    }
    wholeGroup.position.x = col2x
  }

  const positionGroup = new paper.Group()

  points.forEach((_point, i) => {
    const shadowGroup = new paper.Group()
    if (n > 1) {
      const circle = new paper.Path.Circle({
        center,
        radius,
        strokeColor,
        // strokeWidth: strokeWidth * 0.5,
        // dashArray: [2, 3],
        strokeWidth: 3,
        strokeCap: 'round',
        dashArray: [1, 5],
        opacity: 0,
      })
      shadowGroup.addChild(circle)
    }
    if (n === 1) {
      const dots = drawDots(points, strokeColor, dotRadius)
      shadowGroup.addChild(dots)
    } else {
      const linesByLength = drawLines({
        points,
        strokeColor,
        strokeWidth: 3,
        // dashArray: [1, 4],
      })
      const lines = Object.values(linesByLength).flat()
      const lineGroup = new paper.Group(lines)
      lineGroup.opacity = 0.88
      shadowGroup.addChild(lineGroup)
    }
    shadowGroup.opacity = 0.125

    const pointGroup = new paper.Group()
    pointGroup.addChild(shadowGroup)

    {
      const subPoints = [...points]
      subPoints.reverse()
      const removed = subPoints.splice(
        (i + points.length - 1) % points.length,
        1,
      )
      if (removed.length) {
        const dots = drawDots(
          removed,
          swatchColor,
          dotRadius,
          strokeColor,
          strokeWidth,
        )
        pointGroup.addChild(dots)
      }
      // subPoints.splice((i + 0) % points.length, 1)
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
      // const spreadDistance = 1000 / (points.length - 1)
      const spreadDistance = radius * 2.42
      const nBoost = (total - n) * (radius * 0.3)
      pointGroup.position.y += i * (spreadDistance + nBoost)
    }

    positionGroup.addChild(pointGroup)
  })

  const textFontSize = 42 * 0.88

  {
    // top text
    const texts = [
      'point',
      'line',
      'plane',
      'volume',
      'hypervolume',
      'hyperhypervolume',
    ]
    const text = texts[n - 1]?.split('').join(' ')
    // const xSpace = canvasW * 0.2 + BLEED
    // const ySpace = BLEED * 2 + textFontSize * 0.33
    const ySpace = BLEED * 2 + textFontSize * 1.25
    const textPoint = new paper.Point([col2x, ySpace])
    new paper.PointText({
      point: textPoint,
      content: text,
      justification: 'center',
      fillColor: strokeColor,
      fontFamily: 'FuturaLight',
      fontSize: textFontSize,
    })
  }

  {
    // bottom text
    const texts = [
      '',
      'points',
      'lines',
      'planes',
      'volumes',
      'hypervolumes',
      'hyperhypervolumes',
    ].map((t) => `${t}`)
    const text = texts[n - 1]?.split('').join(' ')
    // const xSpace = canvasW * 0.2 + BLEED
    const ySpace = BLEED * 2 + textFontSize * 0.75
    // const ySpace = BLEED * 2 + textFontSize * 0.88
    const textPoint = new paper.Point([col1x, canvasH * 1 - ySpace])
    new paper.PointText({
      point: textPoint,
      content: text,
      justification: 'center',
      fillColor: strokeColor,
      fontFamily: 'FuturaLight',
      fontSize: textFontSize,
      opacity: 0.88,
    })
  }

  // {
  //   const texts = [
  //     null,
  //     'nothings',
  //     'points',
  //     'lines',
  //     'planes',
  //     'volumes',
  //     'hypervolumes',
  //   ].map((text) => (text ? `infinite ${text} fit within` : ''))
  //   const text = texts[n]
  //   // const xSpace = canvasW * 0.2 + BLEED
  //   const xSpace = BLEED * 2 + textFontSize / 2 - 5
  //   const textPoint = new paper.Point([canvasW - xSpace, canvasH / 2])
  //   const textPath = new paper.PointText({
  //     point: textPoint,
  //     content: text,
  //     justification: 'center',
  //     fillColor: strokeColor,
  //     fontFamily: 'Times',
  //     fontWeight: 'Italic',
  //     fontSize: textFontSize * 0.94,
  //     // opacity: 0.25,
  //     opacity: 0.42,
  //   })

  //   textPath.rotate(-90, textPoint)
  //   textPath.position.y -= textFontSize * 0.33
  // }

  positionGroup.position.y = center.y
  positionGroup.position.x = col1x
  // positionGroup.position.y -= textFontSize * 0.1

  swatch.sendToBack()

  drawBleed(canvasW, canvasH, BLEED)
}
