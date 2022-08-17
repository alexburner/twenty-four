import paper from 'paper'
import { words } from '../constants'
import { drawBleedRound } from '../draw'

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

  const hue = ((360 * ((n - 1) / (total + 0))) % 360) - 12

  const swatchColor = {
    hue,
    saturation: 0.6,
    brightness: 1,
  } as paper.Color

  const lightColor = {
    hue,
    saturation: 0.2,
    brightness: 1,
  } as paper.Color

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
      wordRect.position.y + fontSizeWord / 3 - BLEED + 10,
    ],
    content: word,
    justification: 'center',
    fillColor: graphColor,
    fontFamily: 'Futura-Light',
    fontSize: fontSizeWord,
    opacity: 0.9,
  })

  wordRect.sendToBack()
  swatch.sendToBack()

  drawBleedRound(center, canvasW / 2, BLEED)
}
