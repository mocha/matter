import { notFound } from "next/navigation"
import { DeviceDetails } from "@/components/devices/device-details"
import { getDevice } from "@/lib/utils/get-devices"

export const dynamic = "force-dynamic"

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

