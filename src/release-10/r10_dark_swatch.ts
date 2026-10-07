import paper from 'paper'
import { drawBleed } from '../draw'
import { BLEED, CANVAS_H, CANVAS_W, getSwatchColor } from './r10_common'

export const r10DarkSwatch = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
  _waves: boolean,
): void => {
  canvas.style.width = `${CANVAS_W}px`
  canvas.style.height = `${CANVAS_H}px`
  paper.setup(canvas)

  const swatchColor = getSwatchColor(n, total)

  const container = new paper.Path.Rectangle({
    point: [0, 0],
    size: [CANVAS_W, CANVAS_H],
  })

  const swatch = container.clone()
  swatch.fillColor = swatchColor
  swatch.sendToBack()

  drawBleed(CANVAS_W, CANVAS_H, BLEED)
}
