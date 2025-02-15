type RGBColor = {
  r: number
  g: number
  b: number
}

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

/**
 * Converts from K to RGB, algorithm courtesy of
 * http://www.tannerhelland.com/4435/convert-temperature-rgb-algorithm-code/
 * @param tmpKelvin Temperature (in Kelvin) between 1000 and 40000
 * @returns RGB channel intensities (0-255)
 */
export function convertKelvinToRGB(tmpKelvin: number): [number, number, number] {
  // All calculations require tmpKelvin \ 100, so only do the conversion once
  tmpKelvin = clamp(tmpKelvin, 1000, 8000) / 100

  // Calculate each channel
  const r = tmpKelvin <= 66 ? 255 : clamp(329.698727446 * Math.pow(tmpKelvin - 60, -0.1332047592), 0, 255)

  const g =
    tmpKelvin <= 66
      ? clamp(99.4708025861 * Math.log(tmpKelvin) - 161.1195681661, 0, 255)
      : clamp(288.1221695283 * Math.pow(tmpKelvin - 60, -0.0755148492), 0, 255)

  const b =
    tmpKelvin >= 66
      ? 255
      : tmpKelvin <= 19
        ? 0
        : clamp(138.5177312231 * Math.log(tmpKelvin - 10) - 305.0447927307, 0, 255)

  return [Math.round(r), Math.round(g), Math.round(b)]
}

