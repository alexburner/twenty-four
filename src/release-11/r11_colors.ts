import paper from 'paper'
import { drawBleed } from '../draw'
import { BLEED, CANVAS_H, CANVAS_W, VIS_HEIGHT, VIS_WIDTH } from './r11_common'

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
  const colorCounts = [3, 6, 12, 24, 48, 96, visH]
  const columnWidth = visW / colorCounts.length
  const colorRects: paper.Path.Rectangle[] = []
  colorCounts.forEach((count, columnIndex) => {
    const x = visX + columnIndex * columnWidth
    const rectHeight = visH / count
    for (let i = 0; i < count; i++) {
      const hue = (i / count) * 360
      const rect = new paper.Path.Rectangle({
        point: [x, visY + i * rectHeight],
        size: [columnWidth, rectHeight],
        fillColor: new paper.Color({
          hue,
          saturation: args.saturation,
          brightness: args.brightness,
        }),
        strokeColor: STROKE_COLOR,
        strokeWidth: columnIndex < colorCounts.length - 1 ? STROKE_WIDTH : 0,
      })
      if (columnIndex === colorCounts.length - 1) {
        rect.position.x += STROKE_WIDTH / 2
      }
      colorRects.push(rect)
    }
  })

  // Clip all color rectangles to the rounded vis area
  const visGroup = new paper.Group([visMask, ...colorRects])
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

export const r11ColorsWheel = (
  canvas: HTMLCanvasElement,
  args: { saturation: number; brightness: number },
): void => {
  canvas.style.width = `${CANVAS_W}px`
  canvas.style.height = `${CANVAS_H}px`
  paper.setup(canvas)

  const BG_COLOR = new paper.Color('white')
  const STROKE_COLOR = new paper.Color('#333')
  const STROKE_WIDTH = 1.5

  const spectrumRaster = new paper.Raster('spectrum')
  spectrumRaster.scale(1.2)
  spectrumRaster.position.x = CANVAS_W / 2
  spectrumRaster.position.y = spectrumRaster.bounds.height / 2 + BLEED * 2 + 20

  {
    const steps = 720
    const radius = 240
    const thickness = 55
    const innerRadius = radius - thickness

    const wheelCenter = new paper.Point([CANVAS_W / 2, CANVAS_H * 0.633])

    new paper.Path.Circle({
      center: wheelCenter,
      radius: radius,
      fillColor: 'white',
      strokeWidth: STROKE_WIDTH * 2,
      strokeColor: STROKE_COLOR,
    })

    // bless https://gist.github.com/eeropic/8087f73e187b357915030a91fb58b016
    const wheel = new paper.Group()
    for (let i = 0; i < steps; i++) {
      const circum = radius * 2 * Math.PI
      const step = circum / steps
      const seg = new paper.Path()
      seg.add([0, 0], [radius, -step / 2 - 0.5], [radius, step / 2 + 0.5])
      seg.fillColor = new paper.Color({
        hue: 30,
        saturation: args.saturation,
        brightness: args.brightness,
      })
      seg.fillColor.hue -= (360 / steps) * i
      seg.rotate((360 / steps) * i, new paper.Point([0, 0]))
      wheel.addChild(seg)
    }
    wheel.position = wheelCenter

    new paper.Path.Circle({
      center: wheelCenter,
      radius: innerRadius,
      fillColor: 'white',
      strokeWidth: STROKE_WIDTH,
      strokeColor: STROKE_COLOR,
    })
  }

  /**
   * TODO:
   * - add text to top
   * - rotate around circle to location
   * R 90 + 60 * 2
   * Y 90 + 60
   * G 90 (0)
   * C 90 - 60
   * B 90 - 60 * 2
   * M 90 - 60 * 3
   */

  const fontSize = 32
  const fontFamily = 'FuturaLight'
  // const paddingX = 16
  const paddingY = BLEED
  // const cornerX = paddingX + BLEED * 2
  const cornerY = -paddingY + CANVAS_H - BLEED * 2
  new paper.PointText({
    point: [CANVAS_W / 2, cornerY],
    content: `S:${args.saturation} / B:${args.brightness}`,
    justification: 'center',
    fillColor: STROKE_COLOR,
    fontFamily: fontFamily,
    fontSize: fontSize,
  })

  const swatch = new paper.Path.Rectangle({
    point: [0, 0],
    size: [CANVAS_W, CANVAS_H],
  })
  swatch.fillColor = BG_COLOR
  swatch.sendToBack()
  drawBleed(CANVAS_W, CANVAS_H, BLEED)
}
