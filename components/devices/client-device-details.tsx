'use client'

import type { Device } from "@/lib/types/device"
import { DeviceDetails } from "./device-details"

export function ClientDeviceDetails({ device }: { device: Device }) {
  console.log("ClientDeviceDetails render, device:", device)
  return <DeviceDetails device={device} />
} 