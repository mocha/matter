"use client"

import * as React from "react"
import { Check, X, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { type ColumnConfig } from "@/lib/types/column-config"
import { useState } from "react"

interface FilterPopoverProps {
  column: ColumnConfig
  label: string
  options: string[]
  selectedValues: Set<string>
  onChange: (values: Set<string>) => void
}

export function FilterPopover({
  column,
  label,
  options,
  selectedValues,
  onChange
}: FilterPopoverProps) {
  const [open, setOpen] = useState(false)

  const toggleOption = (value: string) => {
    const newValues = new Set(selectedValues)
    if (newValues.has(value)) {
      newValues.delete(value)
    } else {
      newValues.add(value)
    }
    onChange(newValues)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="-ml-3 h-8">
          <Filter className={cn("h-4 w-4", selectedValues.size > 0 && "text-primary")} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <div className="flex items-center justify-between p-2">
          <div className="text-sm font-medium">Filter {label}</div>
          {selectedValues.size > 0 && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onChange(new Set())}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="h-[300px]">
          <div className="p-2">
            {options.map((option) => {
              const isSelected = selectedValues.has(option);
              const displayValue = option.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
              
              return (
                <div
                  key={option}
                  className={cn(
                    "flex cursor-pointer items-center py-1 px-2 text-sm rounded-md",
                    isSelected && "bg-muted",
                  )}
                  onClick={() => toggleOption(option)}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded border",
                      isSelected && "bg-primary border-primary",
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                  </div>
                  {displayValue}
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

