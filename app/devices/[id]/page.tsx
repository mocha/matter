import { notFound } from "next/navigation"
import { DeviceDetails } from "@/components/devices/device-details"
import { getDevice } from "@/lib/utils/get-devices"
import { getAllDevices } from "@/lib/get-device-data"

export async function generateStaticParams() {
  const devices = getAllDevices()
  return devices.map((device) => ({
    id: device.id,
  }))
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

