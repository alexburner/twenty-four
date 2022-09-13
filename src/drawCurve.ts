import paper from 'paper'
import { createNoise2D } from 'simplex-noise'
import { getCircleXY } from './util'

const waveNoise2D = createNoise2D()

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

  const allPaths: paper.Path[] = []

  const curvePath = new paper.Path({ segments: curvePoints })
  curvePath.smooth()

  allPaths.push(curvePath)

  let prevUpper = curvePath
  let prevLower = curvePath
  for (let i = 0; i < args.waveCount; i++) {
    const nextUpper = createWave(prevUpper, 1, args.shellGap)
    const nextLower = createWave(prevLower, -1, args.shellGap)
    allPaths.push(nextUpper)
    allPaths.push(nextLower)
    prevUpper = nextUpper
    prevLower = nextLower
  }

  allPaths.forEach((path) => {
    path.smooth()
    path.strokeColor = args.strokeColor
    path.strokeWidth = args.strokeWidth
    if (args.dashArray) path.dashArray = args.dashArray
  })
}

const createWave = (
  prevWave: paper.Path,
  polarity: 1 | -1,
  shellGap: number,
): paper.Path => {
  const waveNoiseCoordScale = 0.002
  const waveNoiseLengthScale = shellGap * 0.65
  const waveNoiseLengthBase = shellGap * 0.1

  const segments = prevWave.segments.map((prevSegment) => {
    const segment = prevSegment.clone()
    const noise = waveNoise2D(
      segment.point.x * waveNoiseCoordScale,
      segment.point.y * waveNoiseCoordScale,
    )
    const jitter = noise * waveNoiseLengthScale + waveNoiseLengthBase
    const length = shellGap + jitter
    segment.point.y += length * polarity
    return segment
  })

  const path = new paper.Path({ segments })

  path.smooth()

  return path
}
