import type { Device, LightDevice, LockDevice } from "@/lib/types/device"
import type { ColumnConfig, ColumnPath } from "@/lib/types/columns"
import { isLightDevice, isLockDevice } from "./type-guards"

// Helper to filter out null/undefined values
function filterNullish<T>(arr: (T | null | undefined)[]): T[] {
  return arr.filter((item): item is T => item != null)
}

// Device-specific search fields
export function getSearchFields(device: Device): string[] {
  const baseFields = filterNullish([
    device.general_info.make,
    device.general_info.model,
    device.product_info?.name,
    device.product_info?.sku,
    device.product_info?.ean_or_upc,
  ])

  if (isLightDevice(device)) {
    return filterNullish([
      ...baseFields,
      device.device_info.socket,
      device.device_info.led_category,
    ])
  }

  if (isLockDevice(device)) {
    const methods = []
    if (device.device_info.unlock_with_pin) methods.push('PIN')
    if (device.device_info.unlock_with_rfid) methods.push('RFID')
    if (device.device_info.unlock_with_fingerprint) methods.push('Fingerprint')
    return [...baseFields, ...methods]
  }

  return baseFields
}

// Type-safe column path creator
function createColumnPath<T extends Device>(fn: (device: T) => string | null | undefined): ColumnPath {
  return (device: Device) => {
    if (fn(device as T) != null) {
      return fn(device as T)
    }
    return null
  }
}

// Device-specific column configurations
export const DEVICE_COLUMNS: Record<'light' | 'lock', ColumnConfig[]> = {
  light: [
    { 
      key: "socket", 
      label: "Socket", 
      group: "Device", 
      path: createColumnPath<LightDevice>(d => d.device_info.socket)
    },
    { 
      key: "bulb_shape", 
      label: "Bulb Shape", 
      group: "Device", 
      path: createColumnPath<LightDevice>(d => d.device_info.bulb_shape)
    },
    { 
      key: "led_category", 
      label: "LED Category", 
      group: "Device", 
      path: createColumnPath<LightDevice>(d => d.device_info.led_category)
    },
    { 
      key: "brightness_lm", 
      label: "Brightness (lm)", 
      group: "Device", 
      path: createColumnPath<LightDevice>(d => d.device_info.brightness_lm?.toString())
    },
    { 
      key: "color_temp_range", 
      label: "Color Temp Range", 
      group: "Device", 
      path: createColumnPath<LightDevice>(d => {
        if (d.device_info.white_color_temp_range_k_start && d.device_info.white_color_temp_range_k_end) {
          return `${d.device_info.white_color_temp_range_k_start}K-${d.device_info.white_color_temp_range_k_end}K`
        }
        return null
      })
    },
  ],
  lock: [
    { 
      key: "unlock_methods", 
      label: "Unlock Methods", 
      group: "Device", 
      path: createColumnPath<LockDevice>(d => {
        const methods = []
        if (d.device_info.unlock_with_pin) methods.push('PIN')
        if (d.device_info.unlock_with_rfid) methods.push('RFID')
        if (d.device_info.unlock_with_fingerprint) methods.push('Fingerprint')
        if (d.device_info.unlock_with_facial_recognition) methods.push('Face')
        return methods.join(', ') || null
      })
    },
    { 
      key: "connectivity", 
      label: "Connectivity", 
      group: "Device", 
      path: createColumnPath<LockDevice>(d => {
        const methods = []
        if (d.device_info.bluetooth) methods.push('Bluetooth')
        if (d.device_info.wifi) methods.push('WiFi')
        return methods.join(', ') || null
      })
    },
    { 
      key: "power", 
      label: "Power", 
      group: "Device", 
      path: createColumnPath<LockDevice>(d => 
        d.device_info.battery_type ? `Battery (${d.device_info.battery_type})` : null
      )
    },
  ]
} 