import paper from 'paper'
import { drawBleed, drawDots, drawLines, getPoints } from '../draw'

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

    // n rect
    const nRect = new paper.Path.Rectangle({
      point: rowPoint,
      size: [fontSize * 4.25, rowHeight],
      strokeColor,
      strokeWidth,
    })
    tableGroup.addChild(nRect)

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
  }

  tableGroup.position = new paper.Point(canvasW / 2, canvasH / 2)

  swatch.sendToBack()

  drawBleed(canvasW, canvasH, BLEED)
}
