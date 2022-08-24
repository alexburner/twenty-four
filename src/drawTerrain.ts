import paper from 'paper'
import { createNoise2D } from 'simplex-noise'

const noise2D = createNoise2D()

export const drawTerrain = ({
  width,
  height,
  seedCount,
  seedCoords,
  seedRadiusScale,
  seedRadiusMin,
  noiseRadius,
  noiseCount,
  ringCount,
  ringMax,
  strokeWidth,
  strokeColor,
  shellGap,
  dashArray,
}: {
  width: number
  height: number
  seedCount?: number
  seedCoords?: [number, number][]
  seedRadiusScale: number
  seedRadiusMin: number
  noiseRadius: number
  noiseCount: number
  ringCount?: number
  ringMax?: number
  strokeWidth: number
  strokeColor: paper.Color
  shellGap: number
  dashArray?: [number, number]
}): void => {
  const layers: paper.Path[][] = []

  if (!seedCoords) {
    seedCoords = new Array(seedCount).fill(null).map(() => {
      const x = Math.random() * width
      const y = Math.random() * height
      return [x, y]
    })
  }

  // Create random seeds and rings
  seedCoords.forEach((seedCoord) => {
    const stack = []

    const seedCenter = new paper.Point(seedCoord)
    const seed = createSeed({
      seedCenter,
      seedRadiusScale,
      seedRadiusMin,
      noiseRadius,
      noiseCount,
    })
    stack.push(seed)

    // Create rings
    if (!ringCount) {
      if (ringMax) {
        ringCount = Math.round(((1 + noise2D(...seedCoord)) / 2) * ringMax)
      } else {
        ringCount = 0
      }
    }
    let prevRing = seed
    for (let i = 0; i < ringCount; i++) {
      prevRing = createRing(prevRing, seedCenter, shellGap)
      stack.push(prevRing)
    }

    // Flip the stack and weave into layers
    stack.reverse()
    stack.forEach((path, index) => {
      if (layers[index]) {
        layers[index]?.push(path)
      } else {
        layers[index] = [path]
      }
    })
  })

  // Unite all the paths in each layer
  layers.forEach((paths) => {
    let union: paper.PathItem | undefined

    paths.forEach((path) => {
      if (union) {
        const old = union
        union = union.unite(path)
        old.remove()
        path.remove()
      } else {
        union = path
      }
    })

    // Style the union
    if (union) {
      union.strokeColor = strokeColor
      union.strokeWidth = strokeWidth
      if (dashArray) union.dashArray = dashArray
    }
  })
}

const createRing = (
  prevRing: paper.Path,
  center: paper.Point,
  shellGap: number,
): paper.Path => {
  const ringNoiseCoordScale = 0.002
  const ringNoiseLengthScale = shellGap * 0.65
  const ringNoiseLengthBase = shellGap * 0.1

  const segments = prevRing.segments.map((prevSegment) => {
    const segment = prevSegment.clone()
    const vector = segment.point.subtract(center)
    const noise = noise2D(
      vector.x * ringNoiseCoordScale,
      vector.y * ringNoiseCoordScale,
    )

    const jitter = noise * ringNoiseLengthScale + ringNoiseLengthBase
    vector.length = shellGap + jitter
    segment.point = segment.point.add(vector)
    return segment
  })

  const path = new paper.Path({
    segments,
    closed: true,
  })

  path.smooth()

  return path
}

const createSeed = (args: {
  seedCenter: paper.Point
  seedRadiusScale: number
  seedRadiusMin: number
  noiseRadius: number
  noiseCount: number
}): paper.Path => {
  const seedNoise2D = createNoise2D()
  const points = new Array(args.noiseCount).fill(null).map((_, i) => {
    // Walk 2D simplex noise in a circle
    // -> so that our randomness aligns beginning & end
    const angle = (360 / args.noiseCount) * i
    const [x, y] = getCircleXY(args.noiseRadius, angle)
    const pointRadius =
      positiveNoise(seedNoise2D(x, y)) * args.seedRadiusScale +
      args.seedRadiusMin

    // Use that noise to distance our seed point from center
    const point = new paper.Point(
      args.seedCenter.x,
      args.seedCenter.y + pointRadius,
    )
    return point.rotate(angle, args.seedCenter)
  })

  // Use those points to make a closed path
  const path = new paper.Path({
    segments: points,
    closed: true,
  })

  // Simplify the path points
  // http://paperjs.org/tutorials/paths/smoothing-simplifying-flattening/
  path.smooth()

  return path
}

const getCircleXY = (radius: number, angle: number): [number, number] => {
  const radians = (Math.PI * 2 * angle) / 360
  const x = radius * Math.sin(radians)
  const y = radius * Math.cos(radians)
  return [x, y]
}

/**
 * (-1, 1) -> (0, 1)
 */
const positiveNoise = (noise: number): number => (noise + 1) / 2
