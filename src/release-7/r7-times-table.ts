import paper from 'paper'
import { drawBleed } from '../draw'

const BLEED = 36
const canvasH = 300 * 2.75 + BLEED * 2
const canvasW = 300 * 4.75 + BLEED * 2

const firstN = 1
const pageSize = 10

export const r7TimesTable = (
  canvas: HTMLCanvasElement,
  pageIndex: number,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const swatchColor = new paper.Color({
    hue: 0,
    saturation: 0,
    brightness: 1,
  })

  const container = new paper.Path.Rectangle({
    point: [0, 0],
    size: [canvasW, canvasH],
  })

  const swatch = container.clone()
  swatch.fillColor = swatchColor

  const startN = firstN + pageSize * pageIndex
  const limitN = startN + pageSize
  for (let n = startN; n < limitN; n++) {
    // todo: n row
  }

  swatch.sendToBack()

  drawBleed(canvasW, canvasH, BLEED)
}
