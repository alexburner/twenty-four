import paper from 'paper'
import { drawPerlin } from '../drawPerlin'

const canvasW = 500
const canvasH = 500

export const perlin = (canvas: HTMLCanvasElement): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const swatch = new paper.Path.Rectangle({
    point: [0, 0],
    size: [canvasW, canvasH],
  })

  swatch.fillColor = '#FFF' as unknown as paper.Color

  drawPerlin()
}
