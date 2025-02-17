import Link from "next/link"
import { GithubIcon, ExternalLink, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Markdown from "react-markdown"
import type { Device } from "@/lib/types/device"
import { isLightDevice, isLockDevice } from "@/lib/utils/type-guards"
import { LightDeviceDetails } from "./light-device-details"
import { LockDeviceDetails } from "./lock-device-details"
import { useSearchParams } from 'next/navigation'

interface DeviceDetailsProps {
  device: Device
}

// Shared info sections that apply to all devices
function GeneralInfo({ device }: DeviceDetailsProps) {
  return (
    <dl className="device-details">
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
        <dd className="text-muted-foreground">{device.type}</dd>
      </div>
    </dl>
  )
}

function ProductInfo({ device }: DeviceDetailsProps) {
  return (
    <dl className="device-details">
      {device.product_info.name && (
        <div>
          <dt className="font-medium">Name</dt>
          <dd className="text-muted-foreground">{device.product_info.name}</dd>
        </div>
      )}
      <div>
        <dt className="font-medium">Production Status</dt>
        <dd>
          {device.product_info.in_production ? (
            <Badge variant="secondary">In Production</Badge>
          ) : (
            <Badge variant="destructive">Discontinued</Badge>
          )}
        </dd>
      </div>
      {device.product_info.sku && (
        <div>
          <dt className="font-medium">SKU</dt>
          <dd className="text-muted-foreground">{device.product_info.sku}</dd>
        </div>
      )}
      {device.product_info.ean_or_upc && (
        <div>
          <dt className="font-medium">EAN/UPC</dt>
          <dd className="text-muted-foreground">{device.product_info.ean_or_upc}</dd>
        </div>
      )}
      {device.product_info.msrp_ea && (
        <div>
          <dt className="font-medium">MSRP</dt>
          <dd className="text-muted-foreground">${device.product_info.msrp_ea.toFixed(2)}</dd>
        </div>
      )}
      {device.product_info.price_last_checked && (
        <div>
          <dt className="font-medium">Price Last Checked</dt>
          <dd className="text-muted-foreground">{new Date(device.product_info.price_last_checked).toLocaleDateString()}</dd>
        </div>
      )}
      {device.product_info.official_product_page_url && (
        <div>
          <dt className="font-medium">Product Page</dt>
          <dd>
            <Button variant="link" asChild className="h-auto p-0">
              <Link href={device.product_info.official_product_page_url} target="_blank">
                Visit manufacturer website
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </dd>
        </div>
      )}
      {device.product_info.spec_sheet_url && (
        <div>
          <dt className="font-medium">Specification Sheet</dt>
          <dd>
            <Button variant="link" asChild className="h-auto p-0">
              <Link href={device.product_info.spec_sheet_url} target="_blank">
                Download PDF
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </dd>
        </div>
      )}
    </dl>
  )
}

function ConnectivityInfo({ device }: DeviceDetailsProps) {
  return (
    <dl className="device-details">
      <div>
        <dt className="font-medium">Matter Certified</dt>
        <dd>
          {device.connectivity_info?.matter_certified ? (
            <Badge variant="secondary">Yes</Badge>
          ) : device.connectivity_info?.matter_certified === false ? (
            <Badge variant="outline">No</Badge>
          ) : (
            <span className="text-muted-foreground">Not specified</span>
          )}
        </dd>
      </div>
      <div>
        <dt className="font-medium">Direct Matter Code</dt>
        <dd>
          {device.connectivity_info?.includes_direct_matter_code ? (
            <Badge>Yes</Badge>
          ) : device.connectivity_info?.includes_direct_matter_code === false ? (
            <Badge variant="outline">No</Badge>
          ) : (
            <span className="text-muted-foreground">Not specified</span>
          )}
        </dd>
      </div>
      <div>
        <dt className="font-medium">App Required</dt>
        <dd>
          {device.connectivity_info?.app_required_for_full_functionality ? (
            <Badge variant="destructive">Yes</Badge>
          ) : device.connectivity_info?.app_required_for_full_functionality === false ? (
            <Badge variant="outline">No</Badge>
          ) : (
            <span className="text-muted-foreground">Not specified</span>
          )}
        </dd>
      </div>
      {device.connectivity_info?.works_with_homekit && (
        <div>
          <dt className="font-medium">Works with HomeKit</dt>
          <dd><Badge variant="secondary">Yes</Badge></dd>
        </div>
      )}
      {device.connectivity_info?.works_with_alexa && (
        <div>
          <dt className="font-medium">Works with Alexa</dt>
          <dd><Badge variant="secondary">Yes</Badge></dd>
        </div>
      )}
      {device.connectivity_info?.works_with_google_assistant && (
        <div>
          <dt className="font-medium">Works with Google Assistant</dt>
          <dd><Badge variant="secondary">Yes</Badge></dd>
        </div>
      )}
    </dl>
  )
}

export function DeviceDetails({ device }: DeviceDetailsProps) {
  console.log("=== DeviceDetails RENDER ===");
  console.log("Device type (raw):", JSON.stringify(device.type));
  console.log("Device type (lowercase):", device.type?.toLowerCase());
  console.log("Device type (trimmed):", device.type?.trim());
  
  const deviceType = device.type;
  console.log("Is light device?", isLightDevice(device));
  console.log("Is lock device?", isLockDevice(device));
  console.log(device)
  
  if (!device) {
    console.error("No device provided to DeviceDetails");
    return <div>No device found</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/?type=${device.type}`} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to devices
          </Link>
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Button variant="outline" size="sm" asChild>
          <Link href={device.gh_file_url} className="flex items-center gap-2">
            <GithubIcon className="h-4 w-4" />
            Edit on GitHub
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">General Information</h2>
        </CardHeader>
        <CardContent>
          <GeneralInfo device={device} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Product Information</h2>
        </CardHeader>
        <CardContent>
          <ProductInfo device={device} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Connectivity Information</h2>
        </CardHeader>
        <CardContent>
          <ConnectivityInfo device={device} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Device Information</h2>
        </CardHeader>
        <CardContent>
          {isLightDevice(device) ? (
            <LightDeviceDetails device={device} />
          ) : isLockDevice(device) ? (
            <LockDeviceDetails device={device} />
          ) : (
            <div>Unknown device type: {deviceType}</div>
          )}
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

