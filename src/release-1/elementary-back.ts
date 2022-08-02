import paper from 'paper'
import {
  drawBleed,
  drawDots,
  drawLines,
  drawOutline,
  getPoints,
  spreadLines,
} from '../draw'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const strokeColor = '#333' as unknown as paper.Color
const strokeWidth = 4
const radius = 80

export const elementaryBack = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const hue = ((360 * ((n - 1) / (total + 1))) % 360) - 0

  const swatchColor = {
    hue,
    saturation: 1 / 3,
    brightness: 1,
  }

  const container = new paper.Path.Rectangle({
    point: [0, 0],
    size: [canvasW, canvasH],
  })

  const swatch = container.clone()
  swatch.fillColor = swatchColor as paper.Color

  const center = new paper.Point(canvasW / 2, canvasH / 2)
  const points = getPoints(center, radius, n)

  if (n === 1) {
    drawDots(points, strokeColor, strokeWidth * 2)
  }

  const linesByLength = drawLines({
    points,
    strokeColor,
    strokeWidth,
  })

  const lengthCount = Object.keys(linesByLength).length

  const spread = spreadLines({
    linesByLength,
    distance: radius * 2 + (radius * 3) / lengthCount,
  })

  spread.position = center

  spread.children.forEach((child, i) => {
    let subN: number | undefined

    // Any even last is 2 x (n/2)
    if (n > 2 && n % 2 === 0 && i === lengthCount - 1) {
      subN = 2
    }

    // Specials
    if (n === 6 && i === 1) subN = 3
    if (n === 8 && i === 1) subN = 4
    if (n === 9 && i === 2) subN = 3
    if (n === 10 && i === 1) subN = 5
    if (n === 12 && i === 1) subN = 6
    if (n === 12 && i === 2) subN = 4
    if (n === 12 && i === 3) subN = 3

    if (i === 0) {
      const fontSize = 42
      new paper.PointText({
        point: [
          child.position.x + canvasW / 2 - BLEED - 60,
          child.position.y + fontSize / 3,
        ],
        content: n,
        justification: 'center',
        fillColor: strokeColor,
        fontFamily: 'Futura-Light',
        fontSize,
        opacity: 0.7,
      })
    }

    if (subN) {
      const outline = drawOutline({
        points: getPoints(
          new paper.Point([
            child.position.x + canvasW / 2 - BLEED - 60,
            child.position.y,
          ]),
          24,
          subN,
        ),
        strokeColor,
        strokeWidth: 2,
      })
      if (outline) outline.opacity = 0.7
    }
  })

  if (n < 2) {
    const fontSize = 42
    new paper.PointText({
      point: [center.x + canvasW / 2 - BLEED - 60, center.y + fontSize / 3],
      content: n,
      justification: 'center',
      fillColor: strokeColor,
      fontFamily: 'Futura-Light',
      fontSize,
      opacity: 0.7,
    })
  }

  swatch.sendToBack()

  drawBleed(canvasW, canvasH, BLEED)
}
