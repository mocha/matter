"use client"

import * as React from "react"
import { SearchIcon, XIcon, ChevronDown } from "lucide-react"
import Markdown from "react-markdown"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

import type { DeviceData } from "@/lib/get-devices"

const categories = ["All", "Lighting", "Security", "Climate", "Entertainment"]
const connectionTypes = ["All", "WiFi", "Thread", "Ethernet"]

interface DeviceCatalogProps {
  devices: DeviceData[]
}

export default function DeviceCatalog({ devices: initialDevices }: DeviceCatalogProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("All")
  const [selectedConnection, setSelectedConnection] = React.useState("All")
  const [selectedDevice, setSelectedDevice] = React.useState<DeviceData | null>(null)
  const [isModalReady, setIsModalReady] = React.useState(false)
  const [devices] = React.useState<DeviceData[]>(initialDevices)
  const [isJsonExpanded, setIsJsonExpanded] = React.useState(false)

  // Reset modal ready state when device changes
  React.useEffect(() => {
    if (selectedDevice) {
      setIsModalReady(true)
    } else {
      setIsModalReady(false)
    }
  }, [selectedDevice])

  // Filter devices based on search query and filters
  const filteredDevices = React.useMemo(() => {
    return devices.filter((device) => {
      const searchableFields = [device.productData.make, device.productData.model, device.productData.description]
        .join(" ")
        .toLowerCase()

      const matchesSearch = searchQuery === "" || searchableFields.includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "All" || device.productData.model.includes(selectedCategory)

      const matchesConnection =
        selectedConnection === "All" || device.featureData.supportedConnections.includes(selectedConnection)

      return matchesSearch && matchesCategory && matchesConnection
    })
  }, [devices, searchQuery, selectedCategory, selectedConnection])

  const clearFilters = () => {
    setSelectedCategory("All")
    setSelectedConnection("All")
    setSearchQuery("")
  }

  return (
    <div className="container mx-auto py-6 space-y-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Matter Device Catalog</h1>

        {/* Search and Filter Controls */}
        <div className="sticky top-0 z-10 bg-background pt-4 space-y-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search devices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Card className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Filters:</span>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedConnection} onValueChange={setSelectedConnection}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Connection" />
                  </SelectTrigger>
                  <SelectContent>
                    {connectionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto">
                <XIcon className="h-4 w-4 mr-2" />
                Clear filters
              </Button>
            </div>
          </Card>
        </div>

        {/* Table */}
        <div className="rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] caption-bottom text-sm">
              <thead>
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium">Make</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Model</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Supported Apps</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Connections</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Direct Matter</th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices.map((device) => (
                  <tr
                    key={device.slug}
                    className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                    onClick={() => setSelectedDevice(device)}
                  >
                    <td className="p-4 align-middle font-medium">{device.productData.make}</td>
                    <td className="p-4 align-middle">{device.productData.model}</td>
                    <td className="p-4 align-middle">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          device.productData.inProduction ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {device.productData.inProduction ? "In Production" : "Discontinued"}
                      </span>
                    </td>
                    <td className="p-4 align-middle">{device.featureData.supportedApps.join(", ")}</td>
                    <td className="p-4 align-middle">{device.featureData.supportedConnections.join(", ")}</td>
                    <td className="p-4 align-middle">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          device.featureData.directMatterConnection
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {device.featureData.directMatterConnection ? "Yes" : "No"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog
        open={!!selectedDevice}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedDevice(null)
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh]">
          {selectedDevice && isModalReady ? (
            <>
              <DialogHeader className="sticky top-0 bg-background z-10 pb-4 -mx-6 px-6 -mt-6 pt-6">
                <DialogTitle>{selectedDevice.productData.model}</DialogTitle>
                <DialogDescription>Manufactured by {selectedDevice.productData.make}</DialogDescription>
              </DialogHeader>

              <div className="overflow-y-auto -mx-6 px-6 pb-8" style={{ maxHeight: "calc(90vh - 80px)" }}>
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium mb-1">Released</div>
                      <div>{new Date(selectedDevice.productData.releasedOn).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Status</div>
                      <div>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            selectedDevice.productData.inProduction
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {selectedDevice.productData.inProduction ? "In Production" : "Discontinued"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Matter Version</div>
                      <div>{selectedDevice.matterData["Specification Version"]}</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Firmware</div>
                      <div>{selectedDevice.matterData["Firmware Version"]}</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Certificate ID</div>
                      <div>{selectedDevice.matterData["Certificate ID"]}</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Certified Date</div>
                      <div>{selectedDevice.matterData["Certified Date"]}</div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="font-medium mb-2">Description</div>
                    <div className="prose prose-sm dark:prose-invert">
                      <Markdown>{selectedDevice.description}</Markdown>
                    </div>
                  </div>

                  {selectedDevice.references && selectedDevice.references.length > 0 && (
                    <>
                      <Separator />
                      <div className="pb-6">
                        <div className="font-medium mb-2">References</div>
                        <div className="grid gap-2">
                          {selectedDevice.references.map((ref, index) => (
                            <a
                              key={index}
                              href={ref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline truncate"
                            >
                              {ref}
                            </a>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <Separator />

                  <Collapsible open={isJsonExpanded} onOpenChange={setIsJsonExpanded} className="w-full">
                    <CollapsibleTrigger asChild>
                      <Button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          setIsJsonExpanded(!isJsonExpanded)
                        }}
                        variant="ghost"
                        className="flex w-full justify-between p-0 h-auto font-medium"
                      >
                        <span>Raw Device Data</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            isJsonExpanded ? "transform rotate-180" : ""
                          }`}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4">
                      <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto text-xs">
                        {JSON.stringify(
                          {
                            productData: selectedDevice.productData,
                            featureData: selectedDevice.featureData,
                            matterData: selectedDevice.matterData,
                            references: selectedDevice.references,
                          },
                          null,
                          2,
                        )}
                      </pre>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
              <Skeleton className="h-40" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

