import { convertKelvinToRGB } from "./temp-converter"

export function getColorTempGradientStyle(start: number | null, end: number | null): React.CSSProperties {
  if (!start || !end) return {};
  const [startR, startG, startB] = convertKelvinToRGB(start)
  const [endR, endG, endB] = convertKelvinToRGB(end)
  
  return {
    background: `linear-gradient(to right, rgba(${startR}, ${startG}, ${startB}, 0.3), rgba(${endR}, ${endG}, ${endB}, 0.3))`,
    padding: "0.5rem",
    borderRadius: "0.25rem",
    width: "100%",
    display: "block",
  }
} 