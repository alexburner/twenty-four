import paper from 'paper'
import { drawByLength } from '../draw'

const proximity = 120

const canvasW = 300 * 11
const canvasH = 300 * 8.5 * 4

const cols = 3
const rows = 8

const total = cols * rows

const cellW = canvasW / cols
const cellH = canvasH / rows
const size = Math.max(cellW, cellH)

export const fields = (canvas: HTMLCanvasElement): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  let n = 1
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = cellW * col + cellW / 2
      const y = cellH * row + cellH / 2
      const center = new paper.Point(x, y)
      const container = new paper.Path.Rectangle({
        point: [x - cellW / 2, y - cellH / 2],
        size: [cellW, cellH],
      })
      container.scale(31 / 32, center)
      drawByLength(container, center, proximity, size, total, n)
      n++
    }
  }
}
