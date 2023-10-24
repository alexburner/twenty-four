import paper from 'paper'
import {
  drawBleed,
  drawDots,
  drawLines,
  getApprox,
  getPoints,
  getProximity,
  spreadLines,
} from '../draw'

const BLEED = 36
const canvasH = 300 * 2.75 + BLEED * 2
const canvasW = 300 * 4.75 + BLEED * 2

const firstN = 0
const pageSize = 10

const strokeColor = new paper.Color('#333')
const strokeWidth = 2
const fontSize = 36
const textColor = strokeColor.clone()

const radius = fontSize * 0.5
const dotRadius = radius * 0.33

const ROUGHNESS = 10

export const r7TimesTableBack = (
  canvas: HTMLCanvasElement,
  pageIndex: number,
  pageCount: number,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const swatchColor = new paper.Color({
    hue: 0,
    saturation: 0,
    brightness: 1,
  })

  const container = new paper.Path.Rectangle({
    point: [0, 0],
    size: [canvasW, canvasH],
  })

  const swatch = container.clone()
  swatch.fillColor = swatchColor

  const maxN = pageCount * pageSize
  const startN = firstN + pageSize * pageIndex

  const shapesByLength: Record<number, number> = {}
  const largestShape = startN + pageSize
  for (let shape = 2; shape <= largestShape; shape++) {
    const length = getApprox(getProximity(radius, shape), ROUGHNESS)
    shapesByLength[length] = shape
  }

  // const tableWidth = canvasW - BLEED * 4
  // const tableHeight = canvasH - BLEED * 4
  const trueW = canvasW - BLEED * 2
  const trueH = canvasH - BLEED * 2
  // const tablePadding = (trueH * 2) / 12
  const tablePadding = BLEED * 2.5
  const tableWidth = trueW - tablePadding
  const tableHeight = trueH - tablePadding
  const rowWidth = tableWidth
  const rowHeight = tableHeight / pageSize

  const tableGroup = new paper.Group()

  for (let i = 0; i < pageSize; i++) {
    // row rect
    const rowPoint = new paper.Point(0, rowHeight * i)
    const rowRect = new paper.Path.Rectangle({
      point: rowPoint,
      size: [rowWidth, rowHeight],
    })
    tableGroup.addChild(rowRect)

    // row line
    if (i + 1 < pageSize) {
      const lineFrom = new paper.Point(rowPoint.x, rowPoint.y + rowHeight)
      const lineTo = new paper.Point(lineFrom.x + rowWidth, lineFrom.y)
      const rowLine = new paper.Path.Line({
        from: lineFrom,
        to: lineTo,
        strokeColor,
        strokeWidth,
      })
      tableGroup.addChild(rowLine)
    }

    // n rect
    const nRect = new paper.Path.Rectangle({
      point: rowPoint,
      size: [fontSize * 4.25, rowHeight],
      strokeColor,
      strokeWidth,
    })
    tableGroup.addChild(nRect)

    // n group
    const nGroup = new paper.Group()

    // n text
    const n = startN + i
    const nTextPoint = new paper.Point(
      rowPoint.x + fontSize * 1.75,
      rowRect.position.y + fontSize / 2.8,
    )
    const nText = new paper.PointText({
      point: nTextPoint,
      content: n,
      justification: 'right',
      fillColor: textColor,
      fontFamily: 'FuturaLight',
      fontSize,
    })
    nGroup.addChild(nText)

    // n shape
    const shapeCenter = new paper.Point(
      nTextPoint.x + fontSize * 1,
      rowRect.position.y,
    )
    if (n === 1) {
      const dotGroup = drawDots([shapeCenter], strokeColor, dotRadius)
      nGroup.addChild(dotGroup)
    } else if (n > 1) {
      const points = getPoints(shapeCenter, radius, n)
      const linesByLength = drawLines({
        points,
        strokeColor,
        strokeWidth,
      })
      const lengths = Object.keys(linesByLength).sort(
        (a, b) => Number(a) - Number(b),
      )
      const [shortestLength, ...otherLengths] = lengths
      const shortestLines = linesByLength[shortestLength ?? ''] ?? []
      const shortestGroup = new paper.Group(shortestLines)
      shortestGroup.position.y = shapeCenter.y
      nGroup.addChild(shortestGroup)
      const otherLines = otherLengths.flatMap((length) => linesByLength[length])
      const otherGroup = new paper.Group(otherLines)
      otherGroup.remove()
    }

    nGroup.position.x += fontSize * 0.25

    tableGroup.addChild(nGroup)

    // factor text
    if (n > 1) {
      const points = getPoints(shapeCenter, radius, n)
      const linesByLength = drawLines({
        points,
        strokeColor: new paper.Color('transparent'),
        strokeWidth,
      })
      const spread = spreadLines({
        linesByLength,
        distance: 1,
        radius,
        center: shapeCenter,
        reverse: true,
      })
      const factors = spread.children.map((childGroup) => {
        const child = childGroup.children[0] as paper.Path
        const length = getApprox(child.length, ROUGHNESS)
        const shape = shapesByLength[length]
        let factor = shape && (childGroup.children.length - 1) / shape
        if (factor && shape === 2) factor *= 2 // ?
        if (shape === 2 && n % 2) return // ???
        if (!shape || !factor) return
        return Math.round(factor)
      })
      const factorWidth = rowWidth - fontSize * 6
      factors.forEach((factor) => {
        if (!factor) return
        const factorTextPoint = new paper.Point(
          // rowWidth - (factor - 1) * (factorWidth / 20) - fontSize * 0.75,
          fontSize * 1.5 +
            radius * 2 +
            +(factor - 1) * (factorWidth / (maxN / 2)) +
            radius +
            fontSize * 1 +
            fontSize * 1.25,
          nTextPoint.y,
        )
        const factorText = new paper.PointText({
          point: factorTextPoint,
          content: factor,
          justification: 'left',
          fillColor: textColor,
          fontFamily: 'FuturaLight',
          fontSize,
        })
        tableGroup.addChild(factorText)
      })
    }
  }

  const clipGroup = new paper.Group()
  const clipRect = new paper.Shape.Rectangle({
    point: [0, 0],
    size: [tableWidth + strokeWidth, tableHeight + strokeWidth],
    strokeColor,
    strokeWidth: strokeWidth * 2,
    strokeCap: 'round',
    strokeJoin: 'round',
    radius: 30,
  })
  clipGroup.addChild(clipRect)
  clipGroup.addChild(clipRect.clone())
  clipGroup.addChild(tableGroup)
  clipGroup.clipped = true
  clipGroup.position = new paper.Point(canvasW / 2, canvasH / 2)

  swatch.sendToBack()

  drawBleed(canvasW, canvasH, BLEED)
}
