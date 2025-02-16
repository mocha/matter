import { Badge } from "@/components/ui/badge"
import type { LightDevice } from "@/lib/types/device"

interface LightDeviceDetailsProps {
  device: LightDevice
}

export function LightDeviceDetails({ device }: LightDeviceDetailsProps) {
  const { device_info } = device

  return (
    <dl className="device-details">
      {device_info.socket && (
        <div>
          <dt className="font-medium">Socket</dt>
          <dd className="text-muted-foreground">{device_info.socket}</dd>
        </div>
      )}
      {device_info.bulb_shape && (
        <div>
          <dt className="font-medium">Bulb Shape</dt>
          <dd className="text-muted-foreground">{device_info.bulb_shape}</dd>
        </div>
      )}
      {device_info.style && (
        <div>
          <dt className="font-medium">Style</dt>
          <dd className="text-muted-foreground">{device_info.style}</dd>
        </div>
      )}
      {device_info.led_category && (
        <div>
          <dt className="font-medium">LED Category</dt>
          <dd className="text-muted-foreground">{device_info.led_category}</dd>
        </div>
      )}
      {(device_info.housing_material || device_info.bulb_lens_material) && (
        <div>
          <dt className="font-medium">Materials</dt>
          <dd className="text-muted-foreground">
            {device_info.housing_material && (
              <>Housing: {device_info.housing_material}</>
            )}
            {device_info.housing_material && device_info.bulb_lens_material && <br />}
            {device_info.bulb_lens_material && (
              <>Lens: {device_info.bulb_lens_material}</>
            )}
          </dd>
        </div>
      )}
      {device_info.brightness_lm && (
        <div>
          <dt className="font-medium">Brightness</dt>
          <dd className="text-muted-foreground">{device_info.brightness_lm} lumens</dd>
        </div>
      )}
      {device_info.rated_power_w && (
        <div>
          <dt className="font-medium">Rated Power</dt>
          <dd className="text-muted-foreground">{device_info.rated_power_w}W</dd>
        </div>
      )}
      {device_info.eqiv_power_w && (
        <div>
          <dt className="font-medium">Equivalent Power</dt>
          <dd className="text-muted-foreground">{device_info.eqiv_power_w}W</dd>
        </div>
      )}
      {device_info.beam_angle_deg && (
        <div>
          <dt className="font-medium">Beam Angle</dt>
          <dd className="text-muted-foreground">{device_info.beam_angle_deg}°</dd>
        </div>
      )}
      {device_info.white_color_temp_range_k_start && device_info.white_color_temp_range_k_end && (
        <div>
          <dt className="font-medium">Color Temperature Range</dt>
          <dd className="text-muted-foreground">
            {device_info.white_color_temp_range_k_start}K - {device_info.white_color_temp_range_k_end}K
          </dd>
        </div>
      )}
      {device_info.color_rendering_index_cri && (
        <div>
          <dt className="font-medium">Color Rendering Index (CRI)</dt>
          <dd className="text-muted-foreground">{device_info.color_rendering_index_cri}</dd>
        </div>
      )}
    </dl>
  )
} 