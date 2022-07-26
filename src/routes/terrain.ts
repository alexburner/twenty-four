import paper from 'paper'
import { drawTerrain } from '../drawTerrain'

const BLEED = 36
const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

export const terrain = (canvas: HTMLCanvasElement): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const hue = ((360 * ((1 - 1) / (12 + 1))) % 360) + 0

  const shellColor = {
    hue,
    saturation: 1,
    brightness: 0.9,
  }

  const swatchColor = {
    hue,
    saturation: 0.1,
    brightness: 1,
  }

  const swatch = new paper.Path.Rectangle({
    point: [0, 0],
    size: [canvasW, canvasH],
  })

  swatch.fillColor = swatchColor as paper.Color

  const shellGap = 36

  drawTerrain({
    width: canvasW,
    height: canvasH,
    seedCount: 30,
    seedRadiusScale: 20,
    seedRadiusMin: shellGap / 2,
    noiseRadius: 0.5,
    noiseCount: 30,
    ringMax: 20,
    strokeWidth: 1,
    strokeColor: shellColor as paper.Color,
    shellGap,
  })
}
