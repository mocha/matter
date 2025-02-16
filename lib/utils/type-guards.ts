import type { Device, LightDevice, LockDevice } from "@/lib/types/device"

export function isLightDevice(device: Device): device is LightDevice {
  return device.general_info.type === 'light'
}

export function isLockDevice(device: Device): device is LockDevice {
  return device.general_info.type === 'lock'
} 