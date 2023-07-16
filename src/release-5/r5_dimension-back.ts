import paper from 'paper'
import { drawBleed, drawDots, drawLines, getPoints, getRadius } from '../draw'
import { oneDotRadius } from './r5_common'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const strokeColor = '#333' as unknown as paper.Color
const strokeWidth = 4
// const radius = 80
const proximity = 125

export const r5DimensionBack = (
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
  const radius = n > 1 ? getRadius(proximity, n) : 0
  const points = getPoints(center, radius, n, true)

  const positionGroup = new paper.Group()

  points.forEach((_point, i) => {
    const shadowGroup = new paper.Group()
    const circle = new paper.Path.Circle({
      center,
      radius,
      strokeColor,
      strokeWidth: strokeWidth * 0.5,
      opacity: 0,
    })
    shadowGroup.addChild(circle)
    if (n === 1) {
      const dots = drawDots(points, strokeColor, oneDotRadius)
      shadowGroup.addChild(dots)
    } else {
      const linesByLength = drawLines({
        points,
        strokeColor,
        strokeWidth: 3,
        dashArray: [1, strokeWidth],
      })
      const lines = Object.values(linesByLength).flat()
      const lineGroup = new paper.Group(lines)
      shadowGroup.addChild(lineGroup)
    }
    shadowGroup.opacity = 0.25

    const pointGroup = new paper.Group()
    pointGroup.addChild(shadowGroup)

    // TODO draw lines for all except i
    {
      const subPoints = [...points]
      subPoints.splice((i + 1) % points.length, 1)
      if (subPoints.length === 1) {
        const dots = drawDots(subPoints, strokeColor, oneDotRadius)
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
      const spreadDistance = radius * 2.3
      const nBoost = (total - n) * 50
      pointGroup.position.y += i * (spreadDistance + nBoost)
    }

    positionGroup.addChild(pointGroup)
  })

  // dimensions
  const leftTexts = ['', 'nothing', 'point', 'line', 'plane', 'volume', 'bulk']
  const rightTexts = ['nothing', 'point', 'line', 'plane', 'volume', 'bulk', '']
  const leftText = leftTexts[n]?.split('').join(' ')
  const rightText = rightTexts[n]?.split('').join(' ')
  const textFontSize = 44
  const xSpace = canvasW * 0.2 + BLEED
  const ySpace = BLEED * 2 + textFontSize / 2 - 5
  const leftPoint = new paper.Point([xSpace, canvasH - ySpace])
  const rightPoint = new paper.Point([canvasW - xSpace, canvasH - ySpace])
  const opacity = 1
  new paper.PointText({
    point: leftPoint,
    content: leftText,
    justification: 'center',
    fillColor: strokeColor,
    fontFamily: 'FuturaLight',
    fontSize: textFontSize,
    opacity,
  })
  new paper.PointText({
    point: rightPoint,
    content: rightText,
    justification: 'center',
    fillColor: strokeColor,
    fontFamily: 'FuturaLight',
    fontSize: textFontSize,
    opacity,
  })

  positionGroup.position.y = center.y
  positionGroup.position.y -= textFontSize * 0.5

  swatch.sendToBack()

  drawBleed(canvasW, canvasH, BLEED)
}
