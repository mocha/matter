import { Badge } from "@/components/ui/badge"
import type { ControllerDevice } from "@/lib/schema/device"

interface ControllerDeviceDetailsProps {
  device: ControllerDevice
}

export function ControllerDeviceDetails({ device }: ControllerDeviceDetailsProps) {
  const { device_info } = device

  return (
    <dl className="device-details">
      {device_info?.hub_type && (
        <div>
          <dt className="font-medium">Hub Type</dt>
          <dd className="text-muted-foreground">{device_info.hub_type}</dd>
        </div>
      )}
      {device_info?.max_child_devices && (
        <div>
          <dt className="font-medium">Max Child Devices</dt>
          <dd className="text-muted-foreground">{device_info.max_child_devices}</dd>
        </div>
      )}
      {device_info?.ethernet_port !== null && (
        <div>
          <dt className="font-medium">Ethernet Port</dt>
          <dd><Badge variant={device_info?.ethernet_port ? "secondary" : "outline"}>
            {device_info?.ethernet_port ? "Yes" : "No"}
          </Badge></dd>
        </div>
      )}
      {device_info?.usb_port !== null && (
        <div>
          <dt className="font-medium">USB Port</dt>
          <dd><Badge variant={device_info?.usb_port ? "secondary" : "outline"}>
            {device_info?.usb_port ? "Yes" : "No"}
          </Badge></dd>
        </div>
      )}
      {device_info?.battery_backup !== null && (
        <div>
          <dt className="font-medium">Battery Backup</dt>
          <dd><Badge variant={device_info?.battery_backup ? "secondary" : "outline"}>
            {device_info?.battery_backup ? "Yes" : "No"}
          </Badge></dd>
        </div>
      )}
      {device_info?.ir_controller !== null && (
        <div>
          <dt className="font-medium">IR Controller</dt>
          <dd><Badge variant={device_info?.ir_controller ? "secondary" : "outline"}>
            {device_info?.ir_controller ? "Yes" : "No"}
          </Badge></dd>
        </div>
      )}
      {device_info?.supports_device_types && device_info.supports_device_types.length > 0 && (
        <div>
          <dt className="font-medium">Supported Devices</dt>
          <dd className="flex flex-wrap gap-1">
            {device_info.supports_device_types.map((type) => (
              <Badge key={type} variant="secondary">{type}</Badge>
            ))}
          </dd>
        </div>
      )}
    </dl>
  )
} 