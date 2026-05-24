import paper from 'paper'
import {
  drawBleed,
  drawDots,
  drawFactorN,
  drawInnerOutline,
  drawLines,
  getApprox,
  getPoints,
  getProximity,
  spreadLines,
} from '../draw'
import { getAdvancedHue } from './r9_common'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const strokeColor = '#333' as unknown as paper.Color
const fillColor = new paper.Color('white')
const strokeWidth = 4
const radius = 80
const dotRadius = 12

const fontSize = 42
const outlineRadius = radius * 0.5

const ROUGHNESS = 100

const EVEN_GRAVITY = false

const STATIC_LIMIT = 14

export const r9HueSpread = (
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

  const origin = new paper.Point(canvasW / 3, canvasH / 2)
  const points = getPoints(origin, radius, n, false, EVEN_GRAVITY)

  const positionGroup = new paper.Group()

  const outlineX = canvasW * (2 / 3) + BLEED
  // const outlineY = origin.y
  // const textX = outlineX - outlineRadius * 1.8
  // const textY = outlineY + fontSize * 0.4

  if (n === 0) {
    /**
     * -> 0
     */
  } else if (n === 1) {
    /**
     * -> 1
     */
    const dotGroup = drawDots([origin], strokeColor, dotRadius)
    positionGroup.addChild(dotGroup)

    {
      // zero-point group
      const childDotGroup = drawDots(points, strokeColor, dotRadius)
      const goal = radius * 2
      const extra = dotRadius * 2
      const curr = goal + extra
      const scale = goal / curr // curr * scale = goal -> scale = goal / curr
      childDotGroup.scale(scale)
      positionGroup.addChild(childDotGroup)

      // factor group
      const factorGroup = drawFactorN({
        center: new paper.Point([outlineX, childDotGroup.position.y]),
        radius: outlineRadius,
        shapeN: 1,
        multipleN: n,
        strokeWidth,
        strokeColor,
        fillColor,
        textColor: strokeColor,
        fontSize,
        dotRadius,
        evenGravity: EVEN_GRAVITY,
      })
      positionGroup.addChild(factorGroup)
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

    let distance: number
    if (n < STATIC_LIMIT) {
      const groupCount = Object.keys(linesByLength).length + 1
      const reduction = n < 4 ? BLEED * 4 : n < 6 ? BLEED * 3 : BLEED * 0
      const height = canvasH - reduction
      distance = height / (groupCount + 1)
    } else {
      const groupCount = Object.keys(linesByLength).length + 1
      const goalLength = 1000 * 1.275
      const postCount = groupCount - 1
      const fenceCount = postCount - 1
      const fenceLength = goalLength / fenceCount
      distance = fenceLength
    }

    const spread = spreadLines({
      linesByLength,
      distance,
      radius,
      center: new paper.Point(origin.x, origin.y),
      reverse: true,
    })

    // spread.position.y += n > 11 ? radius * 2.67 : spreadDistance

    positionGroup.addChild(spread)

    spread.children.forEach((childGroup, i) => {
      if (n < 100) {
        const skip = i + 1
        const fill = drawInnerOutline({
          points,
          strokeColor: 'transparent',
          strokeWidth: 0,
          fillColor,
          skip,
        })
        const thing = spread.children.length - i - 1
        fill.position.y += distance * thing
        setTimeout(() => {
          positionGroup.addChild(fill)
          positionGroup.addChild(childGroup)
          childGroup.sendToBack()
          fill.sendToBack()
        }, 1 + thing * 2)
      }

      const parentStrokeColor = new paper.Color(strokeColor)

      const child = childGroup.children[0] as paper.Path
      const length = getApprox(child.length, ROUGHNESS)
      const shape = shapesByLength[length]
      if (!shape) return
      let factor = (childGroup.children.length - 1) / shape
      if (shape === 2) factor *= 2 // ?
      if (shape === 2 && n % 2) return // ???
      if (factor === n) return // ????
      if (n % shape != 0) {
        // accuracy gets shaky as n grows
        // -> floating point fuzz?
        if (n === 360) {
          console.log('—— skipping child ——')
          console.log('factor', factor)
          console.log('n', n)
          console.log('shape', shape)
          console.log('remainder', n % shape)
        }
        return
      }
      if (!factor) return

      {
        const outlineColor = parentStrokeColor.clone()
        outlineColor.brightness -= 0.075
        outlineColor.saturation -= 0.025
        const factorGroup = drawFactorN({
          center: new paper.Point([outlineX, childGroup.position.y]),
          radius: outlineRadius,
          shapeN: shape,
          multipleN: factor,
          strokeWidth,
          strokeColor: outlineColor,
          fillColor,
          textColor: parentStrokeColor,
          fontSize,
          dotRadius,
          evenGravity: EVEN_GRAVITY,
        })
        positionGroup.addChild(factorGroup)
      }
    })

    {
      // zero-point group
      const childDotGroup = drawDots(points, strokeColor, dotRadius)
      const goal = radius * 2
      const extra = dotRadius * 2
      const curr = goal + extra
      const scale = goal / curr // curr * scale = goal -> scale = goal / curr
      childDotGroup.scale(scale)
      childDotGroup.position = spread.bounds.topCenter
      childDotGroup.position.y -= Math.max(distance - radius, radius * 1.4)
      // if (n < STATIC_LIMIT) {
      //   childDotGroup.position.y -= distance - radius
      // } else {
      //   childDotGroup.position.y = origin.y - radius * 2.5
      // }
      positionGroup.addChild(childDotGroup)

      // factor group
      const factorGroup = drawFactorN({
        center: new paper.Point([outlineX, childDotGroup.position.y]),
        radius: outlineRadius,
        shapeN: 1,
        multipleN: n,
        strokeWidth,
        strokeColor,
        fillColor,
        textColor: strokeColor,
        fontSize,
        dotRadius,
        evenGravity: EVEN_GRAVITY,
      })
      positionGroup.addChild(factorGroup)
    }
  }

  setTimeout(() => {
    positionGroup.position.y = canvasH / 2
    positionGroup.position.x += canvasW * 0.01
  }, 1000)

  swatch.sendToBack()
  drawBleed(canvasW, canvasH, BLEED)
}
