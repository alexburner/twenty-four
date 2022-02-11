import { cubehelix, hcl, hsl } from 'd3-color'
import { scaleLinear } from 'd3-scale'
import { interpolateRainbow, interpolateSinebow } from 'd3-scale-chromatic'
import paper from 'paper'
import { bgColor } from '../constants'

const total = 25

const canvasW = 1200
const canvasH = 4200

const cellW = canvasW / total
const cellH = cellW

const rowGap = cellH

const xOffset = 0

export const colorTest = (canvas: HTMLCanvasElement): void => {
  canvas.style.width = `${canvasW}px`
  canvas.style.height = `${canvasH}px`
  paper.setup(canvas)
  colorFns.forEach((colorFn, i) => {
    drawRow(i * rowGap, colorFn)
  })
}

const scale = scaleLinear().domain([0, total]).range([0, 1])

type ColorFn = (i: number) => string

const drawColor = (center: paper.Point, i: number, colorFn: ColorFn): void => {
  const bounds = new paper.Path.Rectangle({
    point: [center.x - cellW / 2, center.y - cellH / 2],
    size: [cellW, cellH],
  })

  const clipMask = bounds.clone()
  clipMask.scale(15 / 16, center)
  clipMask.remove()

  const swatch = new paper.Path.Circle({
    radius: cellW / 2,
    fillColor: colorFn(i),
    opacity: 4 / 6,
  })

  swatch.position = center
}

const drawRow = (yStart: number, colorFn: ColorFn): void => {
  for (let i = 0; i < total; i++) {
    let x = cellW * i + cellW / 2
    x += cellW * xOffset
    x %= canvasW
    const y = yStart + cellH / 2
    drawColor(new paper.Point(x, y), i, colorFn)
  }
}

