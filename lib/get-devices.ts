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
  id: string;
  name: string;
  manufacturer: string;
  description: string;
  status: "online" | "offline";
  lastSeen: string;
  firmware?: string;
  protocol?: string;
  powerSource?: string;
  category?: string;
  connectionType?: string;
  productData: {
    make: string;
    model: string;
    description: string;
    releasedOn?: string;
    inProduction?: boolean;
    variants?: ProductVariant[];
  };
  featureData: FeatureData
  matterData: MatterData
  references: string[]
  slug: string
}

export async function getDevices(): Promise<DeviceData[]> {
  const devices: DeviceData[] = []
  
  // Recursive function to process directories
  const processDirectory = (dirPath: string) => {
    const items = fs.readdirSync(dirPath)
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        // Recursively process subdirectories
        processDirectory(fullPath)
      } else if (item.endsWith('.md')) {
        // Process markdown files
        const fileContents = fs.readFileSync(fullPath, "utf8")
        const { data, content } = matter(fileContents)
        
        devices.push({
          ...data,
          description: content,
          slug: path.basename(item, '.md'),
        } as DeviceData)
      }
    }
  }

  // Start processing from the devices directory
  const devicesDirectory = path.join(process.cwd(), "devices")
  processDirectory(devicesDirectory)

  return devices
}

