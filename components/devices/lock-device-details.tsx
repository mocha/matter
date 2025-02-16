import { Badge } from "@/components/ui/badge"
import type { LockDevice } from "@/lib/types/device"

interface LockDeviceDetailsProps {
  device: LockDevice
}

export function LockDeviceDetails({ device }: LockDeviceDetailsProps) {
  const { device_info } = device

  // Group unlock methods for better organization
  const unlockMethods = [
    { key: 'unlock_with_pin', label: 'PIN' },
    { key: 'unlock_with_rfid', label: 'RFID' },
    { key: 'unlock_with_fingerprint', label: 'Fingerprint' },
    { key: 'unlock_with_facial_recognition', label: 'Face Recognition' },
    { key: 'unlock_with_proprietary', label: 'Proprietary', variant: 'destructive' as const },
  ].filter(method => device_info[method.key as keyof typeof device_info])

  // Group connectivity methods
  const connectivityMethods = [
    { key: 'bluetooth', label: 'Bluetooth' },
    { key: 'wifi', label: 'WiFi' },
  ].filter(method => device_info[method.key as keyof typeof device_info])

  return (
    <dl className="device-details">
      {unlockMethods.length > 0 && (
        <div>
          <dt className="font-medium">Unlock Methods</dt>
          <dd className="flex flex-wrap gap-2">
            {unlockMethods.map(method => (
              <Badge key={method.key} variant={method.variant}>
                {method.label}
              </Badge>
            ))}
          </dd>
        </div>
      )}

      {connectivityMethods.length > 0 && (
        <div>
          <dt className="font-medium">Connectivity</dt>
          <dd className="flex flex-wrap gap-2">
            {connectivityMethods.map(method => (
              <Badge key={method.key} variant="secondary">
                {method.label}
              </Badge>
            ))}
          </dd>
        </div>
      )}

      {device_info.battery && (
        <div>
          <dt className="font-medium">Power</dt>
          <dd className="text-muted-foreground">
            Battery {device_info.battery_type && `(${device_info.battery_type})`}
          </dd>
        </div>
      )}
    </dl>
  )
} 