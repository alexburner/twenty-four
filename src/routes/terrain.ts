import paper from 'paper'
import { drawTerrain } from '../drawTerrain'

const BLEED = 36
const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const strokeColor = {
  hue: 0,
  saturation: 0,
  brightness: 0,
} as paper.Color

export const terrain = (canvas: HTMLCanvasElement): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  drawTerrain({
    width: canvasW,
    height: canvasH,
    seedCount: 20,
    seedRadiusScale: 50,
    seedRadiusMin: 10,
    noiseRadius: 1.2,
    noiseCount: 30,
    ringMax: 15,
    strokeWidth: 1,
    strokeColor,
    shellGap: 40,
  })
}
