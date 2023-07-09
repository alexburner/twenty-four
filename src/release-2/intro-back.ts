import paper from 'paper'
import { words } from '../constants'
import { drawBleedRound } from '../draw'
import { getRYB } from '../util'
import { getIntroHue } from './r2-common'

const BLEED = 36

const canvasW = 300 * 3.5 + BLEED * 2
const canvasH = 300 * 3.5 + BLEED * 2

const graphColor = '#333'

export const introBack = (
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
    saturation: 0.7,
    brightness: 1,
  } as paper.Color

  let lightColor = {
    hue,
    saturation: 0.2,
    brightness: 1,
  } as paper.Color

  let rybHue = ((360 * ((n - 1) / (total - 1))) % 360) - 15
  const originalRybHue = rybHue
  if (n === 1) rybHue -= 360 / (total - 1) / 4
  if (n > 1) rybHue += 360 / (total - 1) / 1
  if ([2, 3].includes(n)) rybHue -= 360 / (total - 1) / 4
  if ([4].includes(n)) rybHue += 360 / (total - 1) / 4
  if ([5, 6].includes(n)) rybHue += 360 / (total - 1) / 3
  if (n > 5) rybHue -= 360 / (total - 1) / 2
  if (n > 7) rybHue -= 360 / (total - 1) / 2
  // if (n > 8) rybHue += 360 / (total - 1) / 6
  if (n === 10) {
    rybHue = originalRybHue
    // Match (n === 1)
    rybHue -= 360 / (total - 1) / 4
  }
  swatchColor = getRYB(0, 0, rybHue, 0.9, 0.38) as unknown as paper.Color
  lightColor = getRYB(0, 0, rybHue, 1, 0.11) as unknown as paper.Color

  const x = canvasW / 2
  const y = x
  const center = new paper.Point(x, y)

  const container = new paper.Path.Rectangle({
    point: [0, 0],
    size: [canvasW, canvasH],
  })

  const swatch = container.clone()
  swatch.fillColor = swatchColor

  const wordRectHeight = canvasH * (1 / 6) + BLEED
  const wordRect = new paper.Path.Rectangle({
    point: [0, canvasH - wordRectHeight],
    size: [canvasW, wordRectHeight],
  })
  wordRect.fillColor = lightColor

  const fontSize = 450
  new paper.PointText({
    point: [center.x, center.y + fontSize / 3 - canvasH * (1 / 96)],
    content: n,
    justification: 'center',
    fillColor: graphColor,
    fontFamily: 'Futura',
    fontSize,
  })

  const word = words[n]?.split('').join(' ')
  const fontSizeWord = 90
  new paper.PointText({
    point: [
      wordRect.position.x,
      wordRect.position.y + fontSizeWord / 3 - BLEED + 8,
    ],
    content: word,
    justification: 'center',
    fillColor: graphColor,
    fontFamily: 'FuturaLight',
    fontSize: fontSizeWord,
    opacity: 0.9,
  })

  wordRect.sendToBack()
  swatch.sendToBack()

  drawBleedRound(center, canvasW / 2, BLEED)
}
