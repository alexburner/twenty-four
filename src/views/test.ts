import paper from 'paper'

export const test = (canvas: HTMLCanvasElement) => {
  const width = 100
  const height = 100
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  paper.setup(canvas)
  new paper.Path.Rectangle({
    size: [width, height],
    fillColor: 'red',
    opacity: 4 / 6,
  })
}
