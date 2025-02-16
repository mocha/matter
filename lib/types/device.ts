// Base shared types
export type GeneralInfo = {
  make: string
  model: string
  type: 'light' | 'lock'  // Explicitly define allowed types
}

export type ProductInfo = {
  name?: string | null
  in_production?: boolean | null
  sku?: string | null
  ean_or_upc?: string | null
  official_product_page_url?: string | null
  page_last_checked?: Date | null
  spec_sheet_url?: string | null
  msrp_ea?: number | null
  price_last_checked?: Date | null
}

export type MatterInfo = {
  matter_certified?: boolean | null
  includes_direct_matter_code?: boolean | null
  app_required_for_full_functionality?: boolean | null
}

// Base Device interface that all devices must implement
export interface BaseDevice {
  id: string
  general_info: GeneralInfo
  product_info: ProductInfo
  connectivity_info?: MatterInfo | null
  notes_content: string
  path: string
  gh_file_url: string
}

// Light-specific device info
export interface LightDeviceInfo {
  socket?: string | null
  bulb_shape?: string | null
  style?: string | null
  led_category?: string | null
  housing_material?: string | null
  bulb_lens_material?: string | null
  brightness_lm?: number | null
  rated_power_w?: number | null
  eqiv_power_w?: number | null
  beam_angle_deg?: number | null
  white_color_temp_range_k_start?: number | null
  white_color_temp_range_k_end?: number | null
  color_rendering_index_cri?: number | null
}

// Lock-specific device info
export interface LockDeviceInfo {
  unlock_with_pin?: boolean | null
  unlock_with_rfid?: boolean | null
  unlock_with_fingerprint?: boolean | null
  unlock_with_facial_recognition?: boolean | null
  unlock_with_proprietary?: boolean | null
  bluetooth?: boolean | null
  wifi?: boolean | null
  battery?: boolean | null
  battery_type?: string | null
}

// Type-specific device interfaces
export interface LightDevice extends BaseDevice {
  general_info: GeneralInfo & { type: 'light' }
  device_info: LightDeviceInfo
}

export interface LockDevice extends BaseDevice {
  general_info: GeneralInfo & { type: 'lock' }
  device_info: LockDeviceInfo
}

// Union type for all possible devices
export type Device = LightDevice | LockDevice

