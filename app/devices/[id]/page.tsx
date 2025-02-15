import { notFound } from "next/navigation"
import { DeviceDetails } from "@/components/devices/device-details"
import { getDevice } from "@/lib/utils/get-devices"
import { getAllDevices } from "@/lib/get-device-data"
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const devices = getAllDevices()
  return devices.map((device) => ({
    id: device.id,
  }))
}

// Generate dynamic metadata for each device page
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const device = await getDevice(params.id)
  
  if (!device) {
    return {
      title: 'Device Not Found',
    }
  }

  const title = `${device.general_info.make} ${device.general_info.model} - Matter Device Directory`
  const description = `Specifications and details for the ${device.general_info.make} ${device.general_info.model} Matter-compatible ${device.general_info.type}`

  return {
    title,
    description,
    keywords: [
      device.general_info.make,
      device.general_info.model,
      'matter',
      device.general_info.type,
      'smart home',
      'specifications',
      device.device_info.socket,
      device.device_info.led_category,
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      type: 'article',
      // Add structured data for the device
      images: [{
        url: '/og-image.jpg', // You could generate device-specific OG images
        width: 1200,
        height: 630,
        alt: title,
      }]
    }
  }
}

export default async function DevicePage({
  params,
}: {
  params: { id: string }
}) {
  const device = await getDevice(params.id)

  if (!device) {
    notFound()
  }

  return (
    <main className="container py-6">
      <DeviceDetails device={device} />
    </main>
  )
}

