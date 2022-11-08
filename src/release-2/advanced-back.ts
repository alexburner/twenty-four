import paper from 'paper'
import {
  drawBleed,
  drawLines,
  drawOutline,
  getPoints,
  spreadLines,
} from '../draw'
import { getAdvancedHue } from './r2-common'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const strokeColor = '#333' as unknown as paper.Color
const strokeWidth = 4
const radius = 80

export const advancedBack = (
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

  if (n === 0 || isInfinity) {
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

  if (isInfinity) {
    /**
     * -> Infinity
     */
    const lengthCount = 3
    const yNudge = radius * 2 + (radius * 3) / lengthCount
    const xNudge = canvasW / 4 - BLEED / 2
    const discs = new paper.Group()
    discs.addChild(
      new paper.Path.Circle({
        center,
        radius,
        strokeColor,
        strokeWidth,
      }),
    )
    for (let i = 1; i < lengthCount; i++) {
      const color = i === 1 ? strokeColor : swatchColor
      discs.addChild(
        new paper.Path.Circle({
          center: [center.x, center.y + yNudge * i],
          radius,
          strokeColor: color,
          strokeWidth,
          fillColor: color,
        }),
      )
      discs.addChild(
        new paper.Path.Circle({
          center: [center.x + xNudge, center.y + yNudge * i],
          radius: radius / 2,
          strokeColor: color,
          strokeWidth,
          fillColor: color,
        }),
      )
    }
    discs.position.y = center.y

    const fontSize = 64
    new paper.PointText({
      point: [center.x, center.y + yNudge + fontSize / 3],
      content: '...',
      justification: 'center',
      fillColor: strokeColor,
      fontFamily: 'Futura',
      fontSize: fontSize,
      opacity: 0.9,
    })
  } else if (n === 1) {
    /**
     * -> 1
     */
    // drawDots(points, strokeColor, strokeWidth)
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

    spread.position = center

    spread.children.forEach((child, i) => {
      let text: string | undefined
      let shape: number | undefined
      // First is n
      if (i === 0) {
        text = String(n)
      }

      // Any even last is 2x(n/2)
      if (n > 2 && n % 2 === 0 && i === lengthCount - 1) {
        shape = 2
        text = xString(shape, n / 2)
      }

      // Specials
      if (n === 6 && i === 1) {
        shape = 3
        text = xString(shape, 2)
      }
      if (n === 8 && i === 1) {
        shape = 4
        text = xString(shape, 2)
      }
      if (n === 9 && i === 2) {
        shape = 3
        text = xString(shape, 3)
      }
      if (n === 10 && i === 1) {
        shape = 5
        text = xString(shape, 2)
      }
      if (n === 12 && i === 1) {
        shape = 6
        text = xString(shape, 2)
      }
      if (n === 12 && i === 2) {
        shape = 4
        text = xString(shape, 3)
      }
      if (n === 12 && i === 3) {
        shape = 3
        text = xString(shape, 4)
      }

      // if (text) {
      //   const fontSize = i === 0 ? 42 : 32
      //   new paper.PointText({
      //     point: [
      //       child.position.x + canvasW / 2 - BLEED - 36,
      //       child.position.y + fontSize / 3,
      //     ],
      //     content: text,
      //     justification: 'right',
      //     fillColor: strokeColor,
      //     fontFamily: 'Futura-Light',
      //     fontSize,
      //     opacity: 0.7,
      //   })
      // }
      console.log('unused', text)

      if (shape) {
        // const outlineRadius = 24
        const outlineRadius = radius * 0.5
        const outline = drawOutline({
          points: getPoints(
            new paper.Point([
              // child.position.x + canvasW / 2 - BLEED - outlineRadius * 3,
              child.position.x + canvasW / 4 - BLEED / 2,
              child.position.y,
            ]),
            outlineRadius,
            shape,
          ),
          strokeColor,
          strokeWidth,
        })
        if (outline) outline.opacity = 0.9
      }
      console.log('unused', child)
    })
  }

  // if (n < 2 || isInfinity) {
  //   const fontSize = 42
  //   new paper.PointText({
  //     point: [center.x + canvasW / 2 - BLEED - 36, center.y + fontSize / 3],
  //     content: isInfinity ? '∞' : n,
  //     justification: 'right',
  //     fillColor: strokeColor,
  //     fontFamily: isInfinity ? 'Noto Serif JP' : 'Futura-Light',
  //     fontSize,
  //     opacity: 0.7,
  //   })
  // }

  swatch.sendToBack()

  drawBleed(canvasW, canvasH, BLEED)
}

// eslint-disable-next-line no-irregular-whitespace
const xString = (a: number, b: number): string => `${a}  x  ${b}`
