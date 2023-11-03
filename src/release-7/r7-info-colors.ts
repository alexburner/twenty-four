import paper from 'paper'
import { drawBleed } from '../draw'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const swatchColor = new paper.Color('white')

export const r7InfoColors = (canvas: HTMLCanvasElement): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const spectrumRaster = new paper.Raster('spectrum')
  spectrumRaster.scale(1.2)
  spectrumRaster.position.x = canvasW / 2
  spectrumRaster.position.y = spectrumRaster.bounds.height / 2 + BLEED * 2.25

  // const eyeCurveRaster = new paper.Raster('eye-curves')
  // eyeCurveRaster.scale(1.6)
  // eyeCurveRaster.position.x = canvasW / 2
  // eyeCurveRaster.position.y =
  //   canvasH - eyeCurveRaster.bounds.height / 2 - BLEED * 2

  {
    const steps = 180
    const radius = 220
    const innerRadius = radius - 60
    const strokeWidth = 1.5
    const strokeColor = new paper.Color('#333')

    const wheelCenter = new paper.Point([canvasW / 2, canvasH * 0.6])

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
        hue: 210,
        // hue: 30,
        saturation: 0.99,
        brightness: 0.88,
      })
      seg.fillColor.hue += (360 / steps) * i
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

  const swatch = new paper.Path.Rectangle({
    point: [0, 0],
    size: [canvasW, canvasH],
  })
  swatch.fillColor = swatchColor
  swatch.sendToBack()
  drawBleed(canvasW, canvasH, BLEED)
}
