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
