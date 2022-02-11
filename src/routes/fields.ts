import paper from 'paper'
import { drawByLength } from '../draw'

const length = 120

const canvasW = 300 * 11
const canvasH = 300 * 8.5 * 4

const cols = 3
const rows = 8

const total = cols * rows

const cellW = canvasW / cols
const cellH = canvasH / rows

export const fields = (canvas: HTMLCanvasElement): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  let n = 1
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = cellW * col + cellW / 2
      const y = cellH * row + cellH / 2
      drawByLength(new paper.Point(x, y), length, cellW, cellH, total, n)
      n++
    }
  }
}
