import paper from 'paper'
import { drawBleed } from '../draw'
import { BLEED, CANVAS_H, CANVAS_W, VIS_HEIGHT, VIS_WIDTH } from './r10_common'

const BG_COLOR = new paper.Color('white')
const STROKE_COLOR = new paper.Color('white')
const STROKE_WIDTH = 1

export const r10ColorsSegment = (
  canvas: HTMLCanvasElement,
  args: { saturation: number; brightness: number },
): void => {
  canvas.style.width = `${CANVAS_W}px`
  canvas.style.height = `${CANVAS_H}px`
  paper.setup(canvas)

  // Vis area / mask
  const visX = BLEED * 2
  const visY = BLEED * 2
  const visW = VIS_WIDTH - BLEED * 2
  const visH = VIS_HEIGHT - BLEED * 2
  const visMask = new paper.Path.Rectangle({
    point: [visX, visY],
    size: [visW, visH],
    radius: 30,
  })
  visMask.fillColor = new paper.Color('red') // temp

  // Color rectangles
  const colorCounts = [3, 6, 12, 24, 48, 96, 192, visH]
  const columnWidth = visW / colorCounts.length
  const colorRects: paper.Path.Rectangle[] = []
  colorCounts.forEach((count, columnIndex) => {
    const x = visX + columnIndex * columnWidth
    const rectHeight = visH / count

    for (let i = 0; i < count; i++) {
      const hue = (i / count) * 360

      const rect = new paper.Path.Rectangle({
        point: [x, visY + i * rectHeight],
        size: [columnWidth, rectHeight],
        fillColor: new paper.Color({
          hue,
          // saturation: 1,
          // brightness: 1,
          // saturation: 0.8,
          // brightness: 0.9,
          // saturation: 0.8,
          // brightness: 0.99,
          // saturation: 0.75,
          // brightness: 0.99,
          // info-colors-2
          // saturation: 0.9,
          // brightness: 0.9,
          // info-colors
          // saturation: 0.75,
          // brightness: 0.92,
          saturation: args.saturation,
          brightness: args.brightness,
        }),
        strokeColor: STROKE_COLOR,
        strokeWidth: columnIndex < colorCounts.length - 1 ? STROKE_WIDTH : 0,
      })

      if (columnIndex === colorCounts.length - 1) {
        rect.position.x += STROKE_WIDTH / 2
      }

      colorRects.push(rect)
    }
  })

  // Clip all color rectangles to the rounded vis area
  const visGroup = new paper.Group([visMask, ...colorRects])
  visGroup.clipped = true

  // Card background
  const swatch = new paper.Path.Rectangle({
    point: [0, 0],
    size: [CANVAS_W, CANVAS_H],
  })
  swatch.fillColor = BG_COLOR
  swatch.sendToBack()
  drawBleed(CANVAS_W, CANVAS_H, BLEED)
}
