import { hsl, rgb } from 'd3-color'
import ryb2rgb from 'ryb2rgb'

export const getIntroHue = (n: number, total: number): number => {
  // let hue = ((360 * ((n - 1) / (total + 0))) % 360) - 18
  // if (n === 1) hue += 18
  // if (n === 2) hue += 16
  // if (n === 3) hue += 0
  // if (n === 4) hue -= 9
  // if (n === 5) hue -= 6
  // if (n === 6) hue -= 6
  // if (n === 7) hue -= 6
  // if (n === 8) hue -= 6
  // if (n === 9) hue -= 6
  // if (n === 10) hue -= 6
  // let hue = ((360 * ((n - 1) / (total + 0))) % 360) - 22
  // if (n === 1) hue += 22
  // if (n === 2) hue += 11
  const hue = ((360 * ((n - 1) / (total + 1))) % 360) - 12
  return hue
}

export const getAdvancedHue = (n: number, total: number): number => {
  const hue = ((360 * ((n - 1) / (total + 1))) % 360) - 0
  return hue
}

export const getRYB = (n: number, total: number): string => {
  const colorHSL = hsl((360 * ((n - 1) / total) + 1) % 360, 0.8, 0.5)
  const colorRGB = rgb(colorHSL.toString())
  const colorRYB = ryb2rgb([colorRGB.r, colorRGB.g, colorRGB.b])
  return rgb(...colorRYB).toString()
}
