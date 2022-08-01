import paper from 'paper'
import { drawBleed, drawDots, drawLines, getPoints, spreadLines } from '../draw'

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
    let content: string | undefined
    // First is n
    if (i === 0) {
      content = String(n)
    }

    // Any even last is 2x(n/2)
    if (n > 2 && n % 2 === 0 && i === lengthCount - 1) {
      content = xString(2, n / 2)
    }

    // Specials
    if (n === 6 && i === 1) {
      content = xString(3, 2)
    }
    if (n === 8 && i === 1) {
      content = xString(4, 2)
    }
    if (n === 9 && i === 2) {
      content = xString(3, 3)
    }
    if (n === 10 && i === 1) {
      content = xString(5, 2)
    }
    if (n === 12 && i === 1) {
      content = xString(6, 2)
    }
    if (n === 12 && i === 2) {
      content = xString(4, 3)
    }
    if (n === 12 && i === 3) {
      content = xString(3, 4)
    }

    if (content) {
      const fontSize = i === 0 ? 42 : 36
      new paper.PointText({
        point: [
          child.position.x + canvasW / 2 - BLEED - 36,
          child.position.y + fontSize / 3,
        ],
        content,
        justification: 'right',
        fillColor: strokeColor,
        fontFamily: 'Futura-Light',
        fontSize,
        opacity: 0.7,
      })
    }
  })

  if (n < 2) {
    const fontSize = 36
    new paper.PointText({
      point: [
        center.x + canvasW / 2 - BLEED - fontSize,
        center.y + fontSize / 3,
      ],
      content: n,
      justification: 'right',
      fillColor: strokeColor,
      fontFamily: 'Futura-Light',
      fontSize,
      opacity: 0.7,
    })
  }

  swatch.sendToBack()

  drawBleed(canvasW, canvasH, BLEED)
}

// eslint-disable-next-line no-irregular-whitespace
const xString = (a: number, b: number): string => `${a}   x  ${b}`
