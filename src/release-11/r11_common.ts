import paper from 'paper'

export const BLEED = 36
export const VIS_WIDTH = 300 * 2.75
export const VIS_HEIGHT = 300 * 4.75
export const CANVAS_W = VIS_WIDTH + BLEED * 2
export const CANVAS_H = VIS_HEIGHT + BLEED * 2
export const SWATCH_HEIGHT = VIS_HEIGHT * 0.088

const GIANT_LIMIT = 40

export const getSwatchColor = (n: number, total: number): paper.Color => {
  // const t = n / (total + 1) // t goes from 0.0 to 1.0
  // return n < GIANT_LIMIT
  //   ? new paper.Color(getOklch(t, total))
  //   : new paper.Color(getOklch(t, total))
  return new paper.Color({
    hue: n < GIANT_LIMIT ? getAdvancedHue(n, total) : getAdvancedHue(24, 24),
    // saturation: 0.42,
    // brightness: 0.99,
    // saturation: 0.8,
    // brightness: 0.85,
    saturation: 0.95,
    brightness: 0.75,
  })
}

export const getAdvancedHue = (n: number, total: number): number => {
  const hue = ((360 * ((n - 1) / (total + 1))) % 360) - 0
  // if (n === 0) n = total + 1
  // const t = n / (total + 1) // t goes from 0.0 to 1.0
  // const hue = getRemappedHue(t)
  return hue
}

interface RemapThing {
  t: number
  h: number
}

// --- 2. Remapped Hue ---
// Stretches out the lower hue values using piecewise linear interpolation.
// https://share.gemini.google/toQTxRKtnx5j
export const getRemappedHue = (t: number): number => {
  const deltas: RemapThing[] = [
    { t: 0, h: 0 },
    { t: 0.13, h: 40 }, // red/orange
    { t: 0.11, h: 50 }, // yellow/yellow-green
    { t: 0.18, h: 120 }, // greens/cyans
    { t: 0.22, h: 75 }, // blues/purples
    { t: 0.1, h: 75 }, // pinks
  ]

  // Define mapping stops: { t: input_fraction, h: output_hue }
  const stops: RemapThing[] = []
  let cumulativeT = 0
  let cumulativeH = 0
  for (const delta of deltas) {
    cumulativeT += delta.t
    cumulativeH += delta.h
    stops.push({ t: cumulativeT, h: cumulativeH })
  }

  const normalizeT = 1.0 / cumulativeT
  const normalizeH = 360.0 / cumulativeH
  for (const stop of stops) {
    stop.t *= normalizeT
    stop.h *= normalizeH
  }

  let remappedHue = 360

  // Find which segment 't' falls into and interpolate
  for (let i = 0; i < stops.length - 1; i++) {
    const currStop = stops[i]
    const nextStop = stops[i + 1]
    if (!currStop || !nextStop) break
    if (t >= currStop.t && t <= nextStop.t) {
      const rangeT = nextStop.t - currStop.t
      const rangeH = nextStop.h - currStop.h
      const localT = (t - currStop.t) / rangeT
      remappedHue = currStop.h + localT * rangeH
      break
    }
  }

  return remappedHue
}

// --- 3. Oklch ---
// Modern CSS perceptually uniform color space. Lightness and Chroma are fixed.
export const getOklch = (t: number, numCards: number): string => {
  const h = ((t - 0.3 / numCards) * 360 + 360 / numCards) % 360
  // Lightness (0-1), Chroma (approx 0-0.4), Hue (0-360)
  // return `oklch(0.68 0.16 ${h})`;
  // return `oklch(0.7 0.25 ${h})`;
  // return `oklch(0.75 0.34 ${h})` // <- curr fave
  // return `oklch(0.775 0.34 ${h})`;
  // return `oklch(0.72 0.25 ${h})`;
  // return `oklch(0.62 0.28 ${h})`;
  // return `oklch(0.6 0.3 ${h})`;
  // return `oklch(0.73 0.3 ${h})` // <- slightly subtle
  return `oklch(0.8 0.2 ${h})`
}
