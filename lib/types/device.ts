export interface GeneralInfo {
  make: string
  model: string
  type: string
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
  variant_device_info?: DeviceInfo | null
  variants?: ProductInfo[]
}

export interface MatterInfo {
  matter_certified: boolean | null
  includes_direct_matter_code: boolean | null
  app_required_for_full_functionality: boolean | null
}

export interface DeviceInfo {
  socket: string
  bulb_shape: string
  style: string
  led_category: string
  housing_material: string
  bulb_lens_material: string
  brightness_lm: number | null
  rated_power_w: number | null
  eqiv_power_w: number | null
  beam_angle_deg: number | null
  white_color_temp_range_k_start: number | null
  white_color_temp_range_k_end: number | null
  color_rendering_index_cri: number | null
}

export type Device = {
  id: string
  general_info: {
    make: string
    model: string
    type: string
  }
  product_info: ProductInfo
  matter_info?: {
    matter_certified?: boolean | null
    includes_direct_matter_code?: boolean | null
    app_required_for_full_functionality?: boolean | null
  } | null
  device_info?: DeviceInfo | null
  notes_content: string
  path: string
  gh_file_url: string
}

