import fs from "fs"
import path from "path"
import matter from "gray-matter"

interface ProductVariant {
  name: string
  sku: string
}

interface ProductData {
  make: string
  model: string
  releasedOn: string
  inProduction: boolean
  description: string
  variants: ProductVariant[]
}

interface FeatureData {
  supportedApps: string[]
  supportedConnections: string[]
  directMatterConnection: boolean
  requires3rdPartyApp: boolean
}

interface MatterData {
  "Firmware Version": string
  "Hardware Version": string
  "Certificate ID": string
  "Certified Date": string
  "Family ID": string
  "Product ID": string
  "Vendor ID": string
  "TIS/TRP Tested": string
  "Specification Version": string
  "Transport Interface": string
  "Primary Device Type ID": string
}

export interface DeviceData {
  productData: ProductData
  featureData: FeatureData
  matterData: MatterData
  references: string[]
  description: string
  slug: string
}

export async function getDevices(): Promise<DeviceData[]> {
  const devicesDirectory = path.join(process.cwd(), "devices")
  const filenames = fs.readdirSync(devicesDirectory)

  const devices = filenames.map((filename) => {
    const filePath = path.join(devicesDirectory, filename)
    const fileContents = fs.readFileSync(filePath, "utf8")
    const { data, content } = matter(fileContents)

    return {
      ...data,
      description: content,
      slug: filename.replace(".md", ""),
    } as DeviceData
  })

  return devices
}

