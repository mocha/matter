"use client"

import * as React from "react"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface FilterPopoverProps {
  column: string
  label: string
  options: (string | boolean | null)[]
  selectedValues: Set<string>
  onChange: (values: Set<string>) => void
}

export function FilterPopover({ column, label, options, selectedValues, onChange }: FilterPopoverProps) {
  const [open, setOpen] = React.useState(false)

  const toggleOption = (option: string | boolean | null) => {
    const newSelected = new Set(selectedValues)
    const value = String(option)
    if (newSelected.has(value)) {
      newSelected.delete(value)
    } else {
      newSelected.add(value)
    }
    onChange(newSelected)
  }

  const clearFilter = () => {
    onChange(new Set())
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-8 px-2 font-medium hover:bg-muted/50", selectedValues.size > 0 && "bg-muted/50")}
        >
          {label}
          {selectedValues.size > 0 && (
            <Badge variant="secondary" className="ml-2 rounded-sm px-1 font-normal">
              {selectedValues.size}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <div className="flex items-center justify-between p-2">
          <div className="text-sm font-medium">Filter {label}</div>
          {selectedValues.size > 0 && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={clearFilter}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="h-[300px]">
          <div className="p-2">
            {options.map((option) => {
              const value = String(option)
              const isSelected = selectedValues.has(value)
              return (
                <div
                  key={value}
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
                  {option === null ? "Not specified" : option === true ? "Yes" : option === false ? "No" : option}
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