const colorFns: ColorFn[] = [
  () => bgColor,

  (i) => hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString(),
  (i) => interpolateSinebow(scale((i - 1) % total)),
  (i) => interpolateRainbow(scale((i + 5) % total)),

  () => bgColor,
  () => bgColor,

  (i) => {
    if (i >= 10) i += 1
    return hsl((360 * ((i - 1) / (total + 1)) + 1) % 360, 0.8, 0.5).toString()
  },

  () => bgColor,
  () => bgColor,

  (i) => {
    if (i === 10) i += 0.7
    if (i === 11) i += 0.5
    if (i === 12) i += 0.3
    if (i === 13) i += 0.1
    return hsl((360 * ((i - 1) / (total + 1)) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    if (i === 9) i += 0.9
    if (i === 10) i += 0.7
    if (i === 11) i += 0.5
    if (i === 12) i += 0.3
    if (i === 13) i += 0.1
    return hsl((360 * ((i - 1) / (total + 1)) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    return hsl((360 * ((i - 1) / (total + 1)) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    if (i >= 10) i += 1
    return hsl((360 * ((i - 1) / (total + 1)) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },

  () => bgColor,

  (i) => {
    const scaleX = scaleLinear()
      .domain([0, total + 1])
      .range([0, 1])
    if (i === 0) i -= 0.1
    if (i === 1) i -= 0.3
    if (i === 2) i -= 0.2
    if (i === 3) i += 0.2
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 15) return interpolateSinebow(scaleX((i - 1) % total))
    return hsl((360 * ((i - 1) / total)) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    const scaleX = scaleLinear()
      .domain([0, total + 1])
      .range([0, 1])
    if (i === 0) i -= 0.1
    if (i === 1) i -= 0.3
    if (i === 2) i -= 0.2
    if (i === 3) i += 0.2
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 15) return interpolateSinebow(scaleX((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },

  () => bgColor,

  (i) => {
    const scaleX = scaleLinear()
      .domain([0, total + 1])
      .range([0, 1])
    if (i === 0) i += 0.0
    if (i === 1) i -= 0.3
    if (i === 2) i -= 0.2
    if (i === 3) i += 0.2
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scaleX((i - 0.5) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    const scaleX = scaleLinear()
      .domain([0, total + 1])
      .range([0, 1])
    if (i === 0) i += 0.0
    if (i === 1) i -= 0.3
    if (i === 2) i -= 0.2
    if (i === 3) i += 0.2
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scaleX((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    const scaleX = scaleLinear()
      .domain([0, total + 1])
      .range([0, 1])
    if (i === 0) i += 0.0
    if (i === 1) i -= 0.3
    if (i === 2) i -= 0.2
    if (i === 3) i += 0.2
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 15) return interpolateSinebow(scaleX((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },

  () => bgColor,

  (i) => {
    const scaleX = scaleLinear()
      .domain([0, total + 1])
      .range([0, 1])
    if (i === 0) i += 0.0
    if (i === 1) i -= 0.3
    if (i === 2) i -= 0.2
    if (i === 3) i += 0.2
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 18) return interpolateSinebow(scaleX((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    const scaleX = scaleLinear()
      .domain([0, total + 1])
      .range([0, 1])
    if (i === 0) i += 0.0
    if (i === 1) i -= 0.3
    if (i === 2) i -= 0.2
    if (i === 3) i += 0.2
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 17) return interpolateSinebow(scaleX((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    const scaleX = scaleLinear()
      .domain([0, total + 1])
      .range([0, 1])
    if (i === 0) i += 0.0
    if (i === 1) i -= 0.3
    if (i === 2) i -= 0.2
    if (i === 3) i += 0.2
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 16) return interpolateSinebow(scaleX((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    const scaleX = scaleLinear()
      .domain([0, total + 1])
      .range([0, 1])
    if (i === 0) i += 0.0
    if (i === 1) i -= 0.3
    if (i === 2) i -= 0.2
    if (i === 3) i += 0.2
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 15) return interpolateSinebow(scaleX((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    const scaleX = scaleLinear()
      .domain([0, total + 1])
      .range([0, 1])
    if (i === 0) i += 0.0
    if (i === 1) i -= 0.3
    if (i === 2) i -= 0.2
    if (i === 3) i += 0.2
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 14) return interpolateSinebow(scaleX((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    const scaleX = scaleLinear()
      .domain([0, total + 1])
      .range([0, 1])
    if (i === 0) i += 0.0
    if (i === 1) i -= 0.3
    if (i === 2) i -= 0.2
    if (i === 3) i += 0.2
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 13) return interpolateSinebow(scaleX((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    const scaleX = scaleLinear()
      .domain([0, total + 1])
      .range([0, 1])
    if (i === 0) i += 0.0
    if (i === 1) i -= 0.3
    if (i === 2) i -= 0.2
    if (i === 3) i += 0.2
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 12) return interpolateSinebow(scaleX((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    const scaleX = scaleLinear()
      .domain([0, total + 1])
      .range([0, 1])
    if (i === 0) i += 0.0
    if (i === 1) i -= 0.3
    if (i === 2) i -= 0.2
    if (i === 3) i += 0.2
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scaleX((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    const scaleX = scaleLinear()
      .domain([0, total + 1])
      .range([0, 1])
    if (i === 0) i += 0.0
    if (i === 1) i -= 0.3
    if (i === 2) i -= 0.2
    if (i === 3) i += 0.2
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 10) return interpolateSinebow(scaleX((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },

  () => bgColor,

  (i) => {
    const scaleX = scaleLinear()
      .domain([0, total + 1])
      .range([0, 1])
    if (i === 0) i += 0.0
    if (i === 1) i -= 0.3
    if (i === 2) i -= 0.2
    if (i === 3) i += 0.2
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scaleX((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    const scaleX = scaleLinear()
      .domain([0, total + 1])
      .range([0, 1])
    if (i === 0) i += 0.0
    if (i === 1) i -= 0.3
    if (i === 2) i -= 0.2
    if (i === 3) i += 0.2
    if (i > 3) i += 0.2
    if (i === 3) i -= 0.8
    if (i === 5) i -= 0.2
    if (i === 6) i -= 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scaleX((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    const scaleX = scaleLinear()
      .domain([0, total + 1])
      .range([0, 1])
    if (i === 0) i += 0.2
    if (i === 1) i -= 0.0
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scaleX((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },

  () => bgColor,

  (i) => {
    const scaleX = scaleLinear()
      .domain([0, total + 1])
      .range([0, 1])
    if (i === 0) i += 0.2
    if (i === 1) i -= 0.0
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scaleX((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    const scaleX = scaleLinear()
      .domain([0, total + 1])
      .range([0, 1])
    if (i === 0) i += 0.2
    if (i === 1) i -= 0.0
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scaleX((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    const scaleX = scaleLinear()
      .domain([0, total + 1])
      .range([0, 1])
    if (i === 0) i += 0.2
    if (i === 1) i -= 0.0
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scaleX((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },

  () => bgColor,

  (i) => {
    if (i === 0) i += 0.2
    if (i === 1) i -= 0.0
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i > 10) i += 0.5
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    // if (i > 12) return interpolateSinebow(scale((i - 1) % count))
    return hsl((360 * ((i - 1) / (total + 1)) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    if (i === 0) i += 0.2
    if (i === 1) i -= 0.0
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i > 10) i += 0.5
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    // if (i > 12) return interpolateSinebow(scale((i - 1) % count))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    const scaleX = scaleLinear()
      .domain([0, total + 1])
      .range([0, 1])
    if (i === 0) i += 0.2
    if (i === 1) i -= 0.0
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i > 10) i += 0.5
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 12) return interpolateSinebow(scaleX((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    const scaleX = scaleLinear()
      .domain([0, total + 1])
      .range([0, 1])
    if (i === 0) i += 0.2
    if (i === 1) i -= 0.0
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scaleX((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },

  () => bgColor,

  (i) => {
    const scaleX = scaleLinear()
      .domain([0, total + 2])
      .range([0, 1])
    if (i === 0) i += 0.2
    if (i === 1) i -= 0.0
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scaleX((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    const scaleX = scaleLinear()
      .domain([0, total + 1])
      .range([0, 1])
    if (i === 0) i += 0.2
    if (i === 1) i -= 0.0
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scaleX((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },

  () => bgColor,

  (i) => {
    const scaleX = scaleLinear()
      .domain([0, total + 1])
      .range([0, 1])
    if (i === 0) i += 0.1
    if (i === 1) i -= 0.3
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i === 23) i += 0.9
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scaleX((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    const scaleX = scaleLinear()
      .domain([0, total + 1])
      .range([0, 1])
    if (i === 0) i += 0.1
    if (i === 1) i -= 0.3
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scaleX((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    const scaleX = scaleLinear()
      .domain([0, total + 1])
      .range([0, 1])
    if (i === 0) i += 0.2
    if (i === 1) i -= 0.0
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scaleX((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    const scaleX = scaleLinear()
      .domain([0, total + 1])
      .range([0, 1])
    if (i === 0) i += 0.4
    if (i === 1) i -= 0.0
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scaleX((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    if (i === 0) i += 0.4
    if (i === 1) i -= 0.0
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scale((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },

  () => bgColor,

  (i) => {
    if (i === 0) i += 0.4
    if (i === 1) i -= 0.0
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1.8
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scale((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    if (i === 0) i += 0.4
    if (i === 1) i -= 0.0
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1
    if (i > 9) i += 0
    // if (i > 1) i += 0.01
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scale((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },

  () => bgColor,

  (i) => {
    if (i === 0) i += 0.4
    if (i === 1) i -= 0.0
    if (i > 3) i += 0.2
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1
    if (i > 9) i += 0
    // if (i > 1) i += 0.01
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scale((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    if (i === 0) i += 0.4
    if (i === 1) i -= 0.0
    if (i > 3) i += 0.1
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1
    if (i > 9) i += 0
    // if (i > 1) i += 0.01
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scale((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    if (i === 0) i += 0.4
    if (i === 1) i -= 0.0
    if (i > 3) i += 0.4
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1
    if (i > 9) i += 0
    // if (i > 1) i += 0.01
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scale((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },

  () => bgColor,

  (i) => {
    if (i === 0) i += 0.4
    if (i === 1) i -= 0.0
    if (i > 3) i += 0.4
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1
    if (i > 9) i += 0
    // if (i > 1) i += 0.01
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scale((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    if (i === 0) i += 0.3
    if (i === 1) i -= 0.0
    if (i > 3) i += 0.4
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1
    if (i > 9) i += 0
    // if (i > 1) i += 0.01
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scale((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    // count = count + 1
    if (i === 0) i += 0.6
    if (i === 1) i -= 0.0
    if (i > 3) i += 0.4
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1
    if (i > 9) i += 0
    // if (i > 1) i += 0.01
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scale((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    // count = count + 1
    if (i === 0) i += 0.6
    if (i === 1) i -= 0.0
    if (i > 3) i += 0.4
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1
    if (i > 9) i += 0
    // if (i > 1) i += 0.01
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scale((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    // count = count + 1
    if (i === 0) i += 0.6
    if (i === 1) i -= 0.0
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1
    if (i > 9) i += 0
    // if (i > 1) i += 0.01
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scale((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    // count = count + 1
    if (i === 0) i += 0.4
    if (i === 1) i -= 0.0
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1
    if (i > 9) i += 0
    // if (i > 1) i += 0.01
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scale((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    // count = count + 1
    if (i === 1) i -= 0.3
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1
    if (i > 9) i += 0
    // if (i > 1) i += 0.01
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scale((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },

  () => bgColor,

  (i) => {
    // count = count + 1
    if (i === 1) i -= 0.3
    if (i > 5) i -= 0.1
    if (i > 7) i += 0.01
    if (i > 8) i += 1
    if (i > 9) i += 0
    // if (i > 1) i += 0.01
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scale((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    // count = count + 1
    if (i === 1) i -= 0.4
    if (i > 5) i -= 0.2
    if (i > 7) i += 0.01
    if (i > 8) i += 1
    if (i > 9) i += 0
    // if (i > 1) i += 0.01
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scale((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    // count = count + 1
    if (i === 1) i -= 0.5
    if (i > 5) i -= 0.5
    if (i > 7) i += 0.01
    if (i > 8) i += 1
    if (i > 9) i += 0
    // if (i > 1) i += 0.01
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scale((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },

  () => bgColor,

  (i) => {
    // count = count + 1
    if (i === 1) i -= 0.5
    if (i > 5) i -= 0.5
    if (i > 7) i += 0.01
    if (i > 8) i += 1
    if (i > 9) i += 0
    // if (i > 1) i += 0.01
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scale((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },

  (i) => {
    // count = count + 1
    if (i === 1) i -= 0.5
    if (i > 5) i -= 0.5
    if (i > 7) i += 0.01
    if (i > 8) i += 0.3
    if (i > 9) i += 0.3
    // if (i > 1) i += 0.01
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scale((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },

  (i) => {
    // count = count + 1
    if (i > 5) i -= 0.5
    if (i > 7) i += 0.01
    if (i > 8) i += 0.3
    if (i > 9) i += 0.3
    // if (i > 1) i += 0.01
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scale((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },

  () => bgColor,

  (i) => {
    // count = count + 1
    if (i > 5) i -= 0.5
    if (i > 7) i += 0.01
    if (i > 8) i += 0.3
    if (i > 9) i += 0.3
    // if (i > 1) i += 0.01
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scale((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    // count = count + 1
    if (i > 7) i += 0.01
    if (i > 8) i += 0.3
    if (i > 9) i += 0.3
    // if (i > 1) i += 0.01
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 11) return interpolateSinebow(scale((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },

  (i) => {
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 8) return interpolateSinebow(scale((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },
  (i) => {
    if (i < 4) {
      return cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString()
    }
    if (i > 10) return interpolateSinebow(scale((i - 1) % total))
    return hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString()
  },

  () => bgColor,

  (i) => hsl((360 * ((i - 1) / total) + 1) % 360, 0.8, 0.5).toString(),
  (i) => cubehelix((360 * ((i - 1) / total) + 0) % 360, 2.0, 0.5).toString(),
  (i) => interpolateSinebow(scale((i - 1) % total)),
  (i) => interpolateRainbow(scale((i + 5) % total)),
  (i) => hcl((360 * ((i - 1) / total) + 30) % 360, 100, 60).toString(),
]
