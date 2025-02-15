"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Device } from "@/lib/types/device"

type ColumnConfig = {
  key: string
  label: string
  group: "General" | "Device" | "Matter"
  path: (device: Device) => any
}

const COLUMNS: ColumnConfig[] = [
  { key: "make", label: "Make", group: "General", path: (d) => d.general_info.make },
  { key: "model", label: "Model", group: "General", path: (d) => d.general_info.model },
  { key: "type", label: "Type", group: "General", path: (d) => d.general_info.type },
  { key: "socket", label: "Socket", group: "Device", path: (d) => d.device_info.socket },
  { key: "bulb_shape", label: "Bulb Shape", group: "Device", path: (d) => d.device_info.bulb_shape },
  { key: "style", label: "Style", group: "Device", path: (d) => d.device_info.style },
  { key: "led_category", label: "LED Category", group: "Device", path: (d) => d.device_info.led_category },
  { key: "brightness_lm", label: "Brightness (lm)", group: "Device", path: (d) => d.device_info.brightness_lm },
  { key: "rated_power_w", label: "Rated Power (W)", group: "Device", path: (d) => d.device_info.rated_power_w },
  { key: "eqiv_power_w", label: "Equivalent Power (W)", group: "Device", path: (d) => d.device_info.eqiv_power_w },
  { key: "beam_angle_deg", label: "Beam Angle (°)", group: "Device", path: (d) => d.device_info.beam_angle_deg },
  {
    key: "color_temp_range",
    label: "Color Temp Range",
    group: "Device",
    path: (d) =>
      d.device_info.white_color_temp_range_k_start && d.device_info.white_color_temp_range_k_end
        ? `${d.device_info.white_color_temp_range_k_start}K-${d.device_info.white_color_temp_range_k_end}K`
        : null,
  },
  { key: "cri", label: "CRI", group: "Device", path: (d) => d.device_info.color_rendering_index_cri },
  { key: "matter_certified", label: "Matter Certified", group: "Matter", path: (d) => d.matter_info.matter_certified },
  { key: "direct_code", label: "Direct Code", group: "Matter", path: (d) => d.matter_info.includes_direct_matter_code },
  {
    key: "app_required",
    label: "App Required",
    group: "Matter",
    path: (d) => d.matter_info.app_required_for_full_functionality,
  },
]

interface ColumnsDropdownProps {
  visibleColumns: string[]
  onColumnToggle: (column: string) => void
}

export function ColumnsDropdown({ visibleColumns, onColumnToggle }: ColumnsDropdownProps) {
  const groups = React.useMemo(() => {
    return COLUMNS.reduce(
      (acc, column) => {
        if (!acc[column.group]) {
          acc[column.group] = []
        }
        acc[column.group].push(column)
        return acc
      },
      {} as Record<string, typeof COLUMNS>,
    )
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-2">
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.entries(groups).map(([group, columns]) => (
          <React.Fragment key={group}>
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">{group}</DropdownMenuLabel>
            {columns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.key}
                checked={visibleColumns.includes(column.key)}
                onCheckedChange={() => onColumnToggle(column.key)}
              >
                <span className="flex items-center">
                  {column.label}
                  {visibleColumns.includes(column.key) && <Check className="ml-auto h-4 w-4" />}
                </span>
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { COLUMNS }
export type { ColumnConfig }

