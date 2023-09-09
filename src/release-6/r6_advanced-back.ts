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
import { getAdvancedHue, oneDotRadius } from './r6_common'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const strokeColor = '#333' as unknown as paper.Color
const strokeWidth = 4
const radius = 80

const ROUGHNESS = 10

export const r6AdvancedBack = (
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

  const positionGroup = new paper.Group()

  const outlineRadius = radius * 0.5
  const outlineX = BLEED * 2 + outlineRadius * 0 + canvasW * 0.15

  if (n === 0) {
    {
      // zero-point group
      const outlinePoint = new paper.Point(outlineX, center.y)
      const fontSize = 42
      const textPoint: [number, number] = [
        canvasW - outlinePoint.x,
        outlinePoint.y + fontSize / 3,
      ]
      const pointTextColor = strokeColor
      const pointText = new paper.PointText({
        point: textPoint,
        content: n,
        justification: 'center',
        fillColor: pointTextColor,
        fontFamily: 'FuturaLight',
        fontSize,
      })
      positionGroup.addChild(pointText)
    }
  } else if (n === 1) {
    /**
     * -> 1
     */
    const dotGroup = drawDots([center], strokeColor, oneDotRadius)
    positionGroup.addChild(dotGroup)

    {
      // zero-point group
      const childDotGroup = drawDots(points, strokeColor, oneDotRadius)
      const goal = radius * 2
      const extra = oneDotRadius * 2
      const curr = goal + extra
      const scale = goal / curr // curr * scale = goal -> scale = goal / curr
      childDotGroup.scale(scale)
      positionGroup.addChild(childDotGroup)
      const outlinePoint = new paper.Point(outlineX, childDotGroup.position.y)
      const outlineDots = drawDots(
        [outlinePoint],
        strokeColor,
        oneDotRadius * 0.75,
      )
      const fontSize = 42
      const textPoint: [number, number] = [
        canvasW - outlinePoint.x,
        outlinePoint.y + fontSize / 3,
      ]
      const pointTextColor = strokeColor
      const pointText = new paper.PointText({
        point: textPoint,
        content: n,
        justification: 'center',
        fillColor: pointTextColor,
        fontFamily: 'FuturaLight',
        fontSize,
      })
      positionGroup.addChild(outlineDots)
      positionGroup.addChild(pointText)
    }
  } else if (n > 1) {
    /**
     * -> n
     */

    const linesByLength = drawLines({
      points,
      strokeColor,
      strokeWidth,
    })

    const groupCount = Object.keys(linesByLength).length + 1
    console.log(`n=${n} groupCount=${groupCount}`)
    const nBoost = radius * 0.25 * (6 - groupCount)
    const spreadDistance = nBoost + radius * 2.75
    const overflowSpreadDistance = (canvasH * 0.67) / (groupCount - 2)
    const spread = spreadLines({
      linesByLength,
      distance: n < 12 ? spreadDistance : overflowSpreadDistance,
      radius,
      center,
    })

    positionGroup.addChild(spread)

    {
      // zero-point group
      const childDotGroup = drawDots(points, strokeColor, oneDotRadius)
      const goal = radius * 2
      const extra = oneDotRadius * 2
      const curr = goal + extra
      const scale = goal / curr // curr * scale = goal -> scale = goal / curr
      childDotGroup.scale(scale)
      childDotGroup.position.y +=
        spreadDistance * spread.children.length + radius * 0.125
      positionGroup.addChild(childDotGroup)
      const outlinePoint = new paper.Point(outlineX, childDotGroup.position.y)
      const outlineDots = drawDots(
        [outlinePoint],
        strokeColor,
        oneDotRadius * 0.75,
      )
      const fontSize = 42
      const textPoint: [number, number] = [
        canvasW - outlinePoint.x,
        outlinePoint.y + fontSize / 3,
      ]
      const pointTextColor = strokeColor
      const pointText = new paper.PointText({
        point: textPoint,
        content: n,
        justification: 'center',
        fillColor: pointTextColor,
        fontFamily: 'FuturaLight',
        fontSize,
      })
      positionGroup.addChild(outlineDots)
      positionGroup.addChild(pointText)
    }

    spread.children.forEach((childGroup) => {
      const child = childGroup.children[0] as paper.Path
      const length = getApprox(child.length, ROUGHNESS)
      const shape = shapesByLength[length]
      let factor = shape && (childGroup.children.length - 1) / shape
      if (factor && shape === 2) factor *= 2 // ?
      if (shape === 2 && n % 2) return // ???

      if (!shape) return

      const parentStrokeColor = new paper.Color(strokeColor)

      const group = new paper.Group()
      const outlinePoint: [number, number] = [outlineX, childGroup.position.y]
      const outline = drawOutline({
        points: getPoints(new paper.Point(outlinePoint), outlineRadius, shape),
        strokeColor: parentStrokeColor,
        strokeWidth,
      })

      if (factor) {
        const fontSize = 42
        const textPoint: [number, number] = [
          canvasW - outline.position.x,
          outline.position.y + fontSize / 3,
        ]
        const pointTextColor = strokeColor
        const pointText = new paper.PointText({
          point: textPoint,
          content: factor,
          justification: 'center',
          fillColor: pointTextColor,
          fontFamily: 'FuturaLight',
          fontSize,
        })
        group.addChild(outline)
        group.addChild(pointText)
        positionGroup.addChild(group)
      }
    })
  }

  positionGroup.position.y = center.y

  swatch.sendToBack()

  drawBleed(canvasW, canvasH, BLEED)
}
