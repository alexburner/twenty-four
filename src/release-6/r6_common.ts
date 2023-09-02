export const getAdvancedHue = (n: number, total: number): number => {
  const hue = ((360 * ((n - 0) / (total - 1))) % 360) - 0
  return hue
}

export const oneDotRadius = 6
