import paper from 'paper'
import { bgColor } from './constants'

export const drawBleed = (
  width: number,
  height: number,
  bleed: number,
): void => {
  // return

  const color = new paper.Color(bgColor)
  color.brightness = 0.93

  const outline = new paper.Shape.Rectangle({
    point: [bleed / 2, bleed / 2],
    size: [width - bleed, height - bleed],
  })

  outline.strokeWidth = bleed
  outline.strokeColor = color
  outline.strokeCap = 'round'
  outline.strokeJoin = 'round'
  outline.radius = 80
  outline.bringToFront()
}

export const drawBleedRound = (
  center: paper.Point,
  radius: number,
  bleed: number,
): void => {
  // return

  const color = new paper.Color(bgColor)
  color.brightness = 0.93

  const outline = new paper.Shape.Circle({ center, radius })

  outline.strokeWidth = bleed * 2
  outline.strokeColor = color
  outline.strokeCap = 'round'
  outline.strokeJoin = 'round'
  outline.bringToFront()
}

type PaperColor = Partial<paper.Color>

export const getRadius = (proximity: number, n: number): number => {
  const angle = (2 * Math.PI) / n
  const radius = proximity / 2 / Math.sin(angle / 2)
  return radius
}

export const getPoints = (
  center: paper.Point,
  radius: number,
  n: number,
): paper.Point[] => {
  if (n === 0) return []
  if (n === 1) return [center]

  const vector = new paper.Point(center)
  vector.length = radius
  vector.angle = -90

  const points = new Array(n).fill(null).map(() => {
    const point = center.add(vector)
    vector.angle += 360 / n
    return point
  })

  return points
}

export const drawDots = (
  points: paper.Point[],
  dotColor: PaperColor,
  dotRadius: number,
): paper.Group => {
  const dots = points.map(
    (point) =>
      new paper.Path.Circle({
        fillColor: dotColor,
        center: point,
        radius: dotRadius,
      }),
  )
  return new paper.Group(dots)
}

export const drawOutline = ({
  points,
  strokeColor,
  strokeWidth = 2,
  fillColor,
}: {
  points: paper.Point[]
  strokeColor: PaperColor
  strokeWidth?: number
  fillColor?: PaperColor
}): paper.Path | undefined => {
  const path = new paper.Path(points)

  path.closed = true
  path.strokeCap = 'round'
  path.strokeJoin = 'round'
  path.strokeColor = strokeColor as paper.Color
  path.strokeWidth = strokeWidth
  if (fillColor) path.fillColor = fillColor as paper.Color

  return path
}

export const drawGraphsAndShells = ({
  container,
  center,
  proximity,
  radius,
  size,
  n,
  graphColor,
  shellColor,
  points,
  shelln = 20,
  shellGap = 36,
  shellThickness = 1,
  graphThickness = 2,
  twoTouch = false,
  dotRadius,
  dashArray,
}: {
  container: paper.Path
  center: paper.Point
  proximity: number
  radius: number
  size: number
  n: number
  graphColor: PaperColor
  shellColor: PaperColor
  points: paper.Point[]
  shelln?: number
  shellGap?: number
  shellThickness?: number
  graphThickness?: number
  twoTouch?: boolean
  dotRadius?: number
  dashArray?: [number, number]
}): void => {
  // 0 has nothing
  if (n < 1) {
    return
  }

  // 1 only a point
  if (n < 2) {
    drawOne({
      center,
      shelln,
      shellColor,
      shellThickness,
      shellGap,
      graphColor,
      graphThickness,
      container,
      dotRadius,
      dashArray,
    })
    return
  }

  const lines = []
  const lineExists: Record<string, boolean> = {}
  const linesByLength: Record<string, paper.Path.Line[]> = {}
  points.forEach(function (pointA, indexA) {
    const coordsA = pointA.toString()
    points.forEach(function (pointB, indexB) {
      if (indexA === indexB) return
      const coordsB = pointB.toString()
      if (lineExists[coordsA + coordsB]) return
      if (lineExists[coordsB + coordsA]) return
      lineExists[coordsA + coordsB] = true

      const lineLength = pointA.subtract(pointB).length
      const lineLengthStr = lineLength.toFixed(2)

      const line = new paper.Path.Line({
        from: pointA,
        to: pointB,
        strokeCap: 'round',
        strokeJoin: 'round',
        strokeColor: graphColor,
        strokeWidth: graphThickness,
      })

      lines.push(line)

      const theseLines = linesByLength[lineLengthStr] ?? []
      theseLines.push(line)
      linesByLength[lineLengthStr] = theseLines
    })
  })

  // special field for 2
  if (n === 2) {
    drawTwo({
      center,
      size,
      radius,
      shelln,
      shellColor,
      shellThickness,
      shellGap,
      container,
      twoTouch,
      dashArray,
    })
    return
  }

  drawN({
    center,
    shelln,
    shellColor,
    shellThickness,
    shellGap,
    container,
    linesByLength,
    radius,
    proximity,
    dashArray,
  })
}

const drawOne = ({
  center,
  shelln,
  shellColor,
  shellThickness,
  shellGap,
  // graphColor,
  // graphThickness,
  container,
  dotRadius,
  dashArray,
}: {
  center: paper.Point
  shelln: number
  shellColor: PaperColor
  shellThickness: number
  shellGap: number
  graphColor: PaperColor
  graphThickness: number
  container: paper.Path
  dotRadius?: number
  dashArray?: [number, number]
}): void => {
  // point
  // new paper.Path.Circle({
  //   center: center,
  //   radius: graphThickness,
  //   fillColor: graphColor,
  // })
  // and rings
  const rings = []
  for (let i = 0; i < shelln; i++) {
    rings.push(
      new paper.Path.Circle({
        center: center,
        radius: (i + 1) * shellGap + (dotRadius ?? 0),
        strokeWidth: shellThickness,
        strokeColor: shellColor,
        dashArray,
      }),
    )
  }
  rings.unshift(container)
  new paper.Group(rings).clipped = true
}

