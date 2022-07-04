import paper from 'paper'

const BLEED = 36

const canvasW = 300 * 3.5 + BLEED * 2
const canvasH = 300 * 3.5 + BLEED * 2

const graphColor = '#333'

export const splitYoungBack = (
  canvas: HTMLCanvasElement,
  n: number,
  total: number,
): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)

  const hue = ((360 * ((n - 0) / (total + 1))) % 360) - 8

  const swatchColor = {
    hue,
    saturation: 0.6,
    brightness: 1,
  }

  const x = canvasW / 2
  const y = x
  const center = new paper.Point(x, y)

  const container = new paper.Path.Rectangle({
    point: [0, 0],
    size: [canvasW, canvasH],
  })

  const swatch = container.clone()
  swatch.fillColor = swatchColor as paper.Color

  const fontSize = 400
  new paper.PointText({
    point: [center.x, center.y + fontSize / 3],
    content: n,
    justification: 'center',
    fillColor: graphColor,
    fontFamily: 'Futura',
    fontSize,
  })

  swatch.sendToBack()
}
