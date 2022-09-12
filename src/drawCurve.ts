import paper from 'paper'
import { createNoise2D } from 'simplex-noise'
import { getCircleXY } from './util'

export const drawWave = (args: {
  width: number
  originY: number
  waveCount: number
  waveScale: number
  noisePoints: number
  noiseRadius: number
  shellGap: number
  strokeWidth: number
  strokeColor: paper.Color
  dashArray?: [number, number]
}): void => {
  const seedNoise2D = createNoise2D()
  const curvePoints = new Array(args.noisePoints + 1).fill(null).map((_, i) => {
    // Walk 2D simplex noise in a circle
    // -> so that our randomness aligns beginning & end
    const angle = (360 / args.noisePoints) * i
    const [x, y] = getCircleXY(args.noiseRadius, angle)
    const noiseY = seedNoise2D(x, y) * args.waveScale
    const waveY = noiseY + args.originY
    const waveX = (args.width / args.noisePoints) * i
    return new paper.Point(waveX, waveY)
  })

  const curvePath = new paper.Path({
    segments: curvePoints,
  })

  // for (let i = 0; i < args.waveCount; i++) {

  // }

  curvePath.smooth()
  curvePath.strokeColor = args.strokeColor
  curvePath.strokeWidth = args.strokeWidth
  if (args.dashArray) curvePath.dashArray = args.dashArray
}