const drawTwo = ({
  center,
  size,
  radius,
  shelln,
  shellColor,
  shellThickness,
  shellGap,
  container,
  twoTouch,
  dashArray,
}: {
  center: paper.Point
  size: number
  radius: number
  shelln: number
  shellColor: PaperColor
  shellThickness: number
  shellGap: number
  container: paper.Path
  twoTouch: boolean
  dashArray?: [number, number]
}): void => {
  const rays = []
  const touchGap = twoTouch ? 0 : shellGap
  rays.push(
    new paper.Path.Line({
      from: [center.x, center.y - size / 2],
      to: [center.x, center.y - radius - touchGap],
      strokeColor: shellColor,
      strokeWidth: shellThickness,
      dashArray,
    }),
  )
  rays.push(
    new paper.Path.Line({
      from: [center.x, center.y + radius + touchGap],
      to: [center.x, center.y + size / 2],
      strokeColor: shellColor,
      strokeWidth: shellThickness,
      dashArray,
    }),
  )
  for (let i = 0; i < shelln; i++) {
    rays.push(
      new paper.Path.Line({
        from: [center.x - (i + 1) * shellGap, center.y - size / 2],
        to: [center.x - (i + 1) * shellGap, center.y + size / 2],
        strokeColor: shellColor,
        strokeWidth: shellThickness,
        dashArray,
      }),
    )
    rays.push(
      new paper.Path.Line({
        from: [center.x + (i + 1) * shellGap, center.y - size / 2],
        to: [center.x + (i + 1) * shellGap, center.y + size / 2],
        strokeColor: shellColor,
        strokeWidth: shellThickness,
        dashArray,
      }),
    )
  }
  rays.unshift(container)
  const rayGroup = new paper.Group(rays)
  rayGroup.clipped = true
  rayGroup.sendToBack()
}

const drawN = ({
  center,
  shelln,
  shellColor,
  shellThickness,
  shellGap,
  container,
  linesByLength,
  radius,
  proximity,
  dashArray,
}: {
  center: paper.Point
  shelln: number
  shellColor: PaperColor
  shellThickness: number
  shellGap: number
  container: paper.Path
  linesByLength: Record<string, paper.Path.Line[]>
  radius: number
  proximity: number
  dashArray?: [number, number]
}): void => {
  const shortestLength = Object.keys(linesByLength).sort(
    (a, b) => Number(a) - Number(b),
  )[0]
  if (!shortestLength) return
  const shortestLines = linesByLength[shortestLength]
  const baseShell = new paper.Group(shortestLines)
  const baseRadius = getMinRadius(radius, proximity)
  const shells = []
  for (let i = 0; i < shelln; i++) {
    const shell = baseShell.clone()
    const shellRadius = baseRadius + (i + 1) * shellGap
    const shellScale = shellRadius / baseRadius
    shell.scale(shellScale, center)
    shell.strokeWidth = shellThickness
    shell.strokeColor = shellColor as paper.Color
    if (dashArray) shell.dashArray = dashArray
    shells.push(shell)
  }
  shells.unshift(container)
  new paper.Group(shells).clipped = true
}

const getMinRadius = (radius: number, length: number): number => {
  return Math.sqrt(Math.pow(radius, 2) - Math.pow(length / 2, 2))
}

type LinesByLength = Record<string, paper.Path.Line[]>

export const drawLines = (x: {
  points: paper.Point[]
  strokeColor: paper.Color
  strokeWidth: number
}): LinesByLength => {
  const lines = []
  const lineExists: Record<string, boolean> = {}
  const linesByLength: LinesByLength = {}

  if (x.points.length < 2) return {}

  x.points.forEach(function (pointA, indexA) {
    const coordsA = pointA.toString()
    x.points.forEach(function (pointB, indexB) {
      if (indexA === indexB) return
      const coordsB = pointB.toString()
      if (lineExists[coordsA + coordsB]) return
      if (lineExists[coordsB + coordsA]) return
      lineExists[coordsA + coordsB] = true

      const lineLength = pointA.subtract(pointB).length
      const lineLengthStr = lineLength.toFixed(2)

      const line = new paper.Path.Line({
        from: pointA,
        to: pointB,
        strokeCap: 'round',
        strokeJoin: 'round',
        strokeColor: x.strokeColor,
        strokeWidth: x.strokeWidth,
      })

      lines.push(line)

      const theseLines = linesByLength[lineLengthStr] ?? []
      theseLines.push(line)
      linesByLength[lineLengthStr] = theseLines
    })
  })

  return linesByLength
}

export const spreadLines = (x: {
  linesByLength: LinesByLength
  distance: number
}): paper.Group => {
  const lengths = Object.keys(x.linesByLength)
  lengths.sort((a, b) => Number(a) - Number(b))

  const groups = lengths.map((length) => {
    const lines = x.linesByLength[length]
    if (!lines) throw new Error('Unreachable')
    return new paper.Group(lines)
  })

  groups.forEach((group, i) => {
    group.position.y += x.distance * i
  })

  return new paper.Group(groups)
}
