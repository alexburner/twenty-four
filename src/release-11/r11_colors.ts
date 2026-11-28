import paper from 'paper'
import { drawBleed } from '../draw'
import { BLEED, CANVAS_H, CANVAS_W, VIS_HEIGHT, VIS_WIDTH } from './r11_common'

import cieSvgUrl from '../CIE1931xy_CIERGB.svg'

export const r11ColorsSegment = (
  canvas: HTMLCanvasElement,
  args: { saturation: number; brightness: number },
): void => {
  canvas.style.width = `${CANVAS_W}px`
  canvas.style.height = `${CANVAS_H}px`
  paper.setup(canvas)

  const BG_COLOR = new paper.Color('white')
  const STROKE_COLOR = new paper.Color('white')
  const STROKE_WIDTH = 2

  // Vis area / mask
  const visX = BLEED * 2
  const visY = BLEED * 2
  const visW = VIS_WIDTH - BLEED * 2
  const visH = VIS_HEIGHT - BLEED * 2
  const visMask = new paper.Path.Rectangle({
    point: [visX, visY],
    size: [visW, visH],
    radius: 30,
  })
  visMask.fillColor = new paper.Color('red') // temp

  // Color rectangles
  // visH = 1353 | b-triangle -> 1344
  const colorCounts = [3, 6, 12, 24, 48, 96, visH]
  const columnWidth = visW / colorCounts.length
  const colorRects: paper.Path.Rectangle[] = []

  // // v1: naive split
  // colorCounts.forEach((count, columnIndex) => {
  //   const x = visX + columnIndex * columnWidth
  //   const rectHeight = visH / count
  //   for (let i = 0; i < count; i++) {
  //     const hue = (i / count) * 360
  //     const rect = new paper.Path.Rectangle({
  //       point: [x, visY + i * rectHeight],
  //       size: [columnWidth, rectHeight],
  //       fillColor: new paper.Color({
  //         hue,
  //         saturation: args.saturation,
  //         brightness: args.brightness,
  //       }),
  //       strokeColor: STROKE_COLOR,
  //       strokeWidth: columnIndex < colorCounts.length - 1 ? STROKE_WIDTH : 0,
  //     })
  //     if (columnIndex === colorCounts.length - 1) {
  //       rect.position.x += STROKE_WIDTH / 2
  //     }
  //     colorRects.push(rect)
  //   }
  // })

  // v2: center RGB
  // colorCounts.forEach((count, columnIndex) => {
  //   const x = visX + columnIndex * columnWidth
  //   const rectHeight = visH / count
  //   // Anchor all columns to the center of the first red segment
  //   const redCenterY = visY + visH / 6
  //   // Draw enough rectangles to cover the visible area
  //   const startIndex = Math.floor((visY - redCenterY) / rectHeight - 0.5)
  //   const endIndex = Math.ceil((visY + visH - redCenterY) / rectHeight + 0.5)
  //   for (let i = startIndex; i <= endIndex; i++) {
  //     const hue = ((((i % count) + count) % count) / count) * 360
  //     // Position each color relative to the same red center
  //     const y = redCenterY + i * rectHeight - rectHeight / 2
  //     const rect = new paper.Path.Rectangle({
  //       point: [x, y],
  //       size: [columnWidth, rectHeight],
  //       fillColor: new paper.Color({
  //         hue,
  //         saturation: args.saturation,
  //         brightness: args.brightness,
  //       }),
  //       strokeColor: STROKE_COLOR,
  //       strokeWidth: columnIndex < colorCounts.length - 1 ? STROKE_WIDTH : 0,
  //     })
  //     if (columnIndex === colorCounts.length - 1) {
  //       rect.position.x += STROKE_WIDTH / 2
  //     }
  //     colorRects.push(rect)
  //   }
  // })

  // v3 overlap
  const colorBridges: paper.Path.Rectangle[] = []
  colorCounts.forEach((count, columnIndex) => {
    const x = visX + columnIndex * columnWidth
    const rectHeight = visH / count
    const redCenterY = visY + visH / 6

    const prevCount = colorCounts[columnIndex - 1]
    const prevRectHeight = prevCount ? visH / prevCount : 0

    const startIndex = Math.floor((visY - redCenterY) / rectHeight - 0.5)
    const endIndex = Math.ceil((visY + visH - redCenterY) / rectHeight + 0.5)

    for (let i = startIndex; i <= endIndex; i++) {
      const hue = ((((i % count) + count) % count) / count) * 360
      const y = redCenterY + i * rectHeight - rectHeight / 2

      const fillColor = new paper.Color({
        hue,
        saturation: args.saturation,
        brightness: args.brightness,
      })

      const isLastColumn = columnIndex === colorCounts.length - 1

      const rect = new paper.Path.Rectangle({
        point: [x, y],
        size: [columnWidth, rectHeight],
        fillColor,
        strokeColor: STROKE_COLOR,
        strokeWidth: isLastColumn ? 0 : STROKE_WIDTH,
        strokeCap: 'round',
        strokeJoin: 'round',
      })

      if (isLastColumn) {
        rect.position.x += STROKE_WIDTH / 2
      }

      colorRects.push(rect)

      // Does this hue also exist in the previous column?
      const prevIndex = prevCount ? (i * prevCount) / count : 0
      const existsInPrev =
        columnIndex > 0 && Math.abs(prevIndex - Math.round(prevIndex)) < 1e-8

      if (existsInPrev) {
        // Bridge across the vertical white stroke.
        const bridgeWidth = STROKE_WIDTH * 2 + 1

        // Keep the bridge within the smaller color segment.
        const bridgeHeight = Math.min(rectHeight, prevRectHeight)

        const bridge = new paper.Path.Rectangle({
          point: [x - bridgeWidth / 2, y + (rectHeight - bridgeHeight) / 2],
          size: [bridgeWidth, bridgeHeight],
          fillColor,
        })

        colorBridges.push(bridge)
      }
    }
  })

  // Draw bridges above the rectangles so they cover the strokes.
  colorBridges.forEach((bridge) => bridge.bringToFront())

  // Clip all color rectangles to the rounded vis area
  // const visGroup = new paper.Group([visMask, ...colorRects])
  const visGroup = new paper.Group([visMask, ...colorRects, ...colorBridges])
  visGroup.clipped = true

  // Card background
  const swatch = new paper.Path.Rectangle({
    point: [0, 0],
    size: [CANVAS_W, CANVAS_H],
  })
  swatch.fillColor = BG_COLOR
  swatch.sendToBack()
  drawBleed(CANVAS_W, CANVAS_H, BLEED)
}

