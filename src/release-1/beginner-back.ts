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

  const textGroup = new paper.Group()

  const fontSize = 400
  textGroup.addChild(
    new paper.PointText({
      point: [center.x, center.y],
      content: n,
      justification: 'center',
      fillColor: graphColor,
      fontFamily: 'Futura',
      fontSize,
    }),
  )

  const word = words[n]?.split('').join(' ')
  const fontSizeWord = 100
  textGroup.addChild(
    new paper.PointText({
      point: [canvasW / 2, center.y + canvasH * (4 / 24)],
      content: word?.toUpperCase(),
      justification: 'center',
      fillColor: graphColor,
      fontFamily: 'Futura',
      fontSize: fontSizeWord,
      opacity: 0.9,
    }),
  )

  textGroup.position = center

  swatch.sendToBack()
}
