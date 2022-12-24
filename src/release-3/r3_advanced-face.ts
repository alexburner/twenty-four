import paper from 'paper'
import {
  drawBleed,
  drawDots,
  drawGraphsAndShells,
  drawZeroShells,
  getPoints,
  getRadius,
} from '../draw'
import { getAdvancedHue } from './r3_common'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const graphColor = '#333'
const graphThickness = 3
const shellGap = 36
const proximity = 140

export const r3AdvancedFace = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const hue = getAdvancedHue(n, total)

  const isInfinity = n === total
  if (isInfinity) n = 1

  let shellColor = {
    hue,
    saturation: 0.59,
    brightness: 0.89,
  }

  let swatchColor = {
    hue,
    saturation: 0.075,
    brightness: 1,
  }

  // const fixedN = isInfinity ? total : n
  // const rybHue = ((360 * ((fixedN - 1) / (total - 0))) % 360) - 0
  // swatchColor = getRYB(0, 0, rybHue, 1, 0.15) as unknown as paper.Color

  if (isInfinity) {
    shellColor = {
      hue: 0,
      saturation: 0,
      brightness: 0.79,
    }
    swatchColor = {
      hue: 0,
      saturation: 0,
      brightness: 1,
    }
  }

  const x = canvasW / 2
  const y = x
  const center = new paper.Point(x, y)

  const container = new paper.Path.Rectangle({
    point: [0, 0],
    size: [canvasW, canvasH],
  })

  const swatch = container.clone()
  swatch.fillColor = swatchColor as paper.Color

  const radius = getRadius(proximity, n)
  const points = getPoints(center, radius, n)

  const infinityRadius = getRadius(proximity, 12)

  if (n === 0) {
    drawZeroShells({
      center,
      size: canvasH * 1.5,
      radius,
      shelln: 31,
      shellColor,
      shellThickness: 1,
      shellGap,
    })
  }

  const dotRadius = graphThickness * 7

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
      graphThickness,
      twoTouch: true,
      dotRadius:
        n === 1
          ? isInfinity
            ? infinityRadius - dotRadius * 0.75
            : dotRadius - graphThickness * 2
          : dotRadius,
    })
  }

  if (isInfinity) {
    new paper.Path.Circle({
      center,
      radius: infinityRadius,
      strokeColor: graphColor,
      strokeWidth: dotRadius * 2,
    })

    const gap = graphThickness * 2
    const interiorRadius = infinityRadius - dotRadius - graphThickness
    const count = Math.ceil(interiorRadius / gap)
    for (let i = 0; i < count; i++) {
      new paper.Path.Circle({
        center,
        radius: interiorRadius - gap * i,
        strokeColor: graphColor,
        strokeWidth: graphThickness,
      })
    }
  } else {
    drawDots(points, graphColor, dotRadius)
  }

  let fontSize = 100
  if (isInfinity) fontSize = 110
  const textPoint: [number, number] = [
    canvasW / 2,
    canvasH - canvasW / 2.5 + fontSize / 3,
  ]
  new paper.PointText({
    point: textPoint,
    content: isInfinity ? '∞' : n,
    justification: 'center',
    fillColor: graphColor,
    fontFamily: isInfinity ? 'Noto Serif JP' : 'Futura-Light',
    fontSize,
    opacity: 0.9,
  })

  swatch.sendToBack()

  drawBleed(canvasW, canvasH, BLEED)
}
