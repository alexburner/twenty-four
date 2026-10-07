import { hsl, rgb } from 'd3-color'
import ryb2rgb from 'ryb2rgb'

export const getRYB = (
  n: number,
  total: number,
  hue = (360 * ((n - 1) / total) + 1) % 360,
  saturation = 0.8,
  lightness = 0.5,
): string => {
  const colorHSL = hsl(hue, saturation, lightness)
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

/**
 * Convert a number to its English word representation
 */

const ONES = [
  '',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
]

const TENS = [
  '',
  '',
  'twenty',
  'thirty',
  'forty',
  'fifty',
  'sixty',
  'seventy',
  'eighty',
  'ninety',
]

export const numberToWords = (num: number): string => {
  if (num === 0) return 'zero'

  let words = ''

  // Handle Hundreds
  if (Math.floor(num / 100) > 0) {
    words += ONES[Math.floor(num / 100)] + ' hundred '
    num %= 100
  }

  // Handle Tens and Ones
  if (num > 0) {
    if (num < 20) {
      words += ONES[num]
    } else {
      words += TENS[Math.floor(num / 10)]
      if (num % 10 > 0) {
        words += ' ' + ONES[num % 10]
      }
    }
  }

  return words.trim()
}

/**
 * Convert a number to its Greek polygon name
 */
export const polygonName = (n: number): string => {
  if (!Number.isInteger(n) || n < 0 || n > 360) {
    throw new RangeError('n must be an integer from 0 to 360')
  }

  // Traditional/common names we want to preserve
  const special: Record<number, string> = {
    0: 'void',
    1: 'point',
    2: 'line',
    3: 'triangle',
    4: 'square',
    5: 'pentagon',
    6: 'hexagon',
    7: 'heptagon',
    8: 'octagon',
    9: 'nonagon',
    10: 'decagon',
    11: 'hendecagon',
    12: 'dodecagon',
    13: 'tridecagon',
    14: 'tetradecagon',
    15: 'pentadecagon',
    16: 'hexadecagon',
    17: 'heptadecagon',
    18: 'octadecagon',
    19: 'nonadecagon',
    20: 'icosagon',
  }

  if (special[n]) {
    return special[n] || 'unreachable'
  }

  const ones: Record<number, string> = {
    1: 'hen',
    2: 'di',
    3: 'tri',
    4: 'tetra',
    5: 'penta',
    6: 'hexa',
    7: 'hepta',
    8: 'octa',
    9: 'nona',
  }

  const tens: Record<number, string> = {
    10: 'deca',
    20: 'icosa',
    30: 'triaconta',
    40: 'tetraconta',
    50: 'pentaconta',
    60: 'hexaconta',
    70: 'heptaconta',
    80: 'octaconta',
    90: 'nonaconta',
  }

  const hundreds: Record<number, string> = {
    100: 'hecta',
    200: 'dihecta',
    300: 'trihecta',
  }

  let name = ''

  // Hundreds
  if (n >= 100) {
    const h = Math.floor(n / 100) * 100
    name += hundreds[h]
    n %= 100
  }

  // Tens
  if (n >= 10) {
    const t = Math.floor(n / 10) * 10
    name += tens[t]
    n %= 10
  }

  // Ones
  if (n > 0) {
    name += ones[n]
  }

  return name + 'gon'
}
