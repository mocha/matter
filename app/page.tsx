import { DeviceGrid } from "@/components/devices/device-grid"
import { getDevices } from "@/lib/utils/get-devices"

export default async function Home() {
  const devices = await getDevices()

  return (
    <main className="container max-w-none py-14">
      <div className="space-y-6">
        <DeviceGrid devices={devices} />
      </div>
    </main>
  )
}

