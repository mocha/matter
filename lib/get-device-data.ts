import deviceData from '../public/device-data.json'

export function getAllDevices() {
  return deviceData
}

export function getDeviceById(id: string) {
  return deviceData.find(device => device.id === id)
} 