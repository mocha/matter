import Link from "next/link"
import { Github, ExternalLink, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Markdown from "react-markdown"
import type { Device } from "@/lib/types/device"

interface DeviceDetailsProps {
  device: Device
}

export function DeviceDetails({ device }: DeviceDetailsProps) {
  const variant = device.product_info.variants[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to devices
          </Link>
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Button variant="outline" size="sm" asChild>
          <Link href={device.gh_file_url} className="flex items-center gap-2">
            <Github className="h-4 w-4" />
            Edit on GitHub
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">General Information</h2>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4">
            <div>
              <dt className="font-medium">Make</dt>
              <dd className="text-muted-foreground">{device.general_info.make}</dd>
            </div>
            <div>
              <dt className="font-medium">Model</dt>
              <dd className="text-muted-foreground">{device.general_info.model}</dd>
            </div>
            <div>
              <dt className="font-medium">Type</dt>
              <dd className="text-muted-foreground">{device.general_info.type}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Product Information</h2>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4">
            <div>
              <dt className="font-medium">Variant Name</dt>
              <dd className="text-muted-foreground">{variant.name}</dd>
            </div>
            <div>
              <dt className="font-medium">Production Status</dt>
              <dd>
                {variant.in_production ? (
                  <Badge variant="secondary">In Production</Badge>
                ) : (
                  <Badge variant="destructive">Discontinued</Badge>
                )}
              </dd>
            </div>
            {variant.sku && (
              <div>
                <dt className="font-medium">SKU</dt>
                <dd className="text-muted-foreground">{variant.sku}</dd>
              </div>
            )}
            {variant.ean_or_upc && (
              <div>
                <dt className="font-medium">EAN/UPC</dt>
                <dd className="text-muted-foreground">{variant.ean_or_upc}</dd>
              </div>
            )}
            {variant.msrp_ea && (
              <div>
                <dt className="font-medium">MSRP</dt>
                <dd className="text-muted-foreground">${variant.msrp_ea.toFixed(2)}</dd>
              </div>
            )}
            {variant.price_last_checked && (
              <div>
                <dt className="font-medium">Price Last Checked</dt>
                <dd className="text-muted-foreground">{new Date(variant.price_last_checked).toLocaleDateString()}</dd>
              </div>
            )}
            {variant.official_product_page_url && (
              <div>
                <dt className="font-medium">Product Page</dt>
                <dd>
                  <Button variant="link" asChild className="h-auto p-0">
                    <Link href={variant.official_product_page_url} target="_blank">
                      Visit manufacturer website
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </dd>
              </div>
            )}
            {variant.spec_sheet_url && (
              <div>
                <dt className="font-medium">Specification Sheet</dt>
                <dd>
                  <Button variant="link" asChild className="h-auto p-0">
                    <Link href={variant.spec_sheet_url} target="_blank">
                      Download PDF
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Matter Information</h2>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4">
            <div>
              <dt className="font-medium">Matter Certified</dt>
              <dd>
                {device.matter_info.matter_certified ? (
                  <Badge variant="secondary">Yes</Badge>
                ) : device.matter_info.matter_certified === false ? (
                  <Badge variant="outline">No</Badge>
                ) : (
                  <span className="text-muted-foreground">Not specified</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="font-medium">Direct Matter Code</dt>
              <dd>
                {device.matter_info.includes_direct_matter_code ? (
                  <Badge>Yes</Badge>
                ) : device.matter_info.includes_direct_matter_code === false ? (
                  <Badge variant="outline">No</Badge>
                ) : (
                  <span className="text-muted-foreground">Not specified</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="font-medium">App Required</dt>
              <dd>
                {device.matter_info.app_required_for_full_functionality ? (
                  <Badge variant="destructive">Yes</Badge>
                ) : device.matter_info.app_required_for_full_functionality === false ? (
                  <Badge variant="outline">No</Badge>
                ) : (
                  <span className="text-muted-foreground">Not specified</span>
                )}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Device Information</h2>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4">
            <div>
              <dt className="font-medium">Socket</dt>
              <dd className="text-muted-foreground">{device.device_info.socket}</dd>
            </div>
            <div>
              <dt className="font-medium">Bulb Shape</dt>
              <dd className="text-muted-foreground">{device.device_info.bulb_shape}</dd>
            </div>
            <div>
              <dt className="font-medium">Style</dt>
              <dd className="text-muted-foreground">{device.device_info.style}</dd>
            </div>
            <div>
              <dt className="font-medium">LED Category</dt>
              <dd className="text-muted-foreground">{device.device_info.led_category}</dd>
            </div>
            <div>
              <dt className="font-medium">Materials</dt>
              <dd className="text-muted-foreground">
                Housing: {device.device_info.housing_material}
                <br />
                Lens: {device.device_info.bulb_lens_material}
              </dd>
            </div>
            {device.device_info.brightness_lm && (
              <div>
                <dt className="font-medium">Brightness</dt>
                <dd className="text-muted-foreground">{device.device_info.brightness_lm} lumens</dd>
              </div>
            )}
            {device.device_info.rated_power_w && (
              <div>
                <dt className="font-medium">Rated Power</dt>
                <dd className="text-muted-foreground">{device.device_info.rated_power_w}W</dd>
              </div>
            )}
            {device.device_info.eqiv_power_w && (
              <div>
                <dt className="font-medium">Equivalent Power</dt>
                <dd className="text-muted-foreground">{device.device_info.eqiv_power_w}W</dd>
              </div>
            )}
            {device.device_info.beam_angle_deg && (
              <div>
                <dt className="font-medium">Beam Angle</dt>
                <dd className="text-muted-foreground">{device.device_info.beam_angle_deg}°</dd>
              </div>
            )}
            {device.device_info.white_color_temp_range_k_start && device.device_info.white_color_temp_range_k_end && (
              <div>
                <dt className="font-medium">Color Temperature Range</dt>
                <dd className="text-muted-foreground">
                  {device.device_info.white_color_temp_range_k_start}K -{" "}
                  {device.device_info.white_color_temp_range_k_end}K
                </dd>
              </div>
            )}
            {device.device_info.color_rendering_index_cri && (
              <div>
                <dt className="font-medium">Color Rendering Index (CRI)</dt>
                <dd className="text-muted-foreground">{device.device_info.color_rendering_index_cri}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      {device.notes_content && device.notes_content !== "\r\n## Notes " && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Community Notes</h2>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none dark:prose-invert">
              <Markdown>{device.notes_content}</Markdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

