import { readFile } from "fs/promises"
import { join } from "path"
import type { Device } from "@/lib/types/device"

export async function getDevices(): Promise<Device[]> {
  try {
    const filePath = join(process.cwd(), "lib", "data", "device-data.json")
    const jsonData = await readFile(filePath, "utf8")
    return JSON.parse(jsonData) as Device[]
  } catch (error) {
    console.error("Error loading device data:", error)
    return []
  }
}

export async function getDevice(id: string): Promise<Device | null> {
  try {
    const devices = await getDevices()
    return devices.find((d) => d.id === id) || null
  } catch (error) {
    console.error("Error loading device:", error)
    return null
  }
}

