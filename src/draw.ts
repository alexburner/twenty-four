import paper from 'paper'

type PaperColor = Partial<paper.Color>

export const drawByLength = (
  container: paper.Path,
  center: paper.Point,
  proximity: number,
  size: number,
  n: number,
  graphColor: PaperColor,
  shellColor: PaperColor,
): void => {
  const dotRadius = 20
  const shellThickness = 1
  const shelln = 20
  const shellGap = 36

  // 0 has nothing
  if (n < 1) {
    return
  }

  // 1 only a point
  if (n < 2) {
    drawOne({
      center,
      dotRadius,
      shelln,
      shellColor,
      shellThickness,
      shellGap,
      container,
    })
    return
  }

  const angle = 360 / n
  const angleRad = (2 * Math.PI) / n
  const radius = proximity / 2 / Math.sin(angleRad / 2)

  const points: paper.Point[] = []

  const vector = new paper.Point(center)
  vector.length = radius
  vector.angle = -90

  for (let i = 0, l = n; i < l; i++) {
    let point = new paper.Point(center)
    point = point.add(vector)
    points.push(point)
    vector.angle += angle
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
        strokeColor: graphColor,
        strokeWidth: 1,
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
      dotRadius,
      shelln,
      shellColor,
      shellThickness,
      shellGap,
      container,
      points,
    })
    return
  }

  drawN({
    center,
    dotRadius,
    shelln,
    shellColor,
    shellThickness,
    shellGap,
    container,
    points,
    linesByLength,
    radius,
    proximity,
  })
}

const drawOne = ({
  center,
  dotRadius,
  shelln,
  shellColor,
  shellThickness,
  shellGap,
  container,
}: {
  center: paper.Point
  dotRadius: number
  shelln: number
  shellColor: PaperColor
  shellThickness: number
  shellGap: number
  container: paper.Path
}): void => {
  new paper.Path.Circle({
    fillColor: 'black',
    center: center,
    radius: dotRadius,
  })

  // and rings
  const rings = []
  for (let i = 0; i < shelln; i++) {
    rings.push(
      new paper.Path.Circle({
        strokeColor: shellColor,
        strokeWidth: shellThickness,
        center: center,
        radius: (i + 1) * shellGap + shellGap / 2,
      }),
    )
  }
  rings.unshift(container)
  new paper.Group(rings).clipped = true
}

const drawTwo = ({
  center,
  size,
  dotRadius,
  shelln,
  shellColor,
  shellThickness,
  shellGap,
  container,
  points,
}: {
  center: paper.Point
  size: number
  dotRadius: number
  shelln: number
  shellColor: PaperColor
  shellThickness: number
  shellGap: number
  container: paper.Path
  points: paper.Point[]
}): void => {
  const rays = []
  rays.push(
    new paper.Path.Line({
      from: [center.x, center.y - size / 2],
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

  points.forEach((point) => {
    new paper.Path.Circle({
      fillColor: 'black',
      center: point,
      radius: dotRadius,
    })
  })
}

const drawN = ({
  center,
  dotRadius,
  shelln,
  shellColor,
  shellThickness,
  shellGap,
  container,
  points,
  linesByLength,
  radius,
  proximity,
}: {
  center: paper.Point
  dotRadius: number
  shelln: number
  shellColor: PaperColor
  shellThickness: number
  shellGap: number
  container: paper.Path
  points: paper.Point[]
  linesByLength: Record<string, paper.Path.Line[]>
  radius: number
  proximity: number
}): void => {
  const shortestLength = Object.keys(linesByLength).sort()[0]
  if (!shortestLength) return
  const longestLines = linesByLength[shortestLength]
  const baseShell = new paper.Group(longestLines)
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
  points.forEach((point) => {
    new paper.Path.Circle({
      fillColor: 'black',
      center: point,
      radius: dotRadius,
    })
  })
}

const getMinRadius = (radius: number, length: number): number => {
  return Math.sqrt(Math.pow(radius, 2) - Math.pow(length / 2, 2))
}
