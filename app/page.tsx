import { DeviceGrid } from "@/components/devices/device-grid"
import { getDevices } from "@/lib/utils/get-devices"

export default async function Home() {
  const devices = await getDevices()

  return (
    <main className="container max-w-none py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Matter Devices</h1>
          <p className="text-muted-foreground">A community-built directory of Matter-compatible devices.</p>
        </div>
        <DeviceGrid devices={devices} />
      </div>
    </main>
  )
}

