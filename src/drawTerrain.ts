import paper from 'paper'
import { createNoise2D } from 'simplex-noise'

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
}): void => {
  const noise2D = createNoise2D()
  const layers: paper.Path[][] = []

  // Create random seeds and rings
  for (let i = 0; i < seedCount; i++) {
    const stack = []

    // Create seed
    const x = Math.random() * width
    const y = Math.random() * height
    const seedCenter = new paper.Point(x, y)
    console.log('seedCenter', seedCenter)
    const seed = createSeed({
      seedCenter,
      seedRadiusScale,
      seedRadiusMin,
      noiseRadius,
      noiseCount,
    })
    stack.push(seed)

    // Create rings
    const ringCount = Math.round(((1 + noise2D(x, y)) / 2) * ringMax)
    let prevRing = seed
    for (let j = 0; j < ringCount; j++) {
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
    }
  })
}

const createRing = (
  prevRing: paper.Path,
  center: paper.Point,
  shellGap: number,
): paper.Path => {
  const segments = prevRing.segments.map((prevSegment) => {
    const segment = prevSegment.clone()
    const vector = segment.point.subtract(center)
    vector.length = shellGap
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
  const noise2D = createNoise2D()
  const points = new Array(args.noiseCount).fill(null).map((_, i) => {
    // Walk 2D simplex noise in a circle
    // -> so that our randomness aligns beginning & end
    const angle = (360 / args.noiseCount) * i
    const [x, y] = getCircleXY(args.noiseRadius, angle)
    const pointRadius =
      ((1 + noise2D(x, y)) / 2) * args.seedRadiusScale + args.seedRadiusMin

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
