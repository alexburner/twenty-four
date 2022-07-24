import paper from 'paper'
import { words } from '../constants'

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
  }

  const x = canvasW / 2
  const y = x
  const center = new paper.Point(x, y)

  const container = new paper.Path.Rectangle({
    point: [0, 0],
    size: [canvasW, canvasH],
  })

  const swatch = container.clone()
  swatch.fillColor = swatchColor as paper.Color

  const wordRectHeight = canvasH * (1 / 4)
  const wordRect = new paper.Path.Rectangle({
    point: [0, canvasH - wordRectHeight],
    size: [canvasW, wordRectHeight],
  })
  wordRect.fillColor = {
    hue,
    saturation: 0.3,
    brightness: 1,
  } as paper.Color

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
    point: [wordRect.position.x, wordRect.position.y + fontSizeWord / 3],
    content: word?.toUpperCase(),
    justification: 'center',
    fillColor: graphColor,
    fontFamily: 'Futura-Light',
    fontSize: fontSizeWord,
    opacity: 0.7,
  })

  wordRect.sendToBack()
  swatch.sendToBack()
}
