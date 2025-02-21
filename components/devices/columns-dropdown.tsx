"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SHARED_COLUMNS, DEVICE_COLUMNS } from "@/lib/types/columns"

interface ColumnsDropdownProps {
  visibleColumns: string[]
  onColumnToggle: (column: string) => void
  deviceType: 'light' | 'lock' | 'sensor' | 'controller'
}

export function ColumnsDropdown({
  visibleColumns,
  onColumnToggle,
  deviceType
}: ColumnsDropdownProps) {
  const [open, setOpen] = React.useState(false)
  const allColumns = [...SHARED_COLUMNS, ...DEVICE_COLUMNS[deviceType]];
  
  // Group columns by their group property
  const columnsByGroup = allColumns.reduce((acc, column) => {
    const group = column.group;
    if (!acc[group]) acc[group] = [];
    acc[group].push(column);
    return acc;
  }, {} as Record<string, typeof allColumns>);
  
  return (
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Columns</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[600px] flex flex-row gap-4 p-4">
        {Object.entries(columnsByGroup).map(([group, columns]) => (
          <div key={group} className="flex-1">
            <DropdownMenuLabel className="text-sm font-semibold">{group}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="space-y-1">
              {columns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.key}
                  className="capitalize"
                  checked={visibleColumns.includes(column.key)}
                  onSelect={(e) => e.preventDefault()}
                  onCheckedChange={() => onColumnToggle(column.key)}
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
            </div>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

