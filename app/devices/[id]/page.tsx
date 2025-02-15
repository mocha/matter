import { notFound } from "next/navigation"
import { DeviceDetails } from "@/components/devices/device-details"
import { getAllDevices } from "@/lib/get-device-data"
import type { Metadata } from 'next'

// Generate static paths for all devices
export async function generateStaticParams() {
  try {
    const devices = getAllDevices()
    return devices.map((device) => ({
      id: device.id,
    }))
  } catch (error) {
    console.error('Error in generateStaticParams:', error)
    return []
  }
}

// Generate dynamic metadata for each device page
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const devices = getAllDevices()
    const device = devices.find(d => d.id === params.id)
    
    if (!device) {
      return {
        title: 'Device Not Found',
      }
    }

    const metadata: Metadata = {
      title: `${device.general_info.make} ${device.general_info.model} - Matter Device Directory`,
      description: `Specifications and details for the ${device.general_info.make} ${device.general_info.model} Matter-compatible ${device.general_info.type}`,
      openGraph: {
        title: `${device.general_info.make} ${device.general_info.model}`,
        description: `Matter-compatible ${device.general_info.type}`,
        type: 'article',
      },
      keywords: [
        device.general_info.make,
        device.general_info.model,
        'matter',
        device.general_info.type,
        'smart home',
        'specifications',
        ...(device.device_info?.socket ? [device.device_info.socket] : []),
        ...(device.device_info?.led_category ? [device.device_info.led_category] : []),
      ]
    }

    // Only add price if it exists
    if (device.product_info?.msrp_ea) {
      metadata.other = {
        'og:price:amount': device.product_info.msrp_ea.toString(),
        'og:price:currency': 'USD',
      }
    }

    return metadata
  } catch (error) {
    console.error('Error in generateMetadata:', error)
    return {
      title: 'Error Loading Device',
    }
  }
}

export default function DevicePage({ params }: { params: { id: string } }) {
  try {
    const devices = getAllDevices()
    const device = devices.find(d => d.id === params.id)
    
    if (!device) {
      notFound()
    }

    return (
      <main className="container py-6">
        <DeviceDetails device={device} />
      </main>
    )
  } catch (error) {
    console.error('Error in DevicePage:', error)
    notFound()
  }
}

