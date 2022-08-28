export const getIntroHue = (n: number, total: number): number => {
  let hue = ((360 * ((n - 1) / (total + 0))) % 360) - 18
  if (n === 1) hue += 16
  if (n === 2) hue += 12
  if (n === 3) hue += 0
  if (n === 4) hue -= 9
  if (n === 5) hue -= 6
  if (n === 6) hue -= 6
  if (n === 7) hue -= 6
  if (n === 8) hue -= 6
  if (n === 9) hue -= 6
  if (n === 10) hue -= 6
  // hue = (360 * ((n - 1) / (total + 0))) % 360
  return hue
}
