export const getAdvancedHue = (n: number, total: number): number => {
  const hue = ((360 * ((n - 1) / (total + 0))) % 360) - 0
  return hue
}

export const oneDotRadius = 10
