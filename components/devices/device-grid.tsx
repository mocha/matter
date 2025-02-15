"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, Search, X } from "lucide-react"
import { ColumnsDropdown, COLUMNS } from "./columns-dropdown"
import { FilterPopover } from "./filter-popover"
import { convertKelvinToRGB } from "@/lib/utils/temp-converter"
import type { Device } from "@/lib/types/device"
import { cn } from "@/lib/utils"

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
}

// Default visible columns
const DEFAULT_VISIBLE_COLUMNS = ["model", "make", "led_category", "socket", "matter_certified", "direct_code"]

// Columns that can be filtered
const FILTERABLE_COLUMNS = [
  { key: "make", path: (d: Device) => d.general_info.make },
  { key: "type", path: (d: Device) => d.general_info.type },
  { key: "socket", path: (d: Device) => d.device_info.socket },
  { key: "style", path: (d: Device) => d.device_info.style },
  { key: "led_category", path: (d: Device) => d.device_info.led_category },
  { key: "matter_certified", path: (d: Device) => d.matter_info.matter_certified },
  { key: "direct_code", path: (d: Device) => d.matter_info.includes_direct_matter_code },
  { key: "app_required", path: (d: Device) => d.matter_info.app_required_for_full_functionality },
]

// Load state from session storage
const loadTableState = (): TableState => {
  if (typeof window === "undefined") {
    return {
      searchTerm: "",
      sortConfig: { key: "", direction: "asc" },
      filters: {} as Filters,
      visibleColumns: DEFAULT_VISIBLE_COLUMNS,
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

// Function to create a color temperature gradient background style
const getColorTempGradientStyle = (startK: number, endK: number) => {
  const [startR, startG, startB] = convertKelvinToRGB(startK)
  const [endR, endG, endB] = convertKelvinToRGB(endK)
  return {
    background: `linear-gradient(to right, rgba(${startR}, ${startG}, ${startB}, 0.3), rgba(${endR}, ${endG}, ${endB}, 0.3))`,
    padding: "0.5rem",
    borderRadius: "0.25rem",
    width: "100%",
    display: "block",
  }
}

export function DeviceGrid({ devices }: DeviceGridProps) {
  // const router = useRouter()
  // const searchParams = useSearchParams()
  const initialState = loadTableState()

  const [searchTerm, setSearchTerm] = useState(initialState.searchTerm)
  const [sortConfig, setSortConfig] = useState<SortConfig>(initialState.sortConfig)
  const [filters, setFilters] = useState<Filters>(initialState.filters)
  const [visibleColumns, setVisibleColumns] = useState<string[]>(initialState.visibleColumns)

  // Save state when it changes
  useEffect(() => {
    const state: TableState = {
      searchTerm,
      sortConfig,
      filters,  // Keep as Set<string>
      visibleColumns,
    }
    saveTableState(state)
  }, [searchTerm, sortConfig, filters, visibleColumns])

  // Get unique values for each filterable column
  const filterOptions = useMemo(() => {
    return FILTERABLE_COLUMNS.reduce(
      (acc, { key, path }) => {
        const values = new Set(devices.map(d => String(path(d))))  // Convert all values to strings
        const sortedValues = Array.from(values).sort((a, b) => {
          if (a === "null") return 1
          if (b === "null") return -1
          return a.localeCompare(b)
        })
        acc[key] = sortedValues
        return acc
      },
      {} as Record<string, string[]>,
    )
  }, [devices])

  const filteredDevices = devices.filter((device) => {
    const searchFields = [
      device.general_info.make,
      device.general_info.model,
      device.device_info.socket,
      device.device_info.bulb_shape,
      device.device_info.style,
      device.device_info.led_category,
      device.product_info.variants[0]?.sku,
      device.product_info.variants[0]?.ean_or_upc,
    ]
    const matchesSearch = searchFields.some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesFilters = Object.entries(filters).every(([key, selectedValues]) => {
      if (selectedValues.size === 0) return true
      const column = FILTERABLE_COLUMNS.find((col) => col.key === key)
      if (!column) return true
      const value = String(column.path(device))
      return selectedValues.has(value)
    })

    return matchesSearch && matchesFilters
  })

  const sortedDevices = [...filteredDevices].sort((a, b) => {
    if (!sortConfig.key) return 0

    const column = COLUMNS.find((col) => col.key === sortConfig.key)
    if (!column) return 0

    const aValue = column.path(a)
    const bValue = column.path(b)

    if (sortConfig.direction === "asc") {
      return aValue > bValue ? 1 : -1
    }
    return aValue < bValue ? 1 : -1
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

  const visibleColumnConfigs = COLUMNS.filter((col) => visibleColumns.includes(col.key))

  const activeFilterCount = Object.values(filters).reduce((count, values) => count + (values.size > 0 ? 1 : 0), 0)

  return (
    <div className="space-y-4">
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
        <ColumnsDropdown visibleColumns={visibleColumns} onColumnToggle={toggleColumn} />
      </div>
      <div className="rounded-md border w-full overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {visibleColumnConfigs.map((column) => (
                  <TableHead key={column.key}>
                    {FILTERABLE_COLUMNS.some((fc) => fc.key === column.key) ? (
                      <div
                        className={cn(
                          "flex items-center",
                          (filters[column.key]?.size || 0) > 0 && "bg-blue-500/10 rounded-md",
                        )}
                      >
                        <FilterPopover
                          column={column.key}
                          label={column.label}
                          options={filterOptions[column.key] || []}
                          selectedValues={filters[column.key] || new Set()}
                          onChange={(values) => handleFilterChange(column.key, values)}
                        />
                        <Button variant="ghost" onClick={() => toggleSort(column.key)} className="h-8 w-8 p-0">
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button variant="ghost" onClick={() => toggleSort(column.key)} className="h-8 px-2 font-medium">
                        {column.label}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    )}
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
                    {visibleColumnConfigs.map((column) => (
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
                        ) : column.key === "color_temp_range" &&
                          device.device_info.white_color_temp_range_k_start &&
                          device.device_info.white_color_temp_range_k_end ? (
                          <span
                            style={getColorTempGradientStyle(
                              device.device_info.white_color_temp_range_k_start,
                              device.device_info.white_color_temp_range_k_end,
                            )}
                          >
                            {column.path(device)}
                          </span>
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
  )
}

