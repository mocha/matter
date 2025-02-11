import axios from 'axios'
import * as cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'
import slugify from 'slugify'

async function scrapeDevice(url: string) {
  try {
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)

    // Extract product details
    const make = $('h1').text().split(' ')[0]
    const model = $('h1').text().split(' ').slice(1).join(' ')
    
    // Extract description
    const description = $('.entry-overview p')
      .text()
      .trim()
    
    console.log('Found description:', description)
    
    // Extract Matter details from the list items
    const matterDetails: Record<string, string> = {}
    $('.entry-content ul li.item').each((_, el) => {
      const $el = $(el)
      const label = $el.find('span.label').text().trim()
      const value = $el.find('span.value').text().trim()
      
      console.log(`Found detail: "${label}" = "${value}"`) // Debug log
      
      if (label && value) {
        matterDetails[label] = value
      }
    })

    // Create a mapping for the field names
    const fieldMapping: Record<string, string> = {
      'Firmware Version': 'Firmware Version',
      'Hardware Version': 'Hardware Version',
      'Certificate ID': 'Certificate ID',
      'Certified Date': 'Certified Date',
      'Product ID': 'Product ID',
      'Vendor ID': 'Vendor ID',
      'TIS/TRP Tested': 'TIS/TRP Tested',
      'Specification Version': 'Specification Version',
      'Transport Interface': 'Transport Interface',
      'Primary Device Type ID': 'Primary Device Type ID'
    }

    // Create the device data with mapped fields
    const deviceData = {
      productData: {
        make,
        model,
        description: description || "No description available",
        releasedOn: matterDetails['Certified Date'] || null,
        inProduction: true,
      },
      featureData: {
        supportedApps: [],
        supportedConnections: matterDetails['Transport Interface'] ? matterDetails['Transport Interface'].split(', ') : [],
        directMatterConnection: true,
        requires3rdPartyApp: false
      },
      matterData: Object.fromEntries(
        Object.entries(fieldMapping).map(([key, mappedKey]) => [
          mappedKey,
          matterDetails[key] || ''
        ])
      ),
      references: [url]
    }

    // Generate markdown content
    const markdown = `---
${JSON.stringify(deviceData, null, 2)}
---

${description || `${make} ${model} is a Matter-certified device that supports direct Matter connectivity over ${matterDetails['Transport Interface']}.`}
`

    // Create manufacturer directory and filename with increment if needed
    const manufacturerSlug = slugify(make, { lower: true })
    const deviceSlug = slugify(`${make}-${model}`, { lower: true })
    
    // Ensure manufacturer directory exists
    const manufacturerDir = path.join(process.cwd(), 'devices', manufacturerSlug)
    if (!fs.existsSync(manufacturerDir)) {
      fs.mkdirSync(manufacturerDir, { recursive: true })
    }
    
    let increment = 0
    let filePath = path.join(manufacturerDir, `${deviceSlug}.md`)
    
    // Keep incrementing until we find an available filename
    while (fs.existsSync(filePath)) {
      increment++
      filePath = path.join(manufacturerDir, `${deviceSlug}-${increment}.md`)
    }

    // Write to file
    fs.writeFileSync(filePath, markdown)
    
    // Show warning if we had to increment
    if (increment > 0) {
      console.warn(`Warning: A file for ${make} ${model} already existed.`)
      console.warn(`Created new file with increment: ${filePath}`)
      console.warn('Please review both files to ensure no duplicate entries.')
    } else {
      console.log(`Device entry created at: ${filePath}`)
    }

  } catch (error) {
    console.error('Error scraping device:', error)
    process.exit(1)
  }
}

// Get URL from command line argument
const url = process.argv[2]
if (!url) {
  console.error('Please provide a URL to scrape')
  process.exit(1)
}

scrapeDevice(url) 