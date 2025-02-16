import type { Device } from "./device"

export type ColumnPath = (device: Device) => string | number | boolean | null | undefined

export type ColumnConfig = {
  key: string
  label: string
  group: "General" | "Device" | "Matter"
  path: ColumnPath
}

// Shared columns that apply to all devices
export const SHARED_COLUMNS: ColumnConfig[] = [
  { key: "make", label: "Make", group: "General", path: (d) => d.general_info.make },
  { key: "model", label: "Model", group: "General", path: (d) => d.general_info.model },
  { key: "type", label: "Type", group: "General", path: (d) => d.general_info.type },
  { key: "matter_certified", label: "Matter Certified", group: "Matter", path: (d) => d.connectivity_info?.matter_certified ?? null },
  { key: "direct_code", label: "Direct Code", group: "Matter", path: (d) => d.connectivity_info?.includes_direct_matter_code ?? null },
  { key: "app_required", label: "App Required", group: "Matter", path: (d) => d.connectivity_info?.app_required_for_full_functionality ?? null },
] 