import paper from 'paper'
import { drawBleed } from '../draw'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const swatchColor = new paper.Color('white')
const strokeColor = new paper.Color('#333')
const strokeWidth = 1.5

export const r7InfoColors = (canvas: HTMLCanvasElement): void => {
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

  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const spectrumRaster = new paper.Raster('spectrum')
  spectrumRaster.scale(1.2)
  spectrumRaster.position.x = canvasW / 2
  spectrumRaster.position.y = spectrumRaster.bounds.height / 2 + BLEED * 2 + 20

  // const eyeCurveRaster = new paper.Raster('eye-curves')
  // eyeCurveRaster.scale(1.6)
  // eyeCurveRaster.position.x = canvasW / 2
  // eyeCurveRaster.position.y =
  //   canvasH - eyeCurveRaster.bounds.height / 2 - BLEED * 2

  {
    const steps = 180
    const radius = 240
    const thickness = 55
    const innerRadius = radius - thickness

    const wheelCenter = new paper.Point([canvasW / 2, canvasH * 0.625])

    new paper.Path.Circle({
      center: wheelCenter,
      radius: radius,
      fillColor: 'white',
      strokeWidth: strokeWidth * 2,
      strokeColor,
    })

    // bless https://gist.github.com/eeropic/8087f73e187b357915030a91fb58b016
    const wheel = new paper.Group()
    for (let i = 0; i < steps; i++) {
      const circum = radius * 2 * Math.PI
      const step = circum / steps
      const seg = new paper.Path()
      seg.add([0, 0], [radius, -step / 2 - 0.5], [radius, step / 2 + 0.5])
      seg.fillColor = new paper.Color({
        // hue: 210,
        hue: 30 - 45,
        saturation: 0.75,
        brightness: 0.92,
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
      strokeWidth,
      strokeColor,
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
  const cornerY = -paddingY + canvasH - BLEED * 2
  new paper.PointText({
    point: [canvasW / 2, cornerY],
    content: 'Extra-spectral Magenta',
    justification: 'center',
    fillColor: strokeColor,
    fontFamily: fontFamily,
    fontSize: fontSize,
  })

  const swatch = new paper.Path.Rectangle({
    point: [0, 0],
    size: [canvasW, canvasH],
  })
  swatch.fillColor = swatchColor
  swatch.sendToBack()
  drawBleed(canvasW, canvasH, BLEED)
}
