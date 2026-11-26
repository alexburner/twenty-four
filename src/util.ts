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
  if (num === Infinity) return 'infinity'

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
export const getPolygonName = (n: number): string => {
  if (n === Infinity) return 'circle'

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

/**
 * Returns the Greek-rooted alphabetic simplex name for any dimension `d`
 * from -1 up to 999,999, plus Infinity.
 */
export function getSimplexName(dimension: number): string {
  if (dimension === Infinity) {
    return 'ω-simplex'
  }

  if (
    !Number.isInteger(dimension) ||
    dimension < -1 ||
    dimension >= 1_000_000
  ) {
    throw new RangeError(
      'Dimension must be an integer between -1 and 999,999, or Infinity.',
    )
  }

  const baseNames: Record<number, string> = {
    [-1]: 'void',
    0: 'point',
    1: 'line',
    2: 'triangle',
  }

  const baseName = baseNames[dimension]
  if (baseName !== undefined) {
    return baseName
  }

  const facetCount = dimension + 1
  const prefix = getGreekPrefix(facetCount)
  const suffix = getDimensionalSuffix(dimension)

  // Elide trailing vowel on prefix if suffix starts with a vowel (e.g., penta + exon -> pentexon)
  const cleanPrefix = /^[aeiouy]/i.test(suffix)
    ? prefix.replace(/[aeiou]$/i, '')
    : prefix

  return `${cleanPrefix}${suffix}`
}

/**
 * Generates standard Greek numerical prefixes (facet counts) from 1 to 999,999.
 */
function getGreekPrefix(n: number): string {
  if (n >= 1000) {
    const thousands = Math.floor(n / 1000)
    const remainder = n % 1000
    const thousandPrefix =
      thousands === 1 ? 'chilia' : `${getGreekPrefix(thousands)}chilia`
    return remainder === 0
      ? thousandPrefix
      : `${thousandPrefix}${getGreekPrefix(remainder)}`
  }

  const hundreds = [
    '',
    'hecto',
    'dihecto',
    'trihecto',
    'tetrahecto',
    'pentahecto',
    'hexahecto',
    'heptahecto',
    'octahecto',
    'enneahecto',
  ] as const

  const tens = [
    '',
    'deca',
    'icosa',
    'triaconta',
    'tetraconta',
    'pentaconta',
    'hexaconta',
    'heptaconta',
    'octaconta',
    'enneaconta',
  ] as const

  const teens: Record<number, string> = {
    10: 'deca',
    11: 'hendeca',
    12: 'dodeca',
    13: 'triskaideca',
    14: 'tetrakaideca',
    15: 'pentakaideca',
    16: 'hexakaideca',
    17: 'heptakaideca',
    18: 'octakaideca',
    19: 'enneakaideca',
  }

  const ones = [
    '',
    'hen',
    'di',
    'tri',
    'tetra',
    'penta',
    'hexa',
    'hepta',
    'octa',
    'ennea',
  ] as const

  const hundredDigit = Math.floor(n / 100)
  const rem100 = n % 100
  const hundredStr = hundreds[hundredDigit] ?? ''

  if (rem100 === 0) return hundredStr

  let remStr = ''
  if (rem100 < 10) {
    remStr = ones[rem100] ?? ''
  } else if (rem100 < 20) {
    remStr = teens[rem100] ?? ''
  } else {
    const tenDigit = Math.floor(rem100 / 10)
    const oneDigit = rem100 % 10
    const tenStr = tens[tenDigit] ?? ''
    const oneStr = ones[oneDigit] ?? ''

    if (oneDigit === 0) {
      remStr = tenStr
    } else if (tenDigit === 2 && oneDigit === 1) {
      remStr = 'henicosa'
    } else {
      remStr = `${oneStr}kai${tenStr}`
    }
  }

  return `${hundredStr}${remStr}`
}

/**
 * Generates Jonathan Bowers' extended polytope dimensional suffixes from 3 to 999,999.
 */
function getDimensionalSuffix(d: number): string {
  const fixedSuffixes: Record<number, string> = {
    3: 'hedron',
    4: 'choron',
    5: 'teron',
    6: 'peton',
    7: 'exon',
    8: 'zetton',
    9: 'yotton',
    10: 'xennon',
    11: 'dakon',
    12: 'hendon',
    13: 'dokon',
    14: 'tradakon',
    15: 'tedakon',
    16: 'pedakon',
    17: 'exdakon',
    18: 'zedakon',
    19: 'yodakon',
  }

  const fixed = fixedSuffixes[d]
  if (fixed !== undefined) {
    return fixed
  }

  // Bowers' contracted dimensional roots for higher numbers
  const hundreds = [
    '',
    'hectot',
    'dohectot',
    'trihectot',
    'trahectot',
    'tehectot',
    'pehectot',
    'exhectot',
    'zehectot',
    'yohectot',
  ] as const

  const tens = [
    '',
    'dak',
    'icos',
    'triacon',
    'tracon',
    'tecon',
    'pecon',
    'exacon',
    'zecon',
    'yocon',
  ] as const

  const ones = [
    '',
    'hen',
    'do',
    'tri',
    'tra',
    'te',
    'pe',
    'ex',
    'ze',
    'yo',
  ] as const

  const buildRoot = (num: number): string => {
    if (num >= 1000) {
      const k = Math.floor(num / 1000)
      const rem = num % 1000
      const kRoot = k === 1 ? 'chiliot' : `${buildRoot(k)}chiliot`
      return rem === 0 ? kRoot : `${kRoot}${buildRoot(rem)}`
    }

    const h = Math.floor(num / 100)
    const rem100 = num % 100
    const t = Math.floor(rem100 / 10)
    const o = rem100 % 10

    // Handle 11-19 when appearing inside hundreds/thousands (e.g., 114 -> hectottradak)
    if (rem100 >= 11 && rem100 <= 19) {
      const teenSuffix = fixedSuffixes[rem100]?.replace(/on$/, '') ?? ''
      return `${hundreds[h] ?? ''}${teenSuffix}`
    }

    const hStr = hundreds[h] ?? ''
    const tStr = tens[t] ?? ''
    const oStr = ones[o] ?? ''

    // Add vowel bridge 'a' if tens ends in consonant and ones starts with consonant (e.g., icos + ped -> icosaped)
    const needsBridge =
      tStr.length > 0 &&
      oStr.length > 0 &&
      !/[aeiou]$/.test(tStr) &&
      !/^[aeiou]/.test(oStr)
    const bridge = needsBridge ? 'a' : ''

    return `${hStr}${tStr}${bridge}${oStr}`
  }

  const root = buildRoot(d)
  // Ensure clean ending in "-on" without double 'o'
  return root.endsWith('o') ? `${root}n` : `${root}on`
}
