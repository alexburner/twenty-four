import paper from 'paper'

type PaperColor = Partial<paper.Color>

export const drawByLength = (
  center: paper.Point,
  length: number,
  cellW: number,
  cellH: number,
  total: number,
  n: number,
): void => {
  const bounds = new paper.Path.Rectangle({
    point: [center.x - cellW / 2, center.y - cellH / 2],
    size: [cellW, cellH],
  })

  const clipMask = bounds.clone()
  clipMask.scale(31 / 32, center)
  clipMask.remove()

  const color = {
    hue: (360 * ((n - 1) / (total + 1)) - 5) % 360,
    saturation: 0.9,
    brightness: 0.9,
  }

  const graphColor = '#333'
  const shellColor = { ...color, brightness: 0.6 }

  const swatch = new paper.Path.Rectangle({
    size: clipMask.bounds.size,
    fillColor: color,
    opacity: 1 / 6,
  })
  swatch.position = center

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
      clipMask,
    })
    return
  }

  const angle = 360 / n
  const angleRad = (2 * Math.PI) / n
  const radius = length / 2 / Math.sin(angleRad / 2)

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
      cellH,
      dotRadius,
      shelln,
      shellColor,
      shellThickness,
      shellGap,
      clipMask,
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
    clipMask,
    points,
    linesByLength,
    radius,
    length,
  })
}

const drawOne = ({
  center,
  dotRadius,
  shelln,
  shellColor,
  shellThickness,
  shellGap,
  clipMask,
}: {
  center: paper.Point
  dotRadius: number
  shelln: number
  shellColor: PaperColor
  shellThickness: number
  shellGap: number
  clipMask: paper.Path
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
  rings.unshift(clipMask)
  new paper.Group(rings).clipped = true
}

const drawTwo = ({
  center,
  cellH,
  dotRadius,
  shelln,
  shellColor,
  shellThickness,
  shellGap,
  clipMask,
  points,
}: {
  center: paper.Point
  cellH: number
  dotRadius: number
  shelln: number
  shellColor: PaperColor
  shellThickness: number
  shellGap: number
  clipMask: paper.Path
  points: paper.Point[]
}): void => {
  const rays = []
  rays.push(
    new paper.Path.Line({
      from: [center.x, center.y - cellH / 2],
      to: [center.x, center.y + cellH / 2],
      strokeColor: shellColor,
      strokeWidth: shellThickness,
    }),
  )
  for (let i = 0; i < shelln; i++) {
    rays.push(
      new paper.Path.Line({
        from: [center.x - (i + 1) * shellGap, center.y - cellH / 2],
        to: [center.x - (i + 1) * shellGap, center.y + cellH / 2],
        strokeColor: shellColor,
        strokeWidth: shellThickness,
      }),
    )
    rays.push(
      new paper.Path.Line({
        from: [center.x + (i + 1) * shellGap, center.y - cellH / 2],
        to: [center.x + (i + 1) * shellGap, center.y + cellH / 2],
        strokeColor: shellColor,
        strokeWidth: shellThickness,
      }),
    )
  }
  rays.unshift(clipMask)
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
  clipMask,
  points,
  linesByLength,
  radius,
  length,
}: {
  center: paper.Point
  dotRadius: number
  shelln: number
  shellColor: PaperColor
  shellThickness: number
  shellGap: number
  clipMask: paper.Path
  points: paper.Point[]
  linesByLength: Record<string, paper.Path.Line[]>
  radius: number
  length: number
}): void => {
  const shortestLength = Object.keys(linesByLength).sort()[0]
  if (!shortestLength) return
  const longestLines = linesByLength[shortestLength]
  const baseShell = new paper.Group(longestLines)
  const baseRadius = getMinRadius(radius, length)
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
  shells.unshift(clipMask)
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
