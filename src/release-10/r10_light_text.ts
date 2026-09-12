import paper from 'paper'
import { drawBleed } from '../draw'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

export const r10LightText = (
  canvas: HTMLCanvasElement,
  _n: number,
  _total: number,
  _waves: boolean,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

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

  swatch.sendToBack()
  drawBleed(canvasW, canvasH, BLEED)
}
