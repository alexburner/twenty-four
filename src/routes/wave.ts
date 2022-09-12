import paper from 'paper'
import { drawWave } from '../drawCurve'

const BLEED = 36
const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

export const wave = (canvas: HTMLCanvasElement): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const swatch = new paper.Path.Rectangle({
    point: [0, 0],
    size: [canvasW, canvasH],
  })

  swatch.fillColor = '#FFF' as unknown as paper.Color

  const shellGap = 36

  drawWave({
    width: canvasW,
    originY: canvasW / 2,
    waveCount: 30,
    waveScale: shellGap * 4,
    noisePoints: 60,
    noiseRadius: 0.5,
    shellGap,
    strokeWidth: 1,
    strokeColor: '#333' as unknown as paper.Color,
  })
}
