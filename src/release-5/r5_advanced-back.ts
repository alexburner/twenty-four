import paper from 'paper'
import {
  drawBleed,
  drawDots,
  drawLines,
  drawOutline,
  getApprox,
  getPoints,
  getProximity,
  spreadLines,
} from '../draw'
import { getAdvancedHue, oneDotRadius } from './r5_common'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const strokeColor = '#333' as unknown as paper.Color
const strokeWidth = 4
const radius = 80

const ROUGHNESS = 10

export const r5AdvancedBack = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
  _waves: boolean,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const hue = getAdvancedHue(n, total)

  const max = 48
  const isInfinity = n >= total - 1
  if (isInfinity && n === total - 1) n = max - 1
  else if (isInfinity) n = max
  // n += 70

  const shapesByLength: Record<number, number> = {}
  const largestShape = max
  for (let shape = 2; shape <= largestShape; shape++) {
    const length = getApprox(getProximity(radius, shape), ROUGHNESS)
    shapesByLength[length] = shape
  }

  let swatchColor = {
    hue,
    saturation: 0.35,
    brightness: 0.99,
  }

  if (isInfinity) {
    swatchColor = {
      hue: 0,
      saturation: 0,
      brightness: 1,
    }
  }

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

  if (isInfinity && n === 1) {
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
      // fillColor: swatchColor,
    })

    positionGroup.addChild(firstCircle)

    // const nthSpacing = radius * 2
    const nthSpacing = strokeWidth * 2
    const nthCount = 148
    for (let i = 1; i < nthCount; i++) {
      const nCircle = firstCircle.clone()
      nCircle.position.y += nthSpacing * i
      // nCircle.opacity = (nthCount - i) / nthCount
      // const nChild = nCircle.clone()
      // nChild.scale(0.5)
      // nChild.position.x = canvasW - BLEED * 2 - radius / 2
    }

    firstCircle.bringToFront()
  } else if (n === 1) {
    /**
     * -> 1
     */
    const dots = drawDots([center], strokeColor, oneDotRadius)
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

    const groupCount = Object.keys(linesByLength).length
    console.log(`n=${n} groupCount=${groupCount}`)
    let spreadDistance = radius * 2 + (radius * 3) / groupCount
    if (n > 13) {
      spreadDistance = (canvasH * 0.75) / (groupCount - 1)
    }

    const spread = spreadLines({
      linesByLength,
      distance: spreadDistance,
    })

    spread.position.y -= beforeUpY
    positionGroup.addChild(spread)

    spread.children.forEach((childGroup, i) => {
      if (i === 0) return
      const child = childGroup.children[0] as paper.Path
      const length = getApprox(child.length, ROUGHNESS)
      const shape = shapesByLength[length]
      let factor = shape && childGroup.children.length / shape
      if (factor && shape === 2) factor *= 2 // ?
      if (shape === 2 && n % 2) return // ???

      if (shape) {
        const group = new paper.Group()
        const outlineRadius = radius * 0.5
        const outlinePoint: [number, number] = [
          canvasW - BLEED * 2 - outlineRadius,
          childGroup.position.y,
        ]
        if (shape === 2) {
          outlinePoint[0] += outlineRadius / 2
        }
        const outline = drawOutline({
          points: getPoints(
            new paper.Point(outlinePoint),
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
            outline.position.x - outline.bounds.width / 2 - fontSize * 0.25,
            outline.position.y + fontSize / 3,
          ]
          if (shape === 2) {
            textPoint[0] -= 6
          }
          if (shape === 3) {
            textPoint[0] += 14
            textPoint[1] -= 13
          }
          if (shape === 4) {
            textPoint[0] += 2
          }

          // if (shape === 2) {
          //   textPoint[0] += 1
          // }
          // if (shape === 3) {
          //   textPoint[0] += 20
          //   textPoint[1] -= 12
          //   // textPoint[0] += 10
          //   // textPoint[1] -= 3
          // }
          // if (shape === 4) {
          //   textPoint[0] += 3
          // }
          const pointText = new paper.PointText({
            point: textPoint,
            content: factor,
            justification: 'right',
            fillColor: strokeColor,
            fontFamily: 'FuturaLight',
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

  // let wordFontSize = 48 * 1.125
  // if (isInfinity) wordFontSize *= 1.5
  // const wordPoint = new paper.Point([
  //   BLEED * 3,
  //   canvasH - BLEED * 2 - wordFontSize / 2 - 2,
  // ])
  // if (n > 9 && n < 20) wordPoint.x -= 4
  // if (n > 13 || isInfinity) {
  //   new paper.Path.Circle({
  //     center: [canvasW / 2, wordPoint.y - 20],
  //     radius: radius * 0.625,
  //     fillColor: swatchColor,
  //   })
  // }
  // if (isInfinity) wordPoint.y += 10
  // new paper.PointText({
  //   point: wordPoint,
  //   content: isInfinity ? '∞' : n,
  //   justification: 'left',
  //   fillColor: strokeColor,
  //   fontFamily: isInfinity ? 'Noto Serif JP' : 'FuturaLight',
  //   fontSize: wordFontSize,
  // })

  // if (n <= 16 && !isInfinity) {
  //   positionGroup.position.y = center.y
  //   // positionGroup.position.y -= wordFontSize * 0.75
  // } else {
  //   positionGroup.position.y -= 120 // hacks
  // }
  positionGroup.position.y = center.y

  // positionGroup.position.y = center.y

  swatch.sendToBack()

  drawBleed(canvasW, canvasH, BLEED)
}
