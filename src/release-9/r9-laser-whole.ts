import paper from 'paper'
import {
  drawBleed,
  drawGraphsAndShells,
  drawOutline,
  drawZeroShells,
  getPoints,
  getRadius,
} from '../draw'
import { drawTerrain } from '../drawTerrain'
import { getAdvancedHue } from './r9-shared'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const graphColor = '#333'
const graphThickness = 4
const shellThickness = 2
const shellGap = 36
const proximity = 150
// const dotRadius = shellGap * 0.45
const dashArray: [number, number] = [0, 2.6]

export const r9LaserWhole = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
  waves: boolean,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const hue = getAdvancedHue(n, total)

  const shellColor = new paper.Color('white')

  const swatchColor = {
    hue,
    saturation: 0.42,
    brightness: 0.99,
  }

  const x = canvasW / 2
  const y = canvasH / 2
  const center = new paper.Point(x, y)

  const container = new paper.Path.Rectangle({
    point: [0, 0],
    size: [canvasW, canvasH],
  })

  const swatch = container.clone()
  swatch.fillColor = swatchColor as paper.Color

  const radius = getRadius(proximity, n)
  const points = getPoints(center, radius, n)

  drawOutline({
    points,
    strokeColor: 'transparent',
    strokeWidth: 0,
    fillColor: 'white',
  })

  if (waves && n === 0) {
    drawTerrain({
      width: canvasW,
      height: canvasH,
      seedCoords: [
        // bottom center
        [0.5 * canvasW, canvasH * 1.1],
        // [0.5 * canvasW, canvasH * 0.5],
      ],
      seedRadiusScale: shellGap * 2,
      seedRadiusMin: shellGap / 2,
      noiseRadius: 0.6,
      noiseCount: 60,
      ringCount: 100,
      strokeWidth: shellThickness,
      strokeColor: shellColor,
      shellGap,
      // omit: 1,
      // opacityScale: 10,
    })
  } else if (n === 0) {
    drawZeroShells({
      center: new paper.Point(center.x, center.y),
      size: canvasH * 1.5,
      radius,
      shelln: 31,
      shellColor,
      shellGap,
      dashArray,
      shellThickness,
    })
  }

  if (n > 0) {
    // const linesByLength = drawGraphsAndShells({
    drawGraphsAndShells({
      container,
      center,
      proximity,
      radius,
      size: canvasH * 1.5,
      n,
      graphColor,
      shellColor: 'transparent',
      points,
      shelln: 31,
      shellGap,
      graphThickness: graphThickness,
      twoTouch: true,
      dotRadius: 3,
      // dotRadius: shellGap / 2 + 4,
      // dotRadius: dotRadius - graphThickness,
      // dotRadius: dotRadius + 2,
      // dotRadius: 3,
      dashArray,
      shellThickness: 2,
    })
  }

  swatch.sendToBack()

  drawBleed(canvasW, canvasH, BLEED)
}
