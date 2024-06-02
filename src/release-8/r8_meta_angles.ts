import paper from 'paper'
import { drawBleed } from '../draw'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const swatchColor = new paper.Color('white')
// const strokeColor = new paper.Color('#333')
// const strokeWidth = 1.5

export const r8MetaAngles = (canvas: HTMLCanvasElement): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  /**
   * TODO
   */

  const swatch = new paper.Path.Rectangle({
    point: [0, 0],
    size: [canvasW, canvasH],
  })
  swatch.fillColor = swatchColor
  swatch.sendToBack()
  drawBleed(canvasW, canvasH, BLEED)
}
