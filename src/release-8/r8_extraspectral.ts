import paper from 'paper'
import { drawBleed } from '../draw'

const BLEED = 36

const canvasW = 300 * 2.75 + BLEED * 2
const canvasH = 300 * 4.75 + BLEED * 2

const swatchColor = new paper.Color('white')
const strokeColor = new paper.Color('#333')
const strokeWidth = 1.5

export const r8Extraspectral = (canvas: HTMLCanvasElement): void => {
  /**
   * TODO
   * - color names outside (r,y,g,c,b,m)
   * - angle degrees inside (0,60,120,180,240,300)
   *                         (30,90,150,210,270)
   *
   * rotate ticks around circle
   * + rotate text around circle
   * (no "right way up")
   *
   * https://stackoverflow.com/questions/16534659/draw-text-along-the-bezier-curve-in-paper-js
   * http://sketch.paperjs.org/#V/0.12.17/S/pVZtT9swEP4rp0iDINrQdkKgBiYhtH0FDSQ+tP3gJpfWNHUqxwG6qv99d07TxH0ZSAtIqc9+njs/d2dn5SkxR6/vPc3QRFOv5UVZzOM3oSHSKAzepXKiMH7GDwO3kBQqMjJTfm50CxbCTFuQm2WKZ7AaKqBHJsCTcHJCEzpIUU3MFH5Ahy0M2K7k5+Ji4wYeM6mM9ZKNXzEykGQaUERTmKTLxbSGcGjWxItzimkwCutZRvm8RNJMJ6TXTSMOGp+fOwHwU7MN5IhgZUTbgHg7QV6M6SXVxJctIumeVfsO/8EVvBa5kYmMBGtGzEMvQmVQD70GbO3I4W4bEqliKEHw8ZAkORpXio3RCtE5qkT3a0rw8oWQepPtT4SANnRJDDiHo3JUZIHGefaG/u58FX0pfD1i6hERb/HjrFBxHrzLmKqpDS7LrvAW7UIuoEdWNzu7C47mhGKCBauwmx1BydGZ4frdGDJNnGCmWAL+rzBtF9rcszCOQKMdIbntuLuqhrtpAPd4HUCUZjnGB9fw4/hvDL5Bw124j10DYJrjl2hJMqRCx/gQj2ta72+7SXXbIDu4JbcCjlTl+mjoZYOYqe0JitxqMEFjx3emEcsu577zRYPD4g8g2J8RquHpWagJ7vn6pCFop7ZKfeIKiCDFVu12b/d7bUAv+h+q+rQWh89rAeXZYBtDlEfCUNWXSQ3avUrcS8Ruu1ym8L32tc0UTwZRRgJYCYkibF4/TS7HGiSEOSvh/NNiK3t4DPBLzGW6bMBKgwMuTUcpnuQfbBDw0IGz4Sj4ReJk2gz7BSUZHILSFG4Txi+NptDKwsI6hY+UePj5IeaLbXIK/YYbre/5t79V3b/stOB7p0MHfJ0K/5qMl2yrTe1uh4ztK9fau2J4r3PGiauap8oq/fRXOU7mlMS8DwMbRrAx0M3ijHsjLhKdzfA+SzPdh1ON8emaeZkzKdJ0+YQpVSLG5MDogvXc+4bxh96DQvjNRWoy0EWKfFrPQaRpC5pT9ublKdc8tvVdQWyhS2UP/FjomcI8h3GFHHrVN9KqynEfutc2aP6j760xBTizJ0Hu9Qej9V8=
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

    const wheelCenter = new paper.Point([canvasW / 2, canvasH * 0.633])

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
        // hue: 210 - 180,
        // hue: 30 - 45,
        hue: 30,
        saturation: 0.9,
        brightness: 0.9,
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
    content: 'Extra-spectral color',
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
