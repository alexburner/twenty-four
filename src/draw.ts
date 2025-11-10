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

  const mask = new paper.Shape.Rectangle({
    point: [bleed / 2, bleed / 2],
    size: [width - bleed, height - bleed],
  })
  mask.strokeWidth = bleed
  mask.strokeColor = color
  mask.strokeCap = 'round'
  mask.strokeJoin = 'round'
  mask.radius = 80
  mask.bringToFront()

  const safety = new paper.Shape.Rectangle({
    point: [bleed * 2, bleed * 2],
    size: [width - bleed * 4, height - bleed * 4],
  })
  safety.strokeWidth = 1
  // safety.strokeColor = new paper.Color('red')
  safety.strokeCap = 'round'
  safety.strokeJoin = 'round'
  safety.radius = 40
  safety.bringToFront()
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

export const getProximity = (radius: number, n: number): number => {
  const angle = (2 * Math.PI) / n
  const proximity = radius * Math.sin(angle / 2) * 2
  return proximity
}

export const getApprox = (value: number, roughness: number): number =>
  Math.round(value * roughness) / roughness

export const getPoints = (
  center: paper.Point,
  radius: number,
  n: number,
  honest1?: boolean,
  evenGravity?: boolean,
): paper.Point[] => {
  if (n === 0) return []
  if (n === 1 && !honest1) return [center.clone()]
  if (n === 1 && honest1) {
    return [new paper.Point([center.x, center.y - radius])]
  }

  const vector = new paper.Point(center)
  vector.length = radius
  vector.angle = -90

  const angleDelta = 360 / n

  if (evenGravity && n % 2 === 0) vector.angle += angleDelta / 2

  const points = new Array(n).fill(null).map(() => {
    const point = center.add(vector)
    vector.angle += angleDelta
    return point
  })

  return points
}

export const drawDots = (
  points: paper.Point[],
  fillColor: PaperColor,
  radius: number,
  strokeColor?: PaperColor,
  strokeWidth?: number,
  dashArray?: [number, number],
): paper.Group => {
  const dots = points.map(
    (center) =>
      new paper.Path.Circle({
        center,
        radius,
        fillColor,
        strokeColor,
        strokeWidth,
        dashArray,
        strokeCap: 'round',
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
}): paper.Path => {
  const path = new paper.Path(points)

  path.closed = true
  path.strokeCap = 'round'
  path.strokeJoin = 'round'
  path.strokeColor = strokeColor as paper.Color
  path.strokeWidth = strokeWidth
  if (fillColor) path.fillColor = fillColor as paper.Color

  return path
}

export const drawInnerOutline = ({
  points,
  strokeColor,
  strokeWidth = 2,
  fillColor,
  skip,
  log = false,
  start = 0,
  visited = new Set(),
  group = new paper.Group(),
}: {
  points: paper.Point[]
  strokeColor: PaperColor
  strokeWidth?: number
  fillColor?: PaperColor
  skip: number
  log?: boolean
  start?: number
  visited?: Set<number>
  group?: paper.Group
}): paper.Group => {
  let currPath = new paper.Path()
  const paths = [currPath]

  if (log) console.log(`[${skip}]`)
  console.log(start)
  console.log(visited)

  let offset = 0

  for (let i = start, l = points.length; i < l; i++) {
    const currIndex = ((i * skip) % l) + offset
    // const nextIndex = (((i + 1) * skip) % l) + offset

    if (visited.has(currIndex)) {
      // increase offset & rewind
      offset += 1
      i -= 1
      currPath = new paper.Path()
      paths.push(currPath)
      continue
    } else {
      visited.add(currIndex)
    }

    if (log) console.log(i, currIndex)

    const curr = points[currIndex]
    if (curr) currPath.add(curr)
    // const next = points[nextIndex]
    // if (curr && next && log) {
    //   group.addChild(
    //     new paper.Path({
    //       segments: [curr, next],
    //       strokeColor: 'red',
    //       strokeWidth: 5,
    //       opacity: 1 - 0.5 * offset,
    //     }),
    //   )
    // }
  }
  paths.forEach((path) => {
    path.closed = true
    path.strokeCap = 'round'
    path.strokeJoin = 'round'
    path.strokeColor = strokeColor as paper.Color
    path.strokeWidth = strokeWidth
    if (fillColor) path.fillColor = fillColor as paper.Color
    group.addChild(path)
  })
  return group
}

export const drawGraphsAndShells = ({
  container,
  center,
  // proximity,
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
  evenGravity = false,
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
  evenGravity?: boolean
}): Record<string, paper.Path.Line[]> => {
  // 0 has nothing
  if (n < 1) {
    return {}
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
    return {}
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
      evenGravity,
    })
  } else {
    drawN({
      center,
      shelln,
      shellColor,
      shellThickness,
      shellGap,
      container,
      linesByLength,
      dashArray,
      points,
    })
  }

  return linesByLength
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
        radius: (i + 0) * shellGap + (dotRadius ?? 0),
        strokeWidth: shellThickness,
        strokeColor: shellColor,
        strokeCap: 'round',
        strokeJoin: 'round',
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
  evenGravity,
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
  evenGravity: boolean
}): void => {
  const rays = []
  const touchGap = twoTouch ? 0 : shellGap
  rays.push(
    new paper.Path.Line({
      from: [center.x, center.y - size / 2],
      to: [center.x, center.y - radius - touchGap],
      strokeColor: shellColor,
      strokeWidth: shellThickness,
      strokeCap: 'round',
      strokeJoin: 'round',
      dashArray,
    }),
  )
  rays.push(
    new paper.Path.Line({
      from: [center.x, center.y + radius + touchGap],
      to: [center.x, center.y + size / 2],
      strokeColor: shellColor,
      strokeWidth: shellThickness,
      strokeCap: 'round',
      strokeJoin: 'round',
      dashArray,
    }),
  )
  if (evenGravity) shelln *= 2
  for (let i = 0; i < shelln; i++) {
    rays.push(
      new paper.Path.Line({
        from: [center.x - (i + 1) * shellGap, center.y - size / 2],
        to: [center.x - (i + 1) * shellGap, center.y + size / 2],
        strokeColor: shellColor,
        strokeWidth: shellThickness,
        strokeCap: 'round',
        strokeJoin: 'round',
        dashArray,
      }),
    )
    rays.push(
      new paper.Path.Line({
        from: [center.x + (i + 1) * shellGap, center.y - size / 2],
        to: [center.x + (i + 1) * shellGap, center.y + size / 2],
        strokeColor: shellColor,
        strokeWidth: shellThickness,
        strokeCap: 'round',
        strokeJoin: 'round',
        dashArray,
      }),
    )
  }
  rays.unshift(container)
  const rayGroup = new paper.Group(rays)
  if (!evenGravity) rayGroup.clipped = true
  if (evenGravity) rayGroup.rotate(90, center)
  rayGroup.sendToBack()
}

