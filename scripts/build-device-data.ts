import fs from 'fs/promises' // Import fs for file operations
import path from 'path' // Import path for file path manipulations
import { glob } from 'glob'
import matter from 'gray-matter'
import { z } from 'zod' // For validation

// Define the device info schema once
const DeviceInfoSchema = z.object({
  socket: z.string().optional().nullable(),
  bulb_shape: z.string().optional().nullable(),
  style: z.string().optional().nullable(),
  led_category: z.string().optional().nullable(),
  housing_material: z.string().optional().nullable(),
  bulb_lens_material: z.string().optional().nullable(),
  brightness_lm: z.number().optional().nullable(),
  rated_power_w: z.number().optional().nullable(),
  eqiv_power_w: z.number().optional().nullable(),
  beam_angle_deg: z.number().optional().nullable(),
  white_color_temp_range_k_start: z.number().optional().nullable(),
  white_color_temp_range_k_end: z.number().optional().nullable(),
  color_rendering_index_cri: z.number().optional().nullable(),
})

// Use the same schema for variants, but make it optional
const VariantDeviceInfoSchema = DeviceInfoSchema.partial().optional().nullable()

const ProductInfoSchema = z.object({
  name: z.string().optional().nullable(),
  in_production: z.boolean().optional().nullable(),
  sku: z.string().optional().nullable(),
  ean_or_upc: z.string().optional().nullable(),
  official_product_page_url: z.string().optional().nullable(),
  page_last_checked: z.coerce.date().optional().nullable(),
  spec_sheet_url: z.string().optional().nullable(),
  msrp_ea: z.number().optional().nullable(),
  price_last_checked: z.coerce.date().optional().nullable(),
  variant_device_info: VariantDeviceInfoSchema,
})

// Define schema for device data with optional fields
const DeviceSchema = z.object({
  general_info: z.object({
    make: z.string(),
    model: z.string(),
    type: z.string()
  }),
  product_info: z.union([
    z.object({ variants: z.array(ProductInfoSchema) }),
    ProductInfoSchema
  ]),
  matter_info: z.object({
    matter_certified: z.boolean().optional().nullable(),
    includes_direct_matter_code: z.boolean().optional().nullable(),
    app_required_for_full_functionality: z.boolean().optional().nullable(),
  }).optional().nullable(),
  device_info: DeviceInfoSchema.optional().nullable(),
}).passthrough() // Allow additional fields we haven't specified

async function buildDeviceData() {
  const files = await glob('./devices/**/*.md')
  
  const devices = await Promise.all(files.flatMap(async (file) => {
    try {
      const content = await fs.readFile(file, 'utf-8')
      const { data, content: markdown } = matter(content)
      
      const result = DeviceSchema.safeParse(data)
      
      if (!result.success) {
        console.error(`Validation error in file ${file}:`)
        console.error(JSON.stringify(result.error.format(), null, 2))
        return []
      }

      const baseId = path.basename(file, '.md')

      // If no variants exist, create a single device entry
      if (!('variants' in result.data.product_info)) {
        return [{
          id: baseId,
          general_info: result.data.general_info,
          product_info: result.data.product_info || {},
          matter_info: result.data.matter_info,
          device_info: result.data.device_info,
          notes_content: markdown,
          path: file,
          gh_file_url: `https://github.com/mocha/matter/${file}`
        }]
      }
      
      // For variants, create entries with the original base ID
      return result.data.product_info.variants.map(variant => {
        // Only append variant name if it's not "Standard"
        const variantId = variant.name && variant.name !== 'Standard' 
          ? `-${variant.name.toLowerCase().replace(/\s+/g, '-')}` 
          : ''
        
        return {
          id: baseId + variantId,
          general_info: result.data.general_info,
          product_info: {
            ...variant,
            variant_device_info: undefined,
            official_product_page_url: result.data.product_info.official_product_page_url,
            page_last_checked: result.data.product_info.page_last_checked
          },
          matter_info: result.data.matter_info,
          device_info: {
            ...result.data.device_info,
            ...variant.variant_device_info
          },
          notes_content: markdown,
          path: file,
          gh_file_url: `https://github.com/mocha/matter/${file}`
        }
      })
    } catch (error) {
      console.error(`Error processing file ${file}:`, error)
      return []
    }
  }))

  const validDevices = devices.flat().filter(Boolean)
  
  // Write to both locations to ensure consistency
  await fs.writeFile('./public/device-data.json', JSON.stringify(validDevices, null, 2))
  await fs.writeFile('./lib/data/device-data.json', JSON.stringify(validDevices, null, 2))
  
  console.log(`Processed ${validDevices.length} valid devices from ${files.length} files`)
}

buildDeviceData().catch(console.error) 
