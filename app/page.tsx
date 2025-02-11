import { getDevices } from "@/lib/get-devices"
import DeviceCatalog from "@/components/device-catalog"

export default async function Page() {
  const devices = await getDevices()
  return <DeviceCatalog devices={devices} />
}

