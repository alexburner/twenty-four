import paper from 'paper'
import { drawBleed } from '../draw'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

export const r7InfoColors = (canvas: HTMLCanvasElement): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const swatchColor = new paper.Color('white')

  const container = new paper.Path.Rectangle({
    point: [0, 0],
    size: [canvasW, canvasH],
  })

  const swatch = container.clone()
  swatch.fillColor = swatchColor as paper.Color

  const raster = new paper.Raster('spectrum')
  raster.scale(1.2)
  raster.position.x = canvasW / 2
  raster.position.y = raster.bounds.height / 2 + BLEED * 2.25

  swatch.sendToBack()

  drawBleed(canvasW, canvasH, BLEED)
}
