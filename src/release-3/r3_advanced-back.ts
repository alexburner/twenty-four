import paper from 'paper'
import { words } from '../constants'
import {
  drawBleed,
  drawDots,
  drawLines,
  drawOutline,
  getPoints,
  spreadLines,
} from '../draw'
import { getAdvancedHue } from './r3_common'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const strokeColor = '#333' as unknown as paper.Color
const strokeWidth = 4
const radius = 80

export const r3AdvancedBack = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const hue = getAdvancedHue(n, total)

  const isInfinity = n === total
  if (isInfinity) n = 1

  let swatchColor = {
    hue,
    saturation: 0.35,
    brightness: 0.99,
  }

  // const fixedN = isInfinity ? total : n
  // const rybHue = ((360 * ((fixedN - 1) / (total - 0))) % 360) - 0
  // swatchColor = getRYB(0, 0, rybHue, 0.9, 0.4) as unknown as paper.Color

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
  const spacing = radius * 2.5

  // TODO: lol this is janky, these should be fn or somethign
  const positionGroup = new paper.Group()

  if (isInfinity) {
    /**
     * -> Infinity
     */
    const questionOpacity = 0.33

    const startPoint = center.clone()
    startPoint.y -= beforeUpY

    const fontSize = 54

    positionGroup.addChild(
      new paper.PointText({
        point: [startPoint.x, startPoint.y + spacing + fontSize / 3],
        content: '?',
        justification: 'center',
        fillColor: strokeColor,
        fontFamily: 'Andale Mono',
        fontSize: fontSize,
        opacity: 0.9,
      }),
    )

    positionGroup.addChild(
      new paper.Path.Circle({
        center: startPoint,
        radius,
        strokeColor,
        strokeWidth,
      }),
    )

    positionGroup.addChild(
      new paper.Path.Circle({
        center: [startPoint.x, startPoint.y + spacing],
        radius,
        strokeColor,
        strokeWidth,
        // dashArray: [strokeWidth * 3, strokeWidth * 4],
        opacity: questionOpacity,
        strokeCap: 'round',
      }),
    )

    {
      // Child

      const childFontSize = 48

      const childCenter = new paper.Point([
        canvasW * 0.75,
        startPoint.y + spacing,
      ])

      const childTextCenter = childCenter.clone()
      childTextCenter.y += childFontSize / 3
      childTextCenter.x += radius / 2 + childFontSize * 0.75

      const childGroup = new paper.Group([
        new paper.PointText({
          point: childTextCenter,
          content: '?',
          justification: 'center',
          fillColor: strokeColor,
          fontFamily: 'Andale Mono',
          fontSize: childFontSize,
          opacity: 0.9,
        }),
        new paper.Path.Circle({
          center: childCenter,
          radius: radius / 2,
          strokeColor,
          strokeWidth,
          // dashArray: [strokeWidth * 3, strokeWidth * 4],
          opacity: questionOpacity,
          strokeCap: 'round',
        }),
      ])

      // childGroup.position = childCenter

      positionGroup.addChild(childGroup)
    }

    positionGroup.addChild(
      new paper.PointText({
        point: [startPoint.x, startPoint.y + spacing * 2 + fontSize / 3],
        content: '?',
        justification: 'center',
        fillColor: strokeColor,
        fontFamily: 'Andale Mono',
        fontSize: fontSize,
        opacity: 0.9,
      }),
    )

    positionGroup.position.y = center.y
  } else if (n === 1) {
    /**
     * -> 1
     */

    const dotPoint = center.clone()
    dotPoint.y -= beforeUpY + radius
    const dots = drawDots([dotPoint], strokeColor, radius / 12)
    positionGroup.addChild(dots)
    positionGroup.position = center
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
      distance: spacing,
    })

    spread.position.y -= beforeUpY
    positionGroup.addChild(spread)
    positionGroup.position = center

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
            new paper.Point([canvasW * 0.75, child.position.y]),
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
            outline.position.x + outline.bounds.width / 2 + fontSize * 0.9,
            outline.position.y + fontSize / 3,
          ]
          if (shape === 3) {
            textPoint[0] -= 6
            textPoint[1] -= 2
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

  const word = (isInfinity ? 'infinity' : words[n])?.split('').join(' ')
  const wordFontSize = 48 * 1.125
  const wordPoint = new paper.Point([
    canvasW / 2,
    positionGroup.bounds.bottom + wordFontSize / 3 + radius * 1,
  ])
  if (n === 0) wordPoint.y = center.y
  if (isInfinity) wordPoint.y += radius * 2
  const wordText = new paper.PointText({
    point: wordPoint,
    content: word,
    justification: 'center',
    fillColor: strokeColor,
    fontFamily: 'Futura-Light',
    fontSize: wordFontSize,
  })

  positionGroup.addChild(wordText)
  positionGroup.position.y = center.y
  positionGroup.position.y += wordFontSize * 0.125

  swatch.sendToBack()

  drawBleed(canvasW, canvasH, BLEED)
}