const drawN = ({
  center,
  points,
  shelln,
  shellColor,
  shellThickness,
  shellGap,
  container,
  linesByLength,
  dashArray,
}: {
  center: paper.Point
  points: paper.Point[]
  shelln: number
  shellColor: PaperColor
  shellThickness: number
  shellGap: number
  container: paper.Path
  linesByLength: Record<string, paper.Path.Line[]>
  dashArray?: [number, number]
}): void => {
  // base shell (based on shortest-edge shape)
  const shortestLength = Object.keys(linesByLength).sort(
    (a, b) => Number(a) - Number(b),
  )[0]
  if (!shortestLength) return
  const shortestLines = linesByLength[shortestLength]
  const baseShell = new paper.Group(shortestLines)

  // base radius
  const pointA = points[0]
  const pointB = points[1]
  if (!pointA || !pointB) throw new Error(`drawN for n>2, n=${points.length}`)
  // find point halfway between point1 and point2
  const pointAB = pointA.add(pointB).divide(2)
  // find distance from center -> point12
  const distance = pointAB.subtract(center).length
  // use distance as base radius
  const baseRadius = distance

  // draw shells
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

type LinesByLength = Record<string, paper.Path.Line[]>

export const drawLines = (x: {
  points: paper.Point[]
  strokeColor: paper.Color
  strokeWidth: number
  dashArray?: [number, number]
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

      if (x.dashArray) line.dashArray = x.dashArray

      lines.push(line)

      const theseLines = linesByLength[lineLengthStr] ?? []
      theseLines.push(line)
      linesByLength[lineLengthStr] = theseLines
    })
  })

  return linesByLength
}

export const drawZeroShells = ({
  center,
  size,
  shelln,
  shellColor,
  shellThickness,
  shellGap,
  dashArray,
}: {
  center: paper.Point
  size: number
  radius: number
  shelln: number
  shellColor: PaperColor
  shellThickness: number
  shellGap: number
  dashArray?: [number, number]
}): void => {
  const rays = []
  rays.push(
    new paper.Path.Line({
      from: [center.x - size / 2, center.y],
      to: [center.x + size / 2, center.y],
      strokeColor: shellColor,
      strokeWidth: shellThickness,
      strokeCap: 'round',
      strokeJoin: 'round',
      dashArray,
    }),
  )
  for (let i = 0; i < shelln; i++) {
    rays.push(
      new paper.Path.Line({
        from: [center.x - size / 2, center.y - (i + 1) * shellGap],
        to: [center.x + size / 2, center.y - (i + 1) * shellGap],
        strokeColor: shellColor,
        strokeWidth: shellThickness,
        strokeCap: 'round',
        strokeJoin: 'round',
        dashArray,
      }),
    )
    rays.push(
      new paper.Path.Line({
        from: [center.x - size / 2, center.y + (i + 1) * shellGap],
        to: [center.x + size / 2, center.y + (i + 1) * shellGap],
        strokeColor: shellColor,
        strokeWidth: shellThickness,
        strokeCap: 'round',
        strokeJoin: 'round',
        dashArray,
      }),
    )
  }
}

export const spreadLines = (args: {
  linesByLength: LinesByLength
  distance: number
  radius?: number
  center?: paper.Point
  reverse?: boolean
  relayer?: boolean
}): paper.Group => {
  const lengths = Object.keys(args.linesByLength)
  lengths.sort((a, b) => Number(b) - Number(a))
  if (args.relayer) lengths.reverse()

  const groups = lengths.map((length) => {
    const lines = args.linesByLength[length]
    if (!lines) throw new Error('Unreachable')
    const group = new paper.Group(lines)
    if (args.radius && args.center) {
      // helps centering shapes like triangle
      group.addChild(
        new paper.Path.Circle({
          center: args.center,
          radius: args.radius,
          opacity: 0,
        }),
      )
    }
    return group
  })

  if (args.reverse) groups.reverse()

  if (args.relayer) {
    groups.forEach((group, i) => {
      group.position.y += args.distance * i
      // group.position.y += args.distance * (groups.length - 1)
    })
  } else {
    groups.forEach((group, i) => {
      group.position.y -= args.distance * i
      group.position.y += args.distance * (groups.length - 1)
    })
  }

  return new paper.Group(groups)
}
