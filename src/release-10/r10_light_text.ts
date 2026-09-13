import paper from 'paper'
import { drawBleed } from '../draw'
import { getAdvancedHue, GIANT_LIMIT } from './r10_common'

const BLEED = 36
const visWidth = 300 * 2.75
const visHeight = 300 * 4.75
const canvasW = visWidth + BLEED * 2
const canvasH = visHeight + BLEED * 2

const SWATCH_HEIGHT = visHeight * 0.088

export const r10LightText = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
  _waves: boolean,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const bgColor = new paper.Color({
    hue: 0,
    saturation: 0,
    brightness: 1,
  })

  const swatchColor = new paper.Color(
    n < GIANT_LIMIT
      ? {
          hue: getAdvancedHue(n, total),
          saturation: 0.42,
          brightness: 0.99,
        }
      : {
          hue: 0,
          saturation: 0,
          brightness: 1,
        },
  )

  const container = new paper.Path.Rectangle({
    point: [0, 0],
    size: [canvasW, canvasH],
  })

  const swatch = container.clone()
  swatch.fillColor = swatchColor
  swatch.position.y += canvasH - SWATCH_HEIGHT - BLEED
  swatch.sendToBack()

  const bg = container.clone()
  bg.fillColor = bgColor
  bg.sendToBack()

  drawBleed(canvasW, canvasH, BLEED)
}
