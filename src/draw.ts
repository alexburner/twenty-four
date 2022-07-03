import paper from 'paper'

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
  })
}

const drawOne = ({
  center,
  shelln,
  shellColor,
  shellThickness,
  shellGap,
  graphColor,
  graphThickness,
  container,
}: {
  center: paper.Point
  shelln: number
  shellColor: PaperColor
  shellThickness: number
  shellGap: number
  graphColor: PaperColor
  graphThickness: number
  container: paper.Path
}): void => {
  // point
  new paper.Path.Circle({
    center: center,
    radius: graphThickness,
    fillColor: graphColor,
  })
  // and rings
  const rings = []
  for (let i = 0; i < shelln; i++) {
    rings.push(
      new paper.Path.Circle({
        center: center,
        radius: (i + 1) * shellGap,
        strokeWidth: shellThickness,
        strokeColor: shellColor,
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
}): void => {
  const rays = []
  const touchGap = twoTouch ? 0 : shellGap
  rays.push(
    new paper.Path.Line({
      from: [center.x, center.y - size / 2],
      to: [center.x, center.y - radius - touchGap],
      strokeColor: shellColor,
      strokeWidth: shellThickness,
    }),
  )
  rays.push(
    new paper.Path.Line({
      from: [center.x, center.y + radius + touchGap],
      to: [center.x, center.y + size / 2],
      strokeColor: shellColor,
      strokeWidth: shellThickness,
    }),
  )
  for (let i = 0; i < shelln; i++) {
    rays.push(
      new paper.Path.Line({
        from: [center.x - (i + 1) * shellGap, center.y - size / 2],
        to: [center.x - (i + 1) * shellGap, center.y + size / 2],
        strokeColor: shellColor,
        strokeWidth: shellThickness,
      }),
    )
    rays.push(
      new paper.Path.Line({
        from: [center.x + (i + 1) * shellGap, center.y - size / 2],
        to: [center.x + (i + 1) * shellGap, center.y + size / 2],
        strokeColor: shellColor,
        strokeWidth: shellThickness,
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
    shells.push(shell)
  }
  shells.unshift(container)
  new paper.Group(shells).clipped = true
}

const getMinRadius = (radius: number, length: number): number => {
  return Math.sqrt(Math.pow(radius, 2) - Math.pow(length / 2, 2))
}
