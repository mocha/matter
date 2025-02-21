import { Badge } from "@/components/ui/badge"
import type { SensorDevice } from "@/lib/schema/device"

interface SensorDeviceDetailsProps {
  device: SensorDevice
}

export function SensorDeviceDetails({ device }: SensorDeviceDetailsProps) {
  const { device_info } = device

  return (
    <dl className="device-details">
      {device_info?.sensors_contact && (
        <div>
          <dt className="font-medium">Contact Sensor</dt>
          <dd><Badge variant="secondary">Yes</Badge></dd>
        </div>
      )}
      {device_info?.sensors_temperature && (
        <div>
          <dt className="font-medium">Temperature Sensor</dt>
          <dd><Badge variant="secondary">Yes</Badge></dd>
        </div>
      )}
      {device_info?.sensors_humidity && (
        <div>
          <dt className="font-medium">Humidity Sensor</dt>
          <dd><Badge variant="secondary">Yes</Badge></dd>
        </div>
      )}
      {device_info?.sensors_illuminance && (
        <div>
          <dt className="font-medium">Illuminance Sensor</dt>
          <dd><Badge variant="secondary">Yes</Badge></dd>
        </div>
      )}
      {device_info?.sensors_air_quality && (
        <div>
          <dt className="font-medium">Air Quality Sensor</dt>
          <dd><Badge variant="secondary">Yes</Badge></dd>
        </div>
      )}
      {device_info?.sensors_sound && (
        <div>
          <dt className="font-medium">Sound Sensor</dt>
          <dd><Badge variant="secondary">Yes</Badge></dd>
        </div>
      )}
      {device_info?.sensors_air_pressure && (
        <div>
          <dt className="font-medium">Air Pressure Sensor</dt>
          <dd><Badge variant="secondary">Yes</Badge></dd>
        </div>
      )}
      {device_info?.battery && (
        <div>
          <dt className="font-medium">Battery</dt>
          <dd><Badge variant="secondary">Yes</Badge></dd>
        </div>
      )}
      {device_info?.battery_type && (
        <div>
          <dt className="font-medium">Battery Type</dt>
          <dd className="text-muted-foreground">{device_info.battery_type}</dd>
        </div>
      )}
    </dl>
  )
} 