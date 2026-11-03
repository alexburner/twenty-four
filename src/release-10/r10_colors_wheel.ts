import paper from 'paper'
import { drawBleed } from '../draw'
import { BLEED, CANVAS_H, CANVAS_W } from './r10_common'

const BG_COLOR = new paper.Color('white')
const STROKE_COLOR = new paper.Color('#333')
const STROKE_WIDTH = 1.5

export const r10ColorsWheel = (
  canvas: HTMLCanvasElement,
  args: { saturation: number; brightness: number },
): void => {
  /**
   * TODO
   * - color names outside (r,y,g,c,b,m)
   * - angle degrees inside (0,60,120,180,240,300)
   *                         (30,90,150,210,270)
   *
   * rotate ticks around circle
   * + rotate text around circle
   * (no "right way up")
   */

  canvas.style.width = `${CANVAS_W}px`
  canvas.style.height = `${CANVAS_H}px`
  paper.setup(canvas)

  const spectrumRaster = new paper.Raster('spectrum')
  spectrumRaster.scale(1.2)
  spectrumRaster.position.x = CANVAS_W / 2
  spectrumRaster.position.y = spectrumRaster.bounds.height / 2 + BLEED * 2 + 20

  // const eyeCurveRaster = new paper.Raster('eye-curves')
  // eyeCurveRaster.scale(1.6)
  // eyeCurveRaster.position.x = canvasW / 2
  // eyeCurveRaster.position.y =
  //   canvasH - eyeCurveRaster.bounds.height / 2 - BLEED * 2

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
        // saturation: 1,
        // brightness: 1,
        // saturation: 0.8,
        // brightness: 0.9,
        // saturation: 0.95,
        // brightness: 0.98,
        // info-colors-2
        // saturation: 0.9,
        // brightness: 0.9,
        // info-colors
        // saturation: 0.75,
        // brightness: 0.92,
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
