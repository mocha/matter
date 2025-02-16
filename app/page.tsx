import React, { Suspense } from 'react';
import { DeviceGrid } from "@/components/devices/device-grid"
import { getDevices } from "@/lib/utils/get-devices"

const Page = async () => {
  const devices = await getDevices()

  return (
    <main className="container max-w-none py-14">
      <div className="space-y-6">
        <Suspense fallback={<div>Loading devices...</div>}>
          <DeviceGrid devices={devices} />
        </Suspense>
      </div>
    </main>
  )
}

export default Page;

