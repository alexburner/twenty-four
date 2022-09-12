import { hsl, rgb } from 'd3-color'
import ryb2rgb from 'ryb2rgb'

export const getRYB = (n: number, total: number): string => {
  const colorHSL = hsl((360 * ((n - 1) / total) + 1) % 360, 0.8, 0.5)
  const colorRGB = rgb(colorHSL.toString())
  const colorRYB = ryb2rgb([colorRGB.r, colorRGB.g, colorRGB.b])
  return rgb(...colorRYB).toString()
}

export const getCircleXY = (
  radius: number,
  angle: number,
): [number, number] => {
  const radians = (Math.PI * 2 * angle) / 360
  const x = radius * Math.sin(radians)
  const y = radius * Math.cos(radians)
  return [x, y]
}

/**
 * (-1, 1) -> (0, 1)
 */
export const positiveNoise = (noise: number): number => (noise + 1) / 2
