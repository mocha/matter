import { z } from 'zod';
import { 
  GeneralInfoSchema, 
  ConnectivityInfoSchema,
  ProductInfoSchema,
  LightDeviceInfoSchema,
  LockDeviceInfoSchema,
  SensorDeviceInfoSchema,
  ControllerDeviceInfoSchema
} from './device';

// Create a variant-specific product info schema that uses strings for dates
export const VariantSchema = z.object({
  name: z.string(),
  in_production: z.boolean().nullable().optional(),
  sku: z.string().nullable().optional(),
  ean_or_upc: z.string().nullable().optional(),
  official_product_page_url: z.string().nullable().optional(),
  page_last_checked: z.string().nullable().optional(),
  spec_sheet_url: z.string().nullable().optional(),
  msrp_ea: z.number().nullable().optional(),
  price_last_checked: z.string().nullable().optional(),
  variant_device_info: z.record(z.unknown()).optional(),
});

export const MarkdownSchema = z.object({
  general_info: GeneralInfoSchema,
  product_info: z.object({
    variants: z.array(VariantSchema).optional(),
  }).merge(ProductInfoSchema),
  connectivity_info: ConnectivityInfoSchema,
  device_info: z.record(z.any())
}).refine((data) => {
  switch (data.general_info.type) {
    case 'light':
      return LightDeviceInfoSchema.safeParse(data.device_info).success;
    case 'lock':
      return LockDeviceInfoSchema.safeParse(data.device_info).success;
    case 'sensor':
      return SensorDeviceInfoSchema.safeParse(data.device_info).success;
    case 'controller':
      // Transform array to match schema expectation
      const deviceInfo = {
        ...data.device_info,
        supports_device_types: Array.isArray(data.device_info.supports_device_types) 
          ? data.device_info.supports_device_types 
          : null
      };
      return ControllerDeviceInfoSchema.safeParse(deviceInfo).success;
    default:
      return false;
  }
}, {
  message: "device_info must match the schema for the specified device type"
});

export type Markdown = z.infer<typeof MarkdownSchema>;
export type Variant = z.infer<typeof VariantSchema>; 