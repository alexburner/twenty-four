import paper from 'paper'
import {
  drawBleed,
  drawDots,
  drawLines,
  drawOutline,
  getPoints,
  spreadLines,
} from '../draw'
import { getAdvancedHue, oneDotRadius } from './r4_common'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const strokeColor = '#333' as unknown as paper.Color
const strokeWidth = 4
const radius = 80

export const r4AdvancedBack = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
  _waves: boolean,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const hue = getAdvancedHue(n, total)

  const isInfinity = n === total
  if (isInfinity) n = 1

  const swatchColor = {
    hue,
    saturation: 0.35,
    brightness: 0.99,
  }

  // if (isInfinity) {
  //   swatchColor = {
  //     hue: 0,
  //     saturation: 0,
  //     brightness: 1,
  //   }
  // }

  const container = new paper.Path.Rectangle({
    point: [0, 0],
    size: [canvasW, canvasH],
  })

  const swatch = container.clone()
  swatch.fillColor = swatchColor as paper.Color

  const center = new paper.Point(canvasW / 2, canvasH / 2)
  const points = getPoints(center, radius, n)

  const beforeUpY = canvasH * 0.42 - radius * 2

  const positionGroup = new paper.Group()

  if (isInfinity) {
    /**
     * -> Infinity
     */
    const startPoint = center.clone()
    startPoint.y -= beforeUpY

    const firstCircle = new paper.Path.Circle({
      center: startPoint,
      radius,
      strokeColor,
      strokeWidth,
      fillColor: swatchColor,
    })

    positionGroup.addChild(firstCircle)

    const nthSpacing = strokeWidth * 2
    const nthCount = 180
    for (let i = 1; i < nthCount; i++) {
      const nCircle = firstCircle.clone()
      nCircle.position.y += nthSpacing * i
      // nCircle.opacity = (nthCount - i) / nthCount
    }

    firstCircle.bringToFront()
  } else if (n === 1) {
    /**
     * -> 1
     */
    const dotPoint = center.clone()
    dotPoint.y -= beforeUpY + radius
    const dots = drawDots([dotPoint], strokeColor, oneDotRadius)
    positionGroup.addChild(dots)
  } else {
    /**
     * -> n
     */

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

    spread.position.y -= beforeUpY
    positionGroup.addChild(spread)

    spread.children.forEach((child, i) => {
      let shape: number | undefined
      let factor: number | undefined

      // Any even last is 2x(n/2)
      if (n > 2 && n % 2 === 0 && i === lengthCount - 1) {
        factor = n / 2
        shape = 2
      }

      // Specials
      if (n === 6 && i === 1) {
        factor = 2
        shape = 3
      }
      if (n === 8 && i === 1) {
        factor = 2
        shape = 4
      }
      if (n === 9 && i === 2) {
        factor = 3
        shape = 3
      }
      if (n === 10 && i === 1) {
        factor = 2
        shape = 5
      }
      if (n === 12 && i === 1) {
        factor = 2
        shape = 6
      }
      if (n === 12 && i === 2) {
        factor = 3
        shape = 4
      }
      if (n === 12 && i === 3) {
        factor = 4
        shape = 3
      }

      if (shape) {
        const group = new paper.Group()
        const outlineRadius = radius * 0.5
        const outline = drawOutline({
          points: getPoints(
            new paper.Point([
              canvasW - BLEED * 2 - outlineRadius,
              child.position.y,
            ]),
            outlineRadius,
            shape,
          ),
          strokeColor,
          strokeWidth,
        })

        outline.opacity = 0.9

        if (factor) {
          const fontSize = 42
          const textPoint: [number, number] = [
            outline.position.x - outline.bounds.width / 2 - fontSize * 0.75,
            outline.position.y + fontSize / 3,
          ]
          if (shape === 3) {
            textPoint[0] += 13
            textPoint[1] -= 6
          }
          const pointText = new paper.PointText({
            point: textPoint,
            content: factor,
            justification: 'center',
            fillColor: strokeColor,
            fontFamily: 'Futura-Light',
            fontSize,
          })

          group.addChild(outline)
          group.addChild(pointText)
          // group.position = outline.position

          positionGroup.addChild(group)
        }
      }
    })
  }

  let wordFontSize = 48 * 1.125
  if (isInfinity) wordFontSize *= 1.5
  const wordPoint = new paper.Point([
    canvasW / 2,
    canvasH - BLEED * 2 - wordFontSize / 2 - 2,
  ])
  if (n > 9 && n < 20) wordPoint.x -= 4
  if (n > 13 || isInfinity) {
    new paper.Path.Circle({
      center: [canvasW / 2, wordPoint.y - 20],
      radius: radius * 0.625,
      fillColor: swatchColor,
    })
  }
  if (isInfinity) wordPoint.y += 10
  new paper.PointText({
    point: wordPoint,
    content: isInfinity ? '∞' : n,
    justification: 'center',
    fillColor: strokeColor,
    fontFamily: isInfinity ? 'Noto Serif JP' : 'Futura-Light',
    fontSize: wordFontSize,
  })

  if (n < 14 && !isInfinity) {
    positionGroup.position.y = center.y
    positionGroup.position.y -= wordFontSize * 0.75
  } else if (isInfinity) {
    positionGroup.position.y -= 70 // hacks
  } else {
    positionGroup.position.y -= 70 // hacks
  }

  swatch.sendToBack()

  drawBleed(canvasW, canvasH, BLEED)
}
