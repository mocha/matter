"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"
import { ColumnsDropdown } from "./columns-dropdown"
import { FilterPopover } from "./filter-popover"
import type { Device } from "@/lib/types/device"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ColumnConfig } from "@/lib/types/columns"
import { getColumnsForType } from "./columns-dropdown"
import { getSearchFields } from "@/lib/utils/device-utils"
import { isLightDevice } from "@/lib/utils/type-guards"
import { getColorTempGradientStyle } from "@/lib/utils/color-utils"
import { useSearchParams, useRouter } from 'next/navigation'

interface DeviceGridProps {
  devices: Device[]
}

type SortConfig = {
  key: string
  direction: "asc" | "desc"
}

type Filters = {
  [key: string]: Set<string>
}

type TableState = {
  searchTerm: string
  sortConfig: SortConfig
  filters: Filters
  visibleColumns: string[]
  activeType?: 'light' | 'lock'
}

// Default visible columns, remove "type" since we have tabs now
const DEFAULT_VISIBLE_COLUMNS = ["model", "make", "led_category", "socket", "matter_certified", "direct_code"]

// Load state from session storage
const loadTableState = (): TableState => {
  if (typeof window === "undefined") {
    return {
      searchTerm: "",
      sortConfig: { key: "", direction: "asc" },
      filters: {} as Filters,
      visibleColumns: DEFAULT_VISIBLE_COLUMNS,
      activeType: 'light'
    }
  }

  try {
    const savedState = sessionStorage.getItem("tableState")
    if (savedState) {
      const state = JSON.parse(savedState)
      // Convert arrays to Sets when loading
      return {
        ...state,
        filters: Object.fromEntries(
          Object.entries(state.filters).map(([key, values]) => 
            [key, new Set(values as string[])]
          )
        ),
        activeType: state.activeType || 'light'
      }
    }
  } catch (error) {
    console.error("Error loading table state:", error)
  }

  return {
    searchTerm: "",
    sortConfig: { key: "", direction: "asc" },
    filters: {} as Filters,
    visibleColumns: DEFAULT_VISIBLE_COLUMNS,
    activeType: 'light'
  }
}

// Save state to session storage
const saveTableState = (state: TableState) => {
  if (typeof window === "undefined") return

  try {
    // Convert Sets to arrays for JSON serialization
    const serializedState = {
      ...state,
      filters: Object.fromEntries(Object.entries(state.filters).map(([key, values]) => [key, Array.from(values)])),
    }
    sessionStorage.setItem("tableState", JSON.stringify(serializedState))
  } catch (error) {
    console.error("Error saving table state:", error)
  }
}

// Update the color temp section to use proper type narrowing
const colorTempSection = (device: Device, column: ColumnConfig) => {
  if (!isLightDevice(device)) return null
  
  const { white_color_temp_range_k_start, white_color_temp_range_k_end } = device.device_info
  if (!white_color_temp_range_k_start || !white_color_temp_range_k_end) return null
  
  return (
    <span style={getColorTempGradientStyle(white_color_temp_range_k_start, white_color_temp_range_k_end)}>
      {column.path(device)}
    </span>
  )
}

