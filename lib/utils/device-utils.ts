import type { Device, LightDevice, LockDevice } from "@/lib/schema/device"
import { SHARED_COLUMNS, DEVICE_COLUMNS } from "@/lib/types/columns"

export function isLightDevice(device: Device): device is LightDevice {
  return device.type === 'light';
}

export function isLockDevice(device: Device): device is LockDevice {
  return device.type === 'lock';
}

// Device-specific search fields
export function getSearchFields(device: Device): string[] {
  const baseFields = [
    device.general_info.make,
    device.general_info.model,
    device.product_info?.name,
    device.product_info?.sku,
    device.product_info?.ean_or_upc,
  ].filter((field): field is string => field != null);

  if (isLightDevice(device)) {
    return [
      ...baseFields,
      device.device_info.socket,
      device.device_info.bulb_shape,
    ].filter((field): field is string => field != null);
  }

  if (isLockDevice(device)) {
    const methods = [
      device.device_info.unlock_with_pin && 'PIN',
      device.device_info.unlock_with_rfid && 'RFID',
    ].filter(Boolean) as string[];
    return [...baseFields, ...methods];
  }

  return baseFields;
}

export function filterDevices(
  devices: Device[],
  searchTerm: string,
  filters: Record<string, Set<string>>
): Device[] {
  return devices.filter(device => {
    // Search term filtering
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const searchableFields = [
        device.general_info.make,
        device.general_info.model,
        device.product_info?.name,
        device.product_info?.sku
      ]
      if (!searchableFields.some(field => 
        field && field.toLowerCase().includes(searchLower)
      )) {
        return false
      }
    }

    // Filter criteria
    return Object.entries(filters).every(([key, values]) => {
      if (!values.size) return true
      const column = [...SHARED_COLUMNS, ...DEVICE_COLUMNS[device.type]]
        .find(col => col.key === key)
      if (!column) return true
      const value = String(column.path(device))
      return values.has(value)
    })
  })
} 