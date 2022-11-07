import paper from 'paper'
import { createNoise2D } from 'simplex-noise'
import { positiveNoise } from './util'

export const drawPerlin = (): void => {
  const walkPointCount = 15
  const walkLength = 100
  const noiseScale = 0.75
  const width = 500
  const height = 500
  const targetHeight = 100
  const strokeColor = '#333' as unknown as paper.Color
  const strokeWidth = 2

  /**
   * Core walk path
   */

  const startPoint = new paper.Point(0, height / 2)
  const walkNoise = createNoise2D()
  const walkPath = new paper.Path()

  let currentPoint = startPoint.clone()
  walkPath.add(currentPoint)
  new Array(walkPointCount - 1).fill(null).forEach(() => {
    const noise =
      positiveNoise(walkNoise(currentPoint.x, currentPoint.y)) * noiseScale
    const angle = noise * 360
    const vector = currentPoint.clone()
    vector.angle = angle
    vector.length = walkLength
    currentPoint = currentPoint.add(vector)
    walkPath.add(currentPoint.clone())
  })

  walkPath.smooth()
  walkPath.simplify()

  {
    // Measure the overall vector of our path
    const firstSegment = walkPath.segments[0]
    const lastSegment = walkPath.segments[walkPath.segments.length - 1]
    if (!firstSegment || !lastSegment) throw new Error('Unreachable')
    const pathVector = lastSegment.point.subtract(firstSegment.point)

    // Cancel out any path rotation (make it flat)
    walkPath.rotate(-pathVector.angle, startPoint)

    // Scale path to match overall width
    const pathWidth = pathVector.length
    const widthScale = width / pathWidth
    walkPath.scale(widthScale, 1, startPoint)

    // Scale path to fit desired height
    const pathHeight = walkPath.bounds.height
    const heightScale = targetHeight / pathHeight
    walkPath.scale(1, heightScale, startPoint)
  }

  walkPath.strokeColor = strokeColor
  walkPath.strokeWidth = strokeWidth

  /**
   * Walk path shells
   */

  // const shellCount = 100
  // new Array(shellCount).fill(null).forEach(() => {})
}
