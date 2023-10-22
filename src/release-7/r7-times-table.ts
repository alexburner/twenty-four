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

const firstN = 1
const pageSize = 10

const strokeColor = new paper.Color('#333')
const strokeWidth = 2
const fontSize = 36
const textColor = strokeColor.clone()

const radius = fontSize * 0.5
const dotRadius = radius * 0.33

const ROUGHNESS = 10

export const r7TimesTable = (
  canvas: HTMLCanvasElement,
  pageIndex: number,
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

  const startN = firstN + pageSize * pageIndex

  const shapesByLength: Record<number, number> = {}
  const largestShape = startN + pageSize
  for (let shape = 2; shape <= largestShape; shape++) {
    const length = getApprox(getProximity(radius, shape), ROUGHNESS)
    shapesByLength[length] = shape
  }

  const tableWidth = canvasW - BLEED * 4
  const tableHeight = canvasH - BLEED * 4
  const rowWidth = tableWidth
  const rowHeight = tableHeight / pageSize

  const tableGroup = new paper.Group()

  for (let i = 0; i < pageSize; i++) {
    // row rect
    const rowPoint = new paper.Point(0, rowHeight * i)
    const rowRect = new paper.Path.Rectangle({
      point: rowPoint,
      size: [rowWidth, rowHeight],
      strokeColor,
      strokeWidth,
    })
    tableGroup.addChild(rowRect)

    // // n rect
    // const nRect = new paper.Path.Rectangle({
    //   point: rowPoint,
    //   size: [fontSize * 4.25, rowHeight],
    //   strokeColor,
    //   strokeWidth,
    // })
    // tableGroup.addChild(nRect)

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
    tableGroup.addChild(nText)

    // n shape
    const shapeCenter = new paper.Point(
      nTextPoint.x + fontSize * 1,
      rowRect.position.y,
    )
    if (n === 1) {
      const dotGroup = drawDots([shapeCenter], strokeColor, dotRadius)
      tableGroup.addChild(dotGroup)
    } else if (n > 1) {
      const points = getPoints(shapeCenter, radius, n)
      const linesByLength = drawLines({
        points,
        strokeColor,
        strokeWidth,
      })
      const lines = Object.values(linesByLength).flatMap(
        (lengthLines) => lengthLines,
      )
      const lineGroup = new paper.Group(lines)
      lineGroup.position.y = shapeCenter.y
      tableGroup.addChild(lineGroup)
    }

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
        if (!shape) return
        if (factor && factor >= 1) return factor
        return undefined
      })
      const factorWidth = rowWidth - fontSize * 6
      factors.forEach((factor) => {
        if (!factor) return
        const factorTextPoint = new paper.Point(
          rowWidth - (factor - 1) * (factorWidth / 20) - fontSize * 1,
          nTextPoint.y,
        )
        const factorText = new paper.PointText({
          point: factorTextPoint,
          content: factor,
          justification: 'right',
          fillColor: textColor,
          fontFamily: 'FuturaLight',
          fontSize,
        })
        tableGroup.addChild(factorText)
      })
    }
  }

  tableGroup.position = new paper.Point(canvasW / 2, canvasH / 2)

  swatch.sendToBack()

  drawBleed(canvasW, canvasH, BLEED)
}
