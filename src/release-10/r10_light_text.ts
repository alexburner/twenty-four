import paper from 'paper'
import { drawBleed } from '../draw'
import { getAdvancedHue, GIANT_LIMIT } from './r10_common'

const BLEED = 36
const VIS_WIDTH = 300 * 2.75
const VIS_HEIGHT = 300 * 4.75
const CANVAS_W = VIS_WIDTH + BLEED * 2
const CANVAS_H = VIS_HEIGHT + BLEED * 2

const SWATCH_HEIGHT = VIS_HEIGHT * 0.088

const STROKE_COLOR = new paper.Color('#333')

export const r10LightText = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
  _waves: boolean,
): void => {
  canvas.style.width = `${CANVAS_W}px`
  canvas.style.height = `${CANVAS_H}px`
  paper.setup(canvas)

  const bgColor = new paper.Color({
    hue: 0,
    saturation: 0,
    brightness: 1,
  })

  const swatchColor =
    n < GIANT_LIMIT
      ? new paper.Color({
          hue: getAdvancedHue(n, total),
          saturation: 0.42,
          brightness: 0.99,
        })
      : STROKE_COLOR

  const container = new paper.Path.Rectangle({
    point: [0, 0],
    size: [CANVAS_W, CANVAS_H],
  })

  const swatch = container.clone()
  swatch.fillColor = swatchColor
  swatch.position.y += CANVAS_H - SWATCH_HEIGHT - BLEED
  swatch.sendToBack()

  const bg = container.clone()
  bg.fillColor = bgColor
  bg.sendToBack()

  drawBleed(CANVAS_W, CANVAS_H, BLEED)
}