export function DeviceGrid({ devices }: DeviceGridProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get initial state from URL or defaults
  const [searchTerm, setSearchTerm] = useState('')
  const [activeType, setActiveType] = useState<'light' | 'lock'>(
    (searchParams.get('type') as 'light' | 'lock') || 'light'
  )
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "", direction: "asc" })
  const [filters, setFilters] = useState<Filters>({})
  const [visibleColumns, setVisibleColumns] = useState<string[]>(DEFAULT_VISIBLE_COLUMNS)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const hasSeenBanner = localStorage.getItem("hasSeenBanner")
    if (!hasSeenBanner) {
      setShowBanner(true)
    }
  }, [])

  const dismissBanner = () => {
    localStorage.setItem("hasSeenBanner", "true")
    setShowBanner(false)
  }

  // Update URL when activeType changes
  const updateUrlParams = (type: 'light' | 'lock') => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('type', type)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  // Handle tab change
  const handleTypeChange = (newType: 'light' | 'lock') => {
    setActiveType(newType)
    updateUrlParams(newType)
  }

  // Ensure that the visible columns are consistent
  const visibleColumnConfigs = getColumnsForType(activeType).filter((col) => 
    visibleColumns.includes(col.key)
  )

  // Sort visibleColumnConfigs to match the order of visibleColumns
  const sortedVisibleColumnConfigs = visibleColumns
    .map((key) => visibleColumnConfigs.find((col) => col.key === key))
    .filter(Boolean) as ColumnConfig[]

  // Filter devices by type first
  const typeFilteredDevices = devices.filter(d => d.general_info.type === activeType)

  // Update filterOptions to only show relevant options for current device type
  const filterOptions = useMemo(() => {
    return visibleColumnConfigs.reduce(
      (acc, { key, path }) => {
        const values = new Set(typeFilteredDevices.map(d => String(path(d))))
        const sortedValues = Array.from(values)
          .filter(v => v !== "null" && v !== "undefined")
          .sort((a, b) => a.localeCompare(b))
        acc[key] = sortedValues
        return acc
      },
      {} as Record<string, string[]>,
    )
  }, [typeFilteredDevices, visibleColumnConfigs])

  // Filter devices based on selected filters
  const filteredDevices = typeFilteredDevices.filter((device) => {
    // Search filter
    if (searchTerm) {
      const searchFields = getSearchFields(device)
      const matchesSearch = searchFields.some((field) => 
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      if (!matchesSearch) return false
    }

    // Column filters
    for (const [column, selectedValues] of Object.entries(filters)) {
      if (selectedValues.size === 0) continue
      
      const columnConfig = visibleColumnConfigs.find((col) => col.key === column)
      if (!columnConfig) continue

      const value = String(columnConfig.path(device))
      if (!selectedValues.has(value)) return false
    }

    return true
  })

  const sortedDevices = [...filteredDevices].sort((a, b) => {
    if (!sortConfig.key) return 0

    const column = visibleColumnConfigs.find((col) => col.key === sortConfig.key)
    if (!column) return 0

    const aValue = column.path(a)
    const bValue = column.path(b)

    // Handle null/undefined values in sorting
    if (aValue == null && bValue == null) return 0
    if (aValue == null) return 1
    if (bValue == null) return -1

    return sortConfig.direction === "asc" 
      ? aValue > bValue ? 1 : -1
      : aValue < bValue ? 1 : -1
  })

  const toggleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    })
  }

  const toggleColumn = (columnKey: string) => {
    setVisibleColumns((current) =>
      current.includes(columnKey) ? current.filter((key) => key !== columnKey) : [...current, columnKey],
    )
  }

  const handleFilterChange = (column: string, values: Set<string>) => {
    setFilters((current) => ({
      ...current,
      [column]: values,
    }))
  }

  const activeFilterCount = Object.values(filters).reduce((count, values) => count + (values.size > 0 ? 1 : 0), 0)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="space-y-4">
        {showBanner && (
          <div className="bg-blue-500 text-white p-4 rounded-md">
            <p className="mb-2">Matter.party (🥳🎊🎉) is a directory of Matter-compatible devices for you to browse at your leisure. The goal is to provide a comprehensive directory to help you find the right device for your next project. This is a work in progress and it'd be even better with your help! If you have some devices you can add, please do so on <a href="https://github.com/mocha/matter" target="_blank" rel="noopener noreferrer" className="underline">Github</a>!</p>
            <Button variant="" onClick={dismissBanner}>
              Cool! Let's go!
            </Button>
          </div>
        )}
        <Tabs value={activeType} onValueChange={handleTypeChange as (value: string) => void}>
          <TabsList>
            <TabsTrigger value="light">Lights</TabsTrigger>
            <TabsTrigger value="lock">Locks</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search devices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchTerm("")}
                className="absolute right-0 top-0 h-full"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {activeFilterCount > 0 && (
            <Button
              variant="outline"
              onClick={() => setFilters({})}
              className="bg-red-50 hover:bg-red-100 border-red-200 text-red-600 hover:text-red-700"
            >
              Clear Filters ({activeFilterCount})
            </Button>
          )}
          <ColumnsDropdown 
            visibleColumns={visibleColumns} 
            onColumnToggle={toggleColumn}
            deviceType={activeType}
          />
        </div>
        <div className="rounded-md border w-full overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {sortedVisibleColumnConfigs.map((column) => (
                    <TableHead key={column.key}>
                      <div className="flex items-center gap-2">
                        {filterOptions[column.key]?.length > 0 && (
                          <FilterPopover
                            column={column.key}
                            label={column.label}
                            options={filterOptions[column.key]}
                            selectedValues={filters[column.key] || new Set()}
                            onChange={(values) => handleFilterChange(column.key, values)}
                          />
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedDevices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={visibleColumnConfigs.length} className="h-24 text-center">
                      <div className="text-muted-foreground">No results found. Try removing some filters.</div>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedDevices.map((device) => (
                    <TableRow key={device.id}>
                      {sortedVisibleColumnConfigs.map((column) => (
                        <TableCell key={column.key}>
                          {column.key === "model" ? (
                            <Link href={`/devices/${device.id}`} className="hover:underline">
                              {column.path(device)}
                            </Link>
                          ) : column.key === "matter_certified" ||
                            column.key === "direct_code" ||
                            column.key === "app_required" ? (
                            column.path(device) ? (
                              <Badge variant={column.key === "matter_certified" ? "secondary" : "default"}>Yes</Badge>
                            ) : null
                          ) : column.key === "color_temp_range" ? (
                            colorTempSection(device, column)
                          ) : (
                            column.path(device)
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Suspense>
  )
}

