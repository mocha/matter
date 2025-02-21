import { notFound } from "next/navigation"
import { readFileSync } from 'fs'
import { join } from 'path'
import type { Metadata } from 'next'
import type { Device } from "@/lib/schema/device"
import { ClientDeviceDetails } from "@/components/devices/client-device-details"
import { isLightDevice, isLockDevice } from "@/lib/utils/type-guards"

function getAllDevices(): Device[] {
  try {
    const filePath = join(process.cwd(), 'public', 'device-data.json')
    const jsonData = readFileSync(filePath, 'utf8')
    const devices = JSON.parse(jsonData)
    return devices
  } catch (error) {
    console.error('Error loading device data:', error)
    throw error // Let Next.js handle the error during build
  }
}

// Generate static paths for all devices
export function generateStaticParams() {
  const devices = getAllDevices()
  return devices.map((device) => ({
    id: device.id // Use exact ID from data file
  }))
}

// Generate dynamic metadata for each device page
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const devices = getAllDevices()
  const device = devices.find(d => d.id === params.id)
  
  if (!device) {
    return {
      title: 'Device Not Found',
    }
  }

  const keywords = [
    'specifications',
    isLightDevice(device) ? device.device_info?.socket : undefined,
    isLightDevice(device) ? device.device_info?.led_category : undefined,
  ].filter(Boolean) as string[]  // Filter out nullish values

  const metadata: Metadata = {
    title: `${device.general_info.make} ${device.general_info.model} - Matter Device Directory`,
    description: `Specifications and details for the ${device.general_info.make} ${device.general_info.model} Matter-compatible ${device.general_info.type}`,
    openGraph: {
      title: `${device.general_info.make} ${device.general_info.model}`,
      description: `Matter-compatible ${device.type}`,
      type: 'article',
    },
    keywords: keywords,
  }

  return metadata
}

export default function DevicePage({ params }: { params: { id: string } }) {
  const devices = getAllDevices()
  const device = devices.find(d => d.id === params.id)
  
  if (!device) {
    notFound()
  }

  return (
    <main className="container py-6">
      <ClientDeviceDetails device={device} />
    </main>
  )
}

