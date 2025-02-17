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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Device } from "@/lib/schema/device"
import type { ColumnConfig } from "@/lib/types/column-config"
import { SHARED_COLUMNS, DEVICE_COLUMNS } from "@/lib/types/columns"
import { useSearchParams, useRouter } from 'next/navigation'
import { filterDevices } from "@/lib/utils/device-utils"
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
  activeType?: 'light' | 'lock'
}

// Define default columns by device type
const DEFAULT_VISIBLE_COLUMNS_BY_TYPE: Record<'light' | 'lock', string[]> = {
  light: [
    "make",
    "model",
    "in_production",
    "msrp_ea",
    "socket",
    "bulb_shape",
    "style",
    "led_category",
    "housing_material",
    "brightness_lm",
    "white_color_temp_range_k_start",
    "white_color_temp_range_k_end"
  ],
  lock: [
    "make",
    "model",
    "in_production",
    "msrp_ea",
    "unlock_with_pin",
    "unlock_with_rfid",
    "unlock_with_fingerprint",
    "unlock_with_facial_recognition",
    "battery",
    "battery_type"
  ]
};

// Load state from session storage
const loadTableState = (): TableState => {
  if (typeof window === "undefined") {
    return {
      searchTerm: "",
      sortConfig: { key: "", direction: "asc" },
      filters: {} as Filters,
      visibleColumns: DEFAULT_VISIBLE_COLUMNS_BY_TYPE['light'],
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
    visibleColumns: DEFAULT_VISIBLE_COLUMNS_BY_TYPE['light'],
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

// Get all columns for a device type
const getAllColumns = (deviceType: 'light' | 'lock'): ColumnConfig[] => {
  console.log("Getting columns for device type:", deviceType);
  
  const deviceColumns = DEVICE_COLUMNS[deviceType];
  console.log("Device-specific columns:", deviceColumns);
  
  if (!deviceColumns) {
    throw new Error(`No columns found for device type: ${deviceType}`);
  }

  console.log("SHARED_COLUMNS:", SHARED_COLUMNS);
  
  // Combine columns and ensure no duplicates using Set
  const allColumns = [
    ...SHARED_COLUMNS,
    ...deviceColumns
  ];
  console.log("Combined columns before deduplication:", allColumns);

  // Remove duplicates while preserving order
  const seen = new Set();
  const finalColumns = allColumns.filter(col => {
    console.log("Processing column:", col);
    if (seen.has(col.key)) {
      console.log(`Duplicate found for ${col.key}`);
      return false;
    }
    seen.add(col.key);
    return true;
  });
  
  console.log("Final columns after deduplication:", finalColumns);
  return finalColumns;
};

// Add column width configurations
const COLUMN_MIN_WIDTHS: Record<string, string> = {
  model: "min-w-[300px]",
  make: "min-w-[120px]",
  socket: "min-w-[100px]",
  // Add more column widths as needed
};

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
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    DEFAULT_VISIBLE_COLUMNS_BY_TYPE[activeType]
  )
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

  // Get visible column configs
  const visibleColumnConfigs = useMemo(() => {
    console.log("Active type:", activeType);
    console.log("All available columns:", getAllColumns(activeType));
    console.log("Visible column keys:", visibleColumns);
    
    const filtered = getAllColumns(activeType).filter(column => {
      const isVisible = visibleColumns.includes(column.key);
      console.log(`Column ${column.key}: visible = ${isVisible}`);
      return isVisible;
    });
    
    console.log("Final filtered columns:", filtered);
    return filtered;
  }, [visibleColumns, activeType]);

  // Filter devices by type first
  const typeFilteredDevices = devices.filter(d => d.type === activeType)

  // Update filterOptions to only show relevant options for current device type
  const filterOptions = useMemo(() => {
    return visibleColumnConfigs
      .filter(col => col.metadata?.filterable) // Only include filterable columns
      .reduce(
        (acc, { key, path }) => {
          const values = new Set(typeFilteredDevices.map(d => String(path(d))));
          const sortedValues = Array.from(values)
            .filter(v => v !== "null" && v !== "undefined")
            .sort((a, b) => a.localeCompare(b));
          acc[key] = sortedValues;
          return acc;
        },
        {} as Record<string, string[]>,
      );
  }, [typeFilteredDevices, visibleColumnConfigs]);

  // Filter devices based on selected filters
  const filteredDevices = filterDevices(typeFilteredDevices, searchTerm, filters);

  // Sort devices
  const sortedDevices = useMemo(() => {
    console.log("Sorting with config:", sortConfig);
    if (!sortConfig.key) return filteredDevices;

    return [...filteredDevices].sort((a, b) => {
      const column = visibleColumnConfigs.find(col => col.key === sortConfig.key);
      console.log("Sort column:", column);
      if (!column) return 0;

      const aValue = column.path(a);
      const bValue = column.path(b);
      console.log(`Comparing ${aValue} to ${bValue}`);

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      return sortConfig.direction === "asc" 
        ? aValue > bValue ? 1 : -1
        : aValue < bValue ? 1 : -1;
    });
  }, [filteredDevices, sortConfig, visibleColumnConfigs]);

  const toggleSort = (key: string) => {
    console.log("Toggling sort for:", key);
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const toggleColumn = (columnKey: string) => {
    setVisibleColumns((current) => {
      const newColumns = current.includes(columnKey) 
        ? current.filter((key) => key !== columnKey) 
        : [...current, columnKey]
      return newColumns
    })
  }

  const handleFilterChange = (column: string, values: Set<string>) => {
    setFilters((current) => ({
      ...current,
      [column]: values,
    }))
  }

  const activeFilterCount = Object.values(filters).reduce(
    (count, values) => count + (values.size > 0 ? 1 : 0), 
    0
  )

  // Update visibleColumns when activeType changes
  useEffect(() => {
    setVisibleColumns(DEFAULT_VISIBLE_COLUMNS_BY_TYPE[activeType]);
  }, [activeType]);

  console.log("Initial devices:", devices.length);
  console.log("Type filtered devices:", typeFilteredDevices.length);
  console.log("Active type:", activeType);
  console.log("Sorted Devices:", sortedDevices);
  console.log("Visible Column Configs:", visibleColumnConfigs);
  console.log("DEVICE_COLUMNS:", DEVICE_COLUMNS);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="space-y-4">
        {showBanner && (
          <div className="bg-blue-500 text-white p-4 rounded-md">
            <p className="mb-2">Matter.party (🥳🎊🎉) is a directory of Matter-compatible devices for you to browse at your leisure. The goal is to provide a comprehensive directory to help you find the right device for your next project. This is a work in progress and it'd be even better with your help! If you have some devices you can add, please do so on <a href="https://github.com/mocha/matter" target="_blank" rel="noopener noreferrer" className="underline">Github</a>!</p>
            <Button variant="default" onClick={dismissBanner}>
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
                  {visibleColumnConfigs.map((column) => (
                    <TableHead 
                      key={column.key}
                      className={cn(
                        COLUMN_MIN_WIDTHS[column.key],
                        column.metadata?.sortable && "cursor-pointer select-none",
                      )}
                      onClick={() => column.metadata?.sortable && toggleSort(column.key)}
                    >
                      <div className="flex items-center gap-2">
                        {column.label}
                        {column.metadata?.sortable && (
                          <span className="text-xs opacity-50">
                            {sortConfig.key === column.key 
                              ? sortConfig.direction === "asc" 
                                ? "↑" 
                                : "↓"
                              : "↕"}
                          </span>
                        )}
                        {column.metadata?.filterable && (
                          <FilterPopover
                            column={column}
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
                      {visibleColumnConfigs.map((column) => {
                        const value = column.path(device)
                        
                        return (
                          <TableCell 
                            key={column.key}
                            className={COLUMN_MIN_WIDTHS[column.key]}
                          >
                            {value != null ? (
                              column.key === "model" ? (
                                <Link 
                                  href={`/devices/${device.id}`}
                                  className="text-primary hover:underline"
                                >
                                  {value}
                                </Link>
                              ) : column.metadata?.renderBadge ? (
                                value === true || value === 'Yes' ? (
                                  <Badge variant="secondary">Yes</Badge>
                                ) : (
                                  <Badge variant="outline">No</Badge>
                                )
                              ) : (
                                <span>{value}</span>
                              )
                            ) : (
                              <span className="text-muted-foreground">Not specified</span>
                            )}
                          </TableCell>
                        )
                      })}
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

