declare module 'ryb2rgb' {
  type Color = [number, number, number]
  const ryb2rgb: (input: Color) => Color
  export = ryb2rgb
}
