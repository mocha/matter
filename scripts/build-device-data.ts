import fs from 'fs/promises' // Import fs for file operations
import path from 'path' // Import path for file path manipulations
import { glob } from 'glob'
import matter from 'gray-matter'
import { z } from 'zod' // For validation

// Define schema for device data with optional fields
const DeviceSchema = z.object({
  general_info: z.object({
    make: z.string(),
    model: z.string(),
    type: z.string()
  }),
  product_info: z.object({
    variants: z.array(z.object({
      name: z.string().optional().nullable(),
      in_production: z.boolean().optional().nullable(),
      sku: z.string().optional().nullable(),
      ean_or_upc: z.string().optional().nullable(),
      official_product_page_url: z.string().optional().nullable(),
      page_last_checked: z.coerce.date().optional().nullable(),
      spec_sheet_url: z.string().optional().nullable(),
      msrp_ea: z.number().optional().nullable(),
      price_last_checked: z.coerce.date().optional().nullable(),
    })),
  }).optional().nullable(),
  matter_info: z.object({
    matter_certified: z.boolean().optional().nullable() ,
    includes_direct_matter_code: z.boolean().optional().nullable(),
    app_required_for_full_functionality: z.boolean().optional().nullable(),
  }).optional().nullable(),
  device_info: z.object({
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
  }).optional().nullable(),
}).passthrough() // Allow additional fields we haven't specified

async function buildDeviceData() {
  // Get all markdown files
  const files = await glob('./devices/**/*.md')
  
  const devices = await Promise.all(files.map(async (file) => {
    try {
      const content = await fs.readFile(file, 'utf-8')
      const { data, content: markdown } = matter(content)
      
      // Add debug logging
      console.log('Raw data from file:', JSON.stringify(data, null, 2))
      
      // Validate against schema
      const result = DeviceSchema.safeParse(data)
      
      if (!result.success) {
        console.error(`Validation error in file ${file}:`)
        console.error(JSON.stringify(result.error.format(), null, 2)) // More detailed error format
        return null // Skip invalid files
      }
      
      return {
        id: path.basename(file, '.md'),
        ...result.data,
        notes_content: markdown,
        path: file,
        gh_file_url: 'https://github.com/mocha/matter/' + file
      }
    } catch (error) {
      console.error(`Error processing file ${file}:`, error)
      return null
    }
  }))

  // Filter out null entries from failed validations
  const validDevices = devices.filter((device): device is NonNullable<typeof device> => device !== null)

  // Write to JSON file
  await fs.writeFile(
    './public/device-data.json',
    JSON.stringify(validDevices, null, 2)
  )

  console.log(`Processed ${validDevices.length} valid devices out of ${files.length} total files`)
}

buildDeviceData().catch(console.error) 
