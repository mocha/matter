import type { Device, LightDevice, LockDevice } from "@/lib/types/device"

export function isLightDevice(device: Device): device is LightDevice {
  return device.type?.toLowerCase().trim() === 'light'
}

export function isLockDevice(device: Device): device is LockDevice {
  return device.type?.toLowerCase().trim() === 'lock'
} 