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

  const path = drawTerrain({
    width: canvasW,
    height: canvasH,
    seedCount: 10,
    seedRadiusScale: 40,
    seedRadiusMin: 30,
    noiseRadius: 1,
    ringMax: 10,
    strokeWidth: 1,
    strokeColor,
  })

  console.log('path.position', path?.position)

  if (path) {
    console.log('path.position', path.position)
    const rect = new paper.Path.Rectangle(path.bounds.clone())
    rect.strokeWidth = 1
    rect.strokeColor = strokeColor
  }
}
