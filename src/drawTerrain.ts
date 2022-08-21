import paper from 'paper'
import { createNoise2D } from 'simplex-noise'

const noise2D = createNoise2D()

export const drawTerrain = ({
  width,
  height,
  seedCount,
  seedRadiusScale,
  seedRadiusMin,
  noiseRadius,
  noiseCount,
  ringMax,
  strokeWidth,
  strokeColor,
  shellGap,
  voidWidth,
  voidHeight,
  dashArray,
}: {
  width: number
  height: number
  seedCount: number
  seedRadiusScale: number
  seedRadiusMin: number
  noiseRadius: number
  noiseCount: number
  ringMax: number
  strokeWidth: number
  strokeColor: paper.Color
  shellGap: number
  voidWidth?: number
  voidHeight?: number
  dashArray?: [number, number]
}): void => {
  // const noise2D = createNoise2D()
  const layers: paper.Path[][] = []

  const voidBounds =
    voidWidth && voidHeight
      ? {
          xMin: (width - voidWidth) / 2,
          xMax: (width - voidWidth) / 2 + voidWidth,
          yMin: (height - voidHeight) / 2,
          yMax: (height - voidHeight) / 2 + voidHeight,
        }
      : undefined

  const seedSpots = [
    // one
    [-0.1, 1 / 2],
    // one bottom
    // [0.5, 1.2],
    // two
    // [-0.2, 1 / 3],
    // [1.2, 2 / 3],
    // two vert
    // [0.5, -0.5],
    // [0.5, 1.1],
    // three
    // [-0.2, 1 / 4],
    // [1.2, 2 / 4],
    // [-0.2, 3 / 4],
  ] as const

  // Create random seeds and rings
  for (let i = 0; i < seedCount; i++) {
    const stack = []

    // Create seed
    const x = Math.random() * width
    const y = Math.random() * height
    if (voidBounds) {
      // don't fall into the void
      if (x > voidBounds.xMin && x < voidBounds.xMax) continue
      if (y > voidBounds.yMin && y < voidBounds.yMax) continue
    }
    let seedCenter = new paper.Point(x, y)

    const seedSpot = seedSpots[i]
    seedCenter = seedSpot
      ? new paper.Point(width * seedSpot[0], height * seedSpot[1])
      : seedCenter

    const seed = createSeed({
      seedCenter,
      seedRadiusScale,
      seedRadiusMin,
      noiseRadius,
      noiseCount,
    })
    stack.push(seed)

    // Create rings
    // const ringCount = Math.round(((1 + noise2D(x, y)) / 2) * ringMax)
    const ringCount = ringMax
    let prevRing = seed
    for (let j = 0; j < ringCount; j++) {
      prevRing = createRing(
        prevRing,
        seedCenter,
        // j === 0 ? shellGap * (2 / 3) : shellGap,
        shellGap,
      )
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
  }

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
