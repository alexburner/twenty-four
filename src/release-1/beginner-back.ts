import paper from 'paper'
import { words } from '../constants'
import { drawBleed } from '../draw'

const BLEED = 36

const canvasW = 300 * 4 + BLEED * 2
const canvasH = 300 * 4 + BLEED * 2

const graphColor = '#333'

export const beginnerBack = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const hue = ((360 * ((n - 1) / (total + 1))) % 360) + 0

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

  const fontSize = 400
  new paper.PointText({
    point: [
      center.x,
      center.y + fontSize / 3 - wordRectHeight / 2 + canvasH * (1 / 24),
    ],
    content: n,
    justification: 'center',
    fillColor: graphColor,
    fontFamily: 'Futura',
    fontSize,
  })

  const word = words[n]?.split('').join(' ')
  const fontSizeWord = 100
  new paper.PointText({
    point: [
      wordRect.position.x,
      wordRect.position.y + fontSizeWord / 3 - BLEED / 2,
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

  drawBleed(canvasW, canvasH, BLEED)
}