export const r11ColorsSpace = (canvas: HTMLCanvasElement): void => {
  canvas.style.width = `${CANVAS_W}px`
  canvas.style.height = `${CANVAS_H}px`
  paper.setup(canvas)

  const positionGroup = new paper.Group()

  const spectrumRaster = new paper.Raster('spectrum')
  spectrumRaster.scale(1.2)
  spectrumRaster.position.x = CANVAS_W / 2
  spectrumRaster.position.y = 0
  positionGroup.addChild(spectrumRaster)

  paper.project.importSVG(cieSvgUrl, {
    onLoad: (item: paper.Item) => {
      item.position.x = CANVAS_W / 2
      item.position.y += 300
      item.scale(1.2)
      positionGroup.addChild(item)

      positionGroup.position.y = CANVAS_H / 2
      // positionGroup.position.y += 20
      // positionGroup.position.y += 10
      positionGroup.position.y += 8
      // positionGroup.position.y += 4
    },
    onError: (err: unknown) => {
      console.error('Failed to load CIE1931xy_CIERGB.svg:', err)
    },
  })

  // {
  //   // YE OLDE WHEEL
  //   const steps = 720
  //   const radius = 240
  //   const thickness = 55
  //   const innerRadius = radius - thickness
  //   const wheelCenter = new paper.Point([CANVAS_W / 2, CANVAS_H * 0.633])
  //   const STROKE_COLOR = new paper.Color('#333')
  //   const STROKE_WIDTH = 1.5

  //   // Generate color wheel
  //   const wheel = new paper.Group()
  //   for (let i = 0; i < steps; i++) {
  //     const circum = radius * 2 * Math.PI
  //     const step = circum / steps
  //     const seg = new paper.Path()
  //     seg.add([0, 0], [radius, -step / 2 - 0.5], [radius, step / 2 + 0.5])
  //     seg.fillColor = new paper.Color({
  //       hue: 30,
  //       saturation: 1,
  //       brightness: 1,
  //     })
  //     seg.fillColor.hue -= (360 / steps) * i
  //     seg.rotate((360 / steps) * i, new paper.Point([0, 0]))

  //     wheel.addChild(seg)
  //   }
  //   wheel.position = wheelCenter

  //   // Create ring-shaped clipping mask
  //   const outerCircle = new paper.Path.Circle({
  //     center: wheelCenter,
  //     radius,
  //   })
  //   const innerCircle = new paper.Path.Circle({
  //     center: wheelCenter,
  //     radius: innerRadius,
  //   })
  //   innerCircle.reverse()
  //   const mask = new paper.CompoundPath({
  //     children: [outerCircle, innerCircle],
  //   })

  //   // Apply clipping mask
  //   const ring = new paper.Group([mask, wheel])
  //   ring.clipped = true

  //   // Outer outline
  //   ring.parent.addChild(
  //     new paper.Path.Circle({
  //       center: wheelCenter,
  //       radius,
  //       strokeWidth: STROKE_WIDTH,
  //       strokeColor: STROKE_COLOR,
  //     }),
  //   )

  //   // Inner outline
  //   ring.parent.addChild(
  //     new paper.Path.Circle({
  //       center: wheelCenter,
  //       radius: innerRadius,
  //       strokeWidth: STROKE_WIDTH,
  //       strokeColor: STROKE_COLOR,
  //     }),
  //   )
  // }

  const BG_COLOR = new paper.Color('white')
  const bg = new paper.Path.Rectangle({
    point: [0, 0],
    size: [CANVAS_W, CANVAS_H],
  })
  bg.fillColor = BG_COLOR
  bg.sendToBack()
  drawBleed(CANVAS_W, CANVAS_H, BLEED)
}
