import paper from 'paper'
import {
  drawBleed,
  drawGraphsAndShells,
  drawZeroShells,
  getPoints,
  getRadius,
} from '../draw'
import { drawTerrain } from '../drawTerrain'
import { getAdvancedHue } from './r6_common'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const graphColor = '#333'
const graphThickness = 4
const shellGap = 36
const proximity = 150
const dotRadius = shellGap * 0.45

export const r6AdvancedFaceBack = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
  waves: boolean,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const max = 48
  const isInfinity = n >= total - 1
  if (isInfinity && n === total - 1) n = max - 1
  else if (isInfinity) n = max
  // n += 70

  const hue = getAdvancedHue(n, total)

  const shellColor = {
    hue: 0,
    saturation: 0,
    brightness: 0,
  }

  let swatchColor = {
    hue,
    saturation: 0.1,
    brightness: 1,
  }

  if (isInfinity) {
    swatchColor = {
      hue: 0,
      saturation: 0,
      brightness: 1,
    }
  }

  const x = canvasW / 2
  const y = canvasH / 3
  const center = new paper.Point(x, y)

  const container = new paper.Path.Rectangle({
    point: [0, 0],
    size: [canvasW, canvasH],
  })

  const swatch = container.clone()
  swatch.fillColor = swatchColor as paper.Color

  const radius = getRadius(proximity, n)
  const points = getPoints(center, radius, n)

  if (n === 0 && waves) {
    drawTerrain({
      width: canvasW,
      height: canvasH,
      seedCoords: [
        // bottom center
        [0.5 * canvasW, canvasH + 0.125 * canvasH],
      ],
      seedRadiusScale: shellGap * 2,
      seedRadiusMin: shellGap / 2,
      noiseRadius: 0.6,
      noiseCount: 60,
      ringCount: 100,
      strokeWidth: 1,
      strokeColor: shellColor as paper.Color,
      shellGap,
    })
  } else if (n === 0) {
    drawZeroShells({
      center: new paper.Point(center.x, center.y + 2),
      size: canvasH * 1.5,
      radius,
      shelln: 31,
      shellColor,
      shellGap,
      dashArray: [2, 3],
      shellThickness: 2,
    })
  }

  if (n > 0) {
    drawGraphsAndShells({
      container,
      center,
      proximity,
      radius,
      size: canvasH * 1.5,
      n,
      graphColor,
      shellColor,
      points,
      shelln: 31,
      shellGap,
      graphThickness: graphThickness,
      twoTouch: true,
      // dotRadius: shellGap / 2 + 2,
      // dotRadius: dotRadius + graphThickness,
      dotRadius: 3,
      dashArray: n > 2 ? [0.5, 4] : [2, 3],
      shellThickness: 2,
    })
  }

  // drawDots(points, graphColor, dotRadius)

  swatch.sendToBack()

  drawBleed(canvasW, canvasH, BLEED)
}
