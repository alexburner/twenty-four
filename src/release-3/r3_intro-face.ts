import paper from 'paper'
import {
  drawBleedRound,
  drawDots,
  drawOutline,
  getPoints,
  getRadius,
} from '../draw'
import { getRYB } from '../util'
import { getIntroHue } from './r3_common'

const BLEED = 36

const canvasW = 300 * 3.5 + BLEED * 2
const canvasH = 300 * 3.5 + BLEED * 2

const graphColor = '#333'
const proximity = 220
const dotRadius = proximity * 0.42

export const r3IntroFace = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const hue = getIntroHue(n, total)

  let swatchColor = {
    hue,
    saturation: 0.95,
    brightness: 0.95,
  } as paper.Color

  let lightColor = {
    hue,
    saturation: 0,
    brightness: 1,
  } as paper.Color

  const rybHue = (360 * ((n - 1) / (total + 1))) % 360
  // const originalRybHue = rybHue
  // if (n === 1) rybHue -= 360 / (total - 1) / 4
  // if (n > 1) rybHue += 360 / (total + 1) / 1.2
  // if ([2, 3].includes(n)) rybHue -= 360 / (total - 1) / 4
  // if ([4].includes(n)) rybHue += 360 / (total - 1) / 4
  // if ([5, 6].includes(n)) rybHue += 360 / (total - 1) / 3
  // if (n > 5) rybHue -= 360 / (total - 1) / 2
  // if (n > 7) rybHue -= 360 / (total - 1) / 2
  // // if (n > 8) rybHue += 360 / (total - 1) / 6
  // if (n === 10) {
  //   rybHue = originalRybHue
  //   // Match (n === 1)
  //   rybHue -= 360 / (total - 1) / 4
  // }
  swatchColor = getRYB(0, 0, rybHue, 0.9, 0.38) as unknown as paper.Color
  lightColor = getRYB(0, 0, rybHue, 1, 0) as unknown as paper.Color

  const x = canvasW / 2
  const y = x
  const center = new paper.Point(x, y)

  const container = new paper.Path.Rectangle({
    point: [0, 0],
    size: [canvasW, canvasH],
  })

  const swatch = container.clone()
  swatch.fillColor = swatchColor

  const radius = getRadius(proximity, 9)
  const points = getPoints(center, radius, n)

  if (n > 1) {
    drawOutline({
      points,
      fillColor: swatchColor,
      strokeColor: lightColor,
      strokeWidth: (dotRadius * 2) / 4,
    })
  }

  drawDots(points, graphColor, dotRadius)

  swatch.sendToBack()

  drawBleedRound(center, canvasW / 2, BLEED)
}
