import paper from 'paper'
import { createNoise2D } from 'simplex-noise'

export const drawTerrain = ({
  width,
  height,
  seedCount,
  seedRadiusScale,
  seedRadiusMin,
  noiseRadius,
  // ringMax,
  strokeWidth,
  strokeColor,
}: {
  width: number
  height: number
  seedCount: number
  seedRadiusScale: number
  seedRadiusMin: number
  noiseRadius: number
  ringMax: number
  strokeWidth: number
  strokeColor: paper.Color
}): paper.PathItem | undefined => {
  // const noise2D = createNoise2D()
  const paths: paper.Path[] = []

  // Create random seeds and rings
  for (let i = 0; i < seedCount; i++) {
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
    })
    paths.push(seed)

    // Create rings
    // const ringCount = Math.round(((1 + noise2D(x, y)) / 2) * ringMax)
    // let prevRing = seed
    // for (let j = 0; j < ringCount; j++) {
    //   prevRing = createRing(prevRing)
    //   paths.push(prevRing)
    // }
  }

  // Unite all the paths
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

  return union
}

// const createRing = (seed: paper.Path): paper.Path => {
//   seed.segments.forEach(segment => {
//     segment.handleIn
//   })
// }

const createSeed = (args: {
  seedCenter: paper.Point
  seedRadiusScale: number
  seedRadiusMin: number
  noiseRadius: number
}): paper.Path => {
  const noise2D = createNoise2D()
  const pointCount = 100
  const points = new Array(pointCount).fill(null).map((_, i) => {
    // Walk 2D simplex noise in a circle
    // -> so that our randomness aligns beginning & end
    const angle = (360 / pointCount) * i
    const [x, y] = getCircleXY(args.noiseRadius, angle)
    const pointRadius =
      ((1 + noise2D(x, y)) / 2) * args.seedRadiusScale + args.seedRadiusMin
    console.log('pointRadius', pointRadius)

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

  console.log('created path')

  // Simplify the path points
  // http://paperjs.org/tutorials/paths/smoothing-simplifying-flattening/
  path.simplify()

  return path
}

const getCircleXY = (radius: number, angle: number): [number, number] => {
  const radians = (Math.PI * 2 * angle) / 360
  const x = radius * Math.sin(radians)
  const y = radius * Math.cos(radians)
  return [x, y]
}
