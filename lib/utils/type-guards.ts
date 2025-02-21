import type { ControllerDevice, Device, LightDevice, LockDevice, SensorDevice } from "@/lib/schema/device"

export function isLightDevice(device: Device): device is LightDevice {
  return device.type?.toLowerCase().trim() === 'light'
}

export function isLockDevice(device: Device): device is LockDevice {
  return device.type?.toLowerCase().trim() === 'lock'
}

export function isSensorDevice(device: Device): device is SensorDevice {
  return device.type === 'sensor';
} 

export function isControllerDevice(device: Device): device is ControllerDevice {
  return device.type === 'controller';
} 