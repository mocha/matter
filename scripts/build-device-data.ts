import fs from 'fs/promises' // Import fs for file operations
import path from 'path' // Import path for file path manipulations
import { glob } from 'glob'
import matter from 'gray-matter'
import { DeviceSchema } from '@/lib/schema/device'
import { MarkdownSchema } from '@/lib/schema/markdown'

function removeNullValues<T extends Record<string, any>>(obj: T | null): T | null {
  if (!obj) return null;
  
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v !== null && v !== "null")
      .map(([k, v]) => {
        if (typeof v === 'object' && v !== null) {
          return [k, removeNullValues(v)];
        }
        return [k, v];
      })
  ) as T;
}

async function buildDeviceData() {
  const files = await glob('./devices/**/*.md')
  
  const devices = await Promise.all(files.flatMap(async (file) => {
    try {
      const content = await fs.readFile(file, 'utf-8')
      const { data, content: markdown } = matter(content)
      
      const markdownResult = MarkdownSchema.safeParse(data)
      if (!markdownResult.success) {
        console.error(`Markdown validation error in ${file}:`, markdownResult.error)
        return []
      }
      
      const baseId = path.basename(file, '.md')
      const markdownData = markdownResult.data

      // If no variants exist, create a single device entry
      if (!markdownData.product_info.variants?.length) {
        const cleanDevice = {
          id: baseId,
          type: markdownData.general_info.type,
          general_info: { ...markdownData.general_info, type: undefined },
          product_info: removeNullValues(markdownData.product_info || {}),
          connectivity_info: removeNullValues(markdownData.connectivity_info),
          device_info: removeNullValues(markdownData.device_info),
          notes_content: markdown,
          path: file,
          gh_file_url: `https://github.com/mocha/matter/blob/main/${file}?plain=1`
        };

        const deviceResult = DeviceSchema.safeParse(cleanDevice)
        if (!deviceResult.success) {
          console.error(`Device validation error in ${file}:`, deviceResult.error)
          return []
        }

        return [deviceResult.data]
      }

      // Process variants
      return markdownData.product_info.variants.map((variant) => {

        const variantId = variant.name !== 'Standard' 
          ? `-${variant.name.toLowerCase().replace(/\s+/g, '-')}`
          : ''

        const cleanDevice = {
          id: baseId + variantId,
          type: markdownData.general_info.type,
          general_info: { ...markdownData.general_info, type: undefined },
          product_info: removeNullValues({
            ...markdownData.product_info,
            ...variant,
            variants: undefined,
            variant_device_info: undefined
          }),
          connectivity_info: removeNullValues(markdownData.connectivity_info),
          device_info: removeNullValues(markdownData.device_info),
          notes_content: markdown,
          path: file,
          gh_file_url: `https://github.com/mocha/matter/blob/main/${file}?plain=1`
        };

        const deviceResult = DeviceSchema.safeParse(cleanDevice)
        if (!deviceResult.success) {
          console.error(`Variant validation error in ${file}:`, deviceResult.error)
          return null
        }

        return deviceResult.data
      }).filter(Boolean)
    } catch (error) {
      console.error(`Error processing file ${file}:`, error)
      return []
    }
  }))

  const validDevices = devices.flat().filter(Boolean)
  
  // Ensure directory exists
  await fs.mkdir('./public', { recursive: true })
  
  // Write to public for both API access and direct downloads
  await fs.writeFile('./public/device-data.json', JSON.stringify(validDevices, null, 2))
  
  console.log(`Processed ${validDevices.length} valid devices from ${files.length} files`)
}

buildDeviceData().catch(console.error) 
