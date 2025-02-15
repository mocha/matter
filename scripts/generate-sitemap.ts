import { getAllDevices } from "@/lib/get-device-data"
import fs from 'fs/promises'

async function generateSitemap() {
  const devices = getAllDevices()
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://matter.party</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${devices.map(device => `
  <url>
    <loc>https://matter.party/devices/${device.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  `).join('')}
</urlset>`

  await fs.writeFile('./public/sitemap.xml', sitemap)
  console.log('Sitemap generated')
}

generateSitemap()