import paper from 'paper'
import {
  drawBleed,
  drawDots,
  drawInnerOutline,
  drawLines,
  drawOutline,
  getApprox,
  getPoints,
  getProximity,
  spreadLines,
} from '../draw'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const strokeColor = '#333' as unknown as paper.Color
const fillColor = new paper.Color('white')
const strokeWidth = 4
const radius = 80
const dotRadius = 10

const fontSize = 42
const outlineRadius = radius * 0.5

const ROUGHNESS = 100

export const r8BigSpread = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
  _waves: boolean,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const shapesByLength: Record<number, number> = {}
  const largestShape = total
  for (let shape = 2; shape <= largestShape; shape++) {
    const length = getApprox(getProximity(radius, shape), ROUGHNESS)
    shapesByLength[length] = shape
  }

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

  const origin = new paper.Point(canvasW / 2, canvasH / 2)
  const points = getPoints(origin, radius, n)

  const positionGroup = new paper.Group()

  const outlineX = BLEED * 1 + (canvasW - BLEED * 2) * 0.23
  const outlineY = origin.y
  const textX = canvasW - outlineX
  const textY = outlineY + fontSize * 0.4

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
      const outlinePoint = new paper.Point(outlineX, childDotGroup.position.y)
      const outlineDots = drawDots(
        [outlinePoint],
        strokeColor,
        dotRadius * 0.75,
      )
      const textPoint = [textX, textY]
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

    let distance
    if (n < 14) {
      // TODO do this better, spread evenly to target height (+dots)
      switch (n) {
        case 11:
          distance = radius * 2.94
          break
        case 12:
          distance = radius * 2.43
          break
        default:
          distance = radius * 2.33
      }
    } else {
      const groupCount = Object.keys(linesByLength).length + 1
      const goalLength = 1000
      const postCount = groupCount - 1
      const fenceCount = postCount - 1
      const fenceLength = goalLength / fenceCount
      distance = fenceLength
    }

    const spread = spreadLines({
      linesByLength,
      distance,
      radius,
      center: origin,
      // reverse: true,
    })

    // spread.position.y += n > 11 ? radius * 2.67 : spreadDistance

    // positionGroup.addChild(spread)

    spread.children.forEach((childGroup, _i) => {
      {
        const skip = spread.children.length - _i
        const fill = drawInnerOutline({
          points,
          strokeColor: 'transparent',
          strokeWidth: 0,
          fillColor,
          skip,
        })
        fill.position.y += distance * (spread.children.length - _i - 1)
        setTimeout(() => {
          positionGroup.addChild(fill)
          positionGroup.addChild(childGroup)
          childGroup.sendToBack()
          fill.sendToBack()
        }, 0)
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

      const outlinePoint = [outlineX, childGroup.position.y]
      const outlineColor = parentStrokeColor.clone()
      outlineColor.brightness -= 0.075
      outlineColor.saturation -= 0.025
      const outline = drawOutline({
        points: getPoints(new paper.Point(outlinePoint), outlineRadius, shape),
        strokeColor: outlineColor,
        strokeWidth,
        fillColor,
      })
      setTimeout(
        () => positionGroup.addChild(outline),
        spread.children.length - _i,
      )

      const textPoint = [textX, outline.position.y + fontSize * 0.4]
      const textColor = parentStrokeColor.clone()
      textColor.brightness -= 0.175
      textColor.saturation -= 0.05
      const text = new paper.PointText({
        point: textPoint,
        content: factor,
        justification: 'center',
        fillColor: textColor,
        fontFamily: 'FuturaLight',
        fontSize,
      })
      positionGroup.addChild(text)
    })

    {
      // zero-point group
      const childDotGroup = drawDots(points, strokeColor, dotRadius)
      const goal = radius * 2
      const extra = dotRadius * 2
      const curr = goal + extra
      const scale = goal / curr // curr * scale = goal -> scale = goal / curr
      childDotGroup.scale(scale)

      childDotGroup.position = spread.bounds.bottomCenter
      // childDotGroup.position.y += radius
      // childDotGroup.position.y += dotRadius * 2
      childDotGroup.position.y = 1930

      positionGroup.addChild(childDotGroup)
      const outlinePoint = new paper.Point(outlineX, childDotGroup.position.y)
      const outlineDots = drawDots(
        [outlinePoint],
        strokeColor,
        dotRadius * 0.75,
      )
      const textPoint = [textX, outlinePoint.y + fontSize / 3]
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
  }

  setTimeout(() => {
    positionGroup.position.y = canvasH / 2
  }, 100)

  swatch.sendToBack()
  drawBleed(canvasW, canvasH, BLEED)
}
