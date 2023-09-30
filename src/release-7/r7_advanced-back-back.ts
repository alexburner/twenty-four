import paper from 'paper'
import {
  drawBleed,
  drawLines,
  getApprox,
  getPoints,
  getProximity,
  spreadLines,
} from '../draw'
import { getAdvancedHue } from './r7_common'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const strokeColor = '#333' as unknown as paper.Color
const strokeWidth = 4
const radius = 90

// const dotRadius = 10
// const fontSize = 42
// const outlineRadius = radius * 0.5

const ROUGHNESS = 10

export const r7AdvancedBackBack = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
  _waves: boolean,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const hue = getAdvancedHue(n, total)

  const shapesByLength: Record<number, number> = {}
  const largestShape = total
  for (let shape = 2; shape <= largestShape; shape++) {
    const length = getApprox(getProximity(radius, shape), ROUGHNESS)
    shapesByLength[length] = shape
  }

  const swatchColor = {
    hue,
    saturation: 0.35,
    brightness: 0.99,
  }

  const container = new paper.Path.Rectangle({
    point: [0, 0],
    size: [canvasW, canvasH],
  })

  const swatch = container.clone()
  swatch.fillColor = swatchColor as paper.Color

  const origin = new paper.Point(canvasW / 2, BLEED * 1 + radius * 2)
  const points = getPoints(origin, radius, n)

  const positionGroup = new paper.Group()

  if (n === 0) {
    /**
     * -> 0
     */
  } else if (n === 1) {
    /**
     * -> 1
     */
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

    const goalLength = 1100
    const postCount = groupCount - 1
    const fenceCount = postCount - 1
    const fenceLength = goalLength / fenceCount

    const nBoost = radius * 0.33 * (6 - groupCount)
    const spreadDistance = n > 12 ? fenceLength : nBoost + radius * 2.75

    const spread = spreadLines({
      linesByLength,
      distance: spreadDistance,
      radius,
      center: origin,
      // reverse: true,
    })

    spread.position.y += n > 11 ? radius * 2.7 : spreadDistance

    positionGroup.addChild(spread)
  }

  positionGroup.position.y = canvasH / 2 - radius * 0.1

  // positionGroup.rotate(180, new paper.Point(canvasW / 2, canvasH / 2))

  swatch.sendToBack()

  drawBleed(canvasW, canvasH, BLEED)
}
