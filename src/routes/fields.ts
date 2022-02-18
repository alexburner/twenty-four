import paper from 'paper'
import { drawByLength, drawDots, getPoints, getRadius } from '../draw'

const proximity = 120

const canvasW = 300 * 11
const canvasH = 300 * 8.5 * 4

const cols = 3
const rows = 8

const total = cols * rows

const cellW = canvasW / cols
const cellH = canvasH / rows
const size = Math.max(cellW, cellH)

const graphColor = '#333'
const dotColor = 'black'
const dotRadius = 20

export const fields = (canvas: HTMLCanvasElement): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  let n = 1
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const color = {
        hue: (360 * ((n - 1) / (total + 1)) - 5) % 360,
        saturation: 0.9,
        brightness: 0.9,
      }
      const shellColor = { ...color, brightness: 0.6 }

      const x = cellW * col + cellW / 2
      const y = cellH * row + cellH / 2
      const center = new paper.Point(x, y)

      const container = new paper.Path.Rectangle({
        point: [x - cellW / 2, y - cellH / 2],
        size: [cellW, cellH],
        fillColor: color,
      })
      container.scale(31 / 32, center)

      const swatch = container.clone()
      swatch.fillColor = color as paper.Color
      swatch.opacity = 1 / 6

      const radius = getRadius(proximity, n)
      const points = getPoints(center, radius, n)

      drawByLength(
        container,
        center,
        proximity,
        radius,
        size,
        n,
        graphColor,
        shellColor,
        points,
      )

      drawDots(points, dotColor, dotRadius)

      n++
    }
  }
}
