"use client"

import * as React from "react"
import { SearchIcon, XIcon } from "lucide-react"
import Markdown from "react-markdown"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

import type { DeviceData } from "@/lib/get-devices"

const categories = ["All", "Lighting", "Security", "Climate", "Entertainment"]
const connectionTypes = ["All", "WiFi", "Thread", "Ethernet"]
const statuses = ["All", "Online", "Offline"]

interface SmartHomeDevicesProps {
  devices: DeviceData[]
}

export default function SmartHomeDevices({ devices: initialDevices }: SmartHomeDevicesProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("All")
  const [selectedConnection, setSelectedConnection] = React.useState("All")
  const [selectedStatus, setSelectedStatus] = React.useState("All")
  const [selectedDevice, setSelectedDevice] = React.useState<DeviceData | null>(null)
  const [devices] = React.useState<DeviceData[]>(initialDevices)

  // Filter devices based on search query and filters
  const filteredDevices = React.useMemo(() => {
    return devices.filter((device) => {
      const matchesSearch = Object.values(device).join(" ").toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "All" || 
        (device.category && device.category === selectedCategory)

      const matchesConnection = selectedConnection === "All" || 
        (device.connectionType && device.connectionType === selectedConnection)

      const matchesStatus = selectedStatus === "All" || device.status === selectedStatus.toLowerCase()

      return matchesSearch && matchesCategory && matchesConnection && matchesStatus
    })
  }, [devices, searchQuery, selectedCategory, selectedConnection, selectedStatus])

  const clearFilters = () => {
    setSelectedCategory("All")
    setSelectedConnection("All")
    setSelectedStatus("All")
    setSearchQuery("")
  }

  return (
    <div className="container mx-auto py-6 space-y-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Matter-Enabled Smart Home Devices</h1>

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

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
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
                  <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Manufacturer</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Category</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Protocol</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Connection</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Power Source</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Firmware</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Last Seen</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices.map((device) => (
                  <tr
                    key={device.id}
                    className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                    onClick={() => setSelectedDevice(device)}
                  >
                    <td className="p-4 align-middle font-medium">{device.name}</td>
                    <td className="p-4 align-middle">{device.manufacturer}</td>
                    <td className="p-4 align-middle">{device.category}</td>
                    <td className="p-4 align-middle">{device.protocol}</td>
                    <td className="p-4 align-middle">{device.connectionType}</td>
                    <td className="p-4 align-middle">{device.powerSource}</td>
                    <td className="p-4 align-middle">{device.firmware}</td>
                    <td className="p-4 align-middle">{new Date(device.lastSeen).toLocaleString()}</td>
                    <td className="p-4 align-middle">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          device.status === "online" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {device.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedDevice} onOpenChange={() => setSelectedDevice(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] h-fit">
          {selectedDevice && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedDevice.name}</DialogTitle>
                <DialogDescription>Manufactured by {selectedDevice.manufacturer}</DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-6 h-full">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium mb-1">Category</div>
                    <div>{selectedDevice.category}</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Protocol</div>
                    <div>{selectedDevice.protocol}</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Connection Type</div>
                    <div>{selectedDevice.connectionType}</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Power Source</div>
                    <div>{selectedDevice.powerSource}</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Firmware Version</div>
                    <div>{selectedDevice.firmware}</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Status</div>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          selectedDevice.status === "online" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {selectedDevice.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Released</div>
                    <div>
                      {selectedDevice.productData.releasedOn 
                        ? new Date(selectedDevice.productData.releasedOn).toLocaleDateString()
                        : "Release date unknown"}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex-1 flex flex-col min-h-0">
                  <div className="font-medium mb-2">Description</div>
                  <ScrollArea className="flex-1 w-full rounded-md border p-4 max-h-[calc(90vh-300px)]">
                    <Markdown className="prose prose-sm dark:prose-invert">{selectedDevice.description}</Markdown>
                  </ScrollArea>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

