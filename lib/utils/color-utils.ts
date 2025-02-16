import { convertKelvinToRGB } from "./temp-converter"

export function getColorTempGradientStyle(startK: number, endK: number) {
  const [startR, startG, startB] = convertKelvinToRGB(startK)
  const [endR, endG, endB] = convertKelvinToRGB(endK)
  
  return {
    background: `linear-gradient(to right, rgba(${startR}, ${startG}, ${startB}, 0.3), rgba(${endR}, ${endG}, ${endB}, 0.3))`,
    padding: "0.5rem",
    borderRadius: "0.25rem",
    width: "100%",
    display: "block",
  }
} 