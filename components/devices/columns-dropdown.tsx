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
import type { ColumnConfig } from "@/lib/types/columns"
import { SHARED_COLUMNS } from "@/lib/types/columns"
import { DEVICE_COLUMNS } from "@/lib/utils/device-utils"

interface ColumnsDropdownProps {
  visibleColumns: string[]
  onColumnToggle: (column: string) => void
  deviceType: 'light' | 'lock'
}

export function ColumnsDropdown({ visibleColumns, onColumnToggle, deviceType }: ColumnsDropdownProps) {
  const [mounted, setMounted] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const groups = React.useMemo(() => {
    const deviceColumns = DEVICE_COLUMNS[deviceType]
    return {
      General: SHARED_COLUMNS.filter(c => c.group === "General"),
      Device: deviceColumns,
      Matter: SHARED_COLUMNS.filter(c => c.group === "Matter"),
    }
  }, [deviceType])

  if (!mounted) {
    return (
      <Button variant="outline" className="ml-2">
        Columns
      </Button>
    )
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
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
                onCheckedChange={() => {
                  onColumnToggle(column.key)
                  setOpen(true)
                }}
                onSelect={(e) => {
                  e.preventDefault()
                }}
              >
                <span className="flex items-center">
                  {column.label}
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

export const getColumnsForType = (type: 'light' | 'lock'): ColumnConfig[] => {
  return [
    ...SHARED_COLUMNS,
    ...DEVICE_COLUMNS[type]
  ]
}

