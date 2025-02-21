import { z } from 'zod';
import type { ColumnConfig } from '@/lib/types/column-config';

// Define metadata type
export type ColumnMetadata = {
  label: string;
  group: 'General' | 'Product' | 'Connectivity' | 'Device Features';
  sortable?: boolean;
  filterable?: boolean;
  renderBadge?: boolean;
};

// Create a function to attach metadata to a schema field
function withMetadata<T extends z.ZodType>(
  schema: T,
  metadata: ColumnMetadata
): T & { metadata: ColumnMetadata } {
  const schemaWithMeta = Object.assign(schema, { metadata });
  return schemaWithMeta;
}

// Base shared schemas
export const GeneralInfoSchema = z.object({
  make: withMetadata(z.string(), { label: "Make", group: "General", sortable: true, filterable: true }),
  model: withMetadata(z.string(), { label: "Model", group: "General", sortable: true, filterable: true }),
  type: withMetadata(z.enum(['light', 'lock', 'sensor', 'controller']), { label: "Type", group: "General" })
});

export const ProductInfoSchema = z.object({
  name: withMetadata(
    z.string().nullable().optional(), 
    { label: "Product Name", group: "Product", sortable: true, filterable: true }
  ),
  in_production: withMetadata(
    z.boolean().nullable().optional(),
    { label: "In Production", group: "Product", sortable: true, filterable: true, renderBadge: true }
  ),
  sku: withMetadata(
    z.string().nullable().optional(), 
    { label: "SKU", group: "Product", sortable: true }
  ),
  ean_or_upc: withMetadata(
    z.string().nullable().optional(), 
    { label: "EAN/UPC", group: "Product", sortable: true }
  ),
  official_product_page_url: withMetadata(
    z.string().nullable().optional(), 
    { label: "Official Product Page", group: "Product" }
  ),
  page_last_checked: withMetadata(
    z.string().nullable().optional(), 
    { label: "Page Last Checked", group: "Product" }
  ),
  spec_sheet_url: withMetadata(
    z.string().nullable().optional(), 
    { label: "Spec Sheet URL", group: "Product" }
  ),
  msrp_ea: withMetadata(
    z.number().nullable().optional(),
    { label: "MSRP", group: "Product", sortable: true}
  ),
  price_last_checked: withMetadata(
    z.string().nullable().optional(), 
    { label: "Price Last Checked", group: "Product" }
  )
}).partial();

export const ConnectivityInfoSchema = z.object({
  matter_certified: withMetadata(z.boolean().nullable(), { label: "Matter Certified", group: "Connectivity", sortable: true, filterable: true, renderBadge: true }),
  includes_direct_matter_code: withMetadata(z.boolean().nullable(), { label: "Direct Code", group: "Connectivity", sortable: true, filterable: true, renderBadge: true }),
  app_required_for_full_functionality: withMetadata(z.boolean().nullable(), { label: "App Required", group: "Connectivity", sortable: true, filterable: true }),
  works_with_homekit: withMetadata(z.boolean().nullable(), { label: "HomeKit", group: "Connectivity", sortable: true, filterable: true, renderBadge: true }),
  works_with_alexa: withMetadata(z.boolean().nullable(), { label: "Alexa", group: "Connectivity", sortable: true, filterable: true, renderBadge: true }),
  works_with_google_assistant: withMetadata(z.boolean().nullable(), { label: "Google Assistant", group: "Connectivity", sortable: true, filterable: true, renderBadge: true }),
  works_with_matter: withMetadata(z.boolean().nullable(), { label: "Matter", group: "Connectivity", sortable: true, filterable: true, renderBadge: true }),
  works_with_zigbee: withMetadata(z.boolean().nullable(), { label: "Zigbee", group: "Connectivity", sortable: true, filterable: true, renderBadge: true }),
  works_with_zwave: withMetadata(z.boolean().nullable(), { label: "Z-Wave", group: "Connectivity", sortable: true, filterable: true, renderBadge: true }),
  works_with_thread: withMetadata(z.boolean().nullable(), { label: "Thread", group: "Connectivity", sortable: true, filterable: true, renderBadge: true }),
  works_with_bluetooth: withMetadata(z.boolean().nullable(), { label: "Bluetooth", group: "Connectivity", sortable: true, filterable: true, renderBadge: true }),
  works_with_wifi: withMetadata(z.boolean().nullable(), { label: "WiFi", group: "Connectivity", sortable: true, filterable: true, renderBadge: true })
}).partial();

// Device-specific schemas
export const LightDeviceInfoSchema = z.object({
  socket: withMetadata(
    z.string().nullable().optional(),
    { label: "Socket", group: "Device Features", sortable: true, filterable: true }
  ),
  bulb_shape: withMetadata(z.string().nullable().optional(),{ label: "Bulb Shape", group: "Device Features", sortable: true, filterable: true }),
  style: withMetadata(z.string().nullable(), { label: "Style", group: "Device Features", sortable: true, filterable: true }),
  led_category: withMetadata(z.string().nullable(), { label: "LED Category", sortable: true, filterable: true, group: "Device Features" }),
  housing_material: withMetadata(z.string().nullable(), { label: "Housing Material", group: "Device Features", sortable: true, filterable: true }),
  bulb_lens_material: withMetadata(z.string().nullable(), { label: "Lens Material", group: "Device Features", sortable: true, filterable: true }),
  brightness_lm: withMetadata(z.number().nullable().optional(),{ label: "Brightness (lm)", group: "Device Features", sortable: true }
  ),
  rated_power_w: withMetadata(z.number().nullable(), { label: "Rated Power (W)", group: "Device Features", sortable: true }),
  eqiv_power_w: withMetadata(z.number().nullable(), { label: "Equivalent Power (W)", group: "Device Features", sortable: true }),
  beam_angle_deg: withMetadata(z.number().nullable(), { label: "Beam Angle (°)", group: "Device Features", sortable: true }),
  color_rendering_index_cri: withMetadata(z.number().nullable(), { label: "CRI", group: "Device Features", sortable: true }),
  white_color_temp_range_k_start: withMetadata(z.number().nullable(), { label: "Min Color Temp (K)", group: "Device Features", sortable: true }),
  white_color_temp_range_k_end: withMetadata(z.number().nullable(), { label: "Max Color Temp (K)", group: "Device Features", sortable: true })
}).partial();

export const LockDeviceInfoSchema = z.object({
  unlock_with_pin: z.boolean().optional(),
  unlock_with_rfid: z.boolean().optional(),
  unlock_with_fingerprint: z.boolean().optional(),
  unlock_with_facial_recognition: z.boolean().optional(),
  unlock_with_proprietary: z.boolean().optional(),
  battery: z.boolean().optional(),
  battery_type: z.string().optional()
});

export const SensorDeviceInfoSchema = z.object({
  sensors_contact: withMetadata(
    z.boolean().nullable().optional(),
    { label: "Contact Sensor", group: "Device Features", sortable: true, filterable: true, renderBadge: true }
  ),
  sensors_temperature: withMetadata(
    z.boolean().nullable().optional(),
    { label: "Temperature Sensor", group: "Device Features", sortable: true, filterable: true, renderBadge: true }
  ),
  sensors_humidity: withMetadata(
    z.boolean().nullable().optional(),
    { label: "Humidity Sensor", group: "Device Features", sortable: true, filterable: true, renderBadge: true }
  ),
  sensors_illuminance: withMetadata(
    z.boolean().nullable().optional(),
    { label: "Illuminance Sensor", group: "Device Features", sortable: true, filterable: true, renderBadge: true }
  ),
  sensors_air_quality: withMetadata(
    z.boolean().nullable().optional(),
    { label: "Air Quality Sensor", group: "Device Features", sortable: true, filterable: true, renderBadge: true }
  ),
  sensors_sound: withMetadata(
    z.boolean().nullable().optional(),
    { label: "Sound Sensor", group: "Device Features", sortable: true, filterable: true, renderBadge: true }
  ),
  sensors_air_pressure: withMetadata(
    z.boolean().nullable().optional(),
    { label: "Air Pressure Sensor", group: "Device Features", sortable: true, filterable: true, renderBadge: true }
  ),
  battery: withMetadata(
    z.boolean().nullable().optional(),
    { label: "Battery Powered", group: "Device Features", sortable: true, filterable: true, renderBadge: true }
  ),
  battery_type: withMetadata(
    z.string().nullable().optional(),
    { label: "Battery Type", group: "Device Features", sortable: true, filterable: true }
  )
}).partial();

export const ControllerDeviceInfoSchema = z.object({
  hub_type: withMetadata(
    z.enum(['bridge', 'gateway', 'coordinator']).nullable(),
    { label: "Hub Type", group: "Device Features", sortable: true, filterable: true }
  ),
  max_child_devices: withMetadata(
    z.number().nullable(),
    { label: "Max Child Devices", group: "Device Features", sortable: true }
  ),
  ethernet_port: withMetadata(
    z.boolean().nullable(),
    { label: "Ethernet Port", group: "Device Features", sortable: true, filterable: true, renderBadge: true }
  ),
  ir_controller: withMetadata(
    z.boolean().nullable(),
    { label: "IR Controller", group: "Device Features", sortable: true, filterable: true, renderBadge: true }
  ),
  supports_device_types: withMetadata(
    z.array(z.string()).nullable(),
    { label: "Supported Devices", group: "Device Features", sortable: true, filterable: true }
  )
}).partial();

// Base device schema without device_info
const BaseDeviceWithoutInfo = z.object({
  id: z.string(),
  type: z.enum(['light', 'lock', 'sensor', 'controller']),
  general_info: GeneralInfoSchema.omit({ type: true }), // Only make and model required
  product_info: ProductInfoSchema.nullable(),
  connectivity_info: ConnectivityInfoSchema.nullable(),
  notes_content: z.string().default(""),
  path: z.string(),
  gh_file_url: z.string()
});

// Lock device schema
export const LockDeviceSchema = BaseDeviceWithoutInfo.extend({
  type: z.literal('lock'),
  device_info: LockDeviceInfoSchema.nullable()
});

// Light device schema
export const LightDeviceSchema = BaseDeviceWithoutInfo.extend({
  type: z.literal('light'),
  device_info: LightDeviceInfoSchema.nullable()
});

// Add Sensor device schema (after LockDeviceSchema)
export const SensorDeviceSchema = BaseDeviceWithoutInfo.extend({
  type: z.literal('sensor'),
  device_info: SensorDeviceInfoSchema.nullable()
});

// Add Controller device schema (after SensorDeviceSchema)
export const ControllerDeviceSchema = BaseDeviceWithoutInfo.extend({
  type: z.literal('controller'),
  device_info: ControllerDeviceInfoSchema.nullable()
});

// Union of all device types
export const DeviceSchema = z.discriminatedUnion('type', [
  LightDeviceSchema,
  LockDeviceSchema,
  SensorDeviceSchema,
  ControllerDeviceSchema
]);

// Export TypeScript types
export type GeneralInfo = z.infer<typeof GeneralInfoSchema>;
export type ProductInfo = z.infer<typeof ProductInfoSchema>;
export type ConnectivityInfo = z.infer<typeof ConnectivityInfoSchema>;
export type LightDeviceInfo = z.infer<typeof LightDeviceInfoSchema>;
export type LockDeviceInfo = z.infer<typeof LockDeviceInfoSchema>;
export type SensorDeviceInfo = z.infer<typeof SensorDeviceInfoSchema>;
export type ControllerDeviceInfo = z.infer<typeof ControllerDeviceInfoSchema>;
export type BaseDevice = z.infer<typeof BaseDeviceWithoutInfo>;
export type LightDevice = z.infer<typeof LightDeviceSchema>;
export type LockDevice = z.infer<typeof LockDeviceSchema>;
export type SensorDevice = z.infer<typeof SensorDeviceSchema>;
export type ControllerDevice = z.infer<typeof ControllerDeviceSchema>;
export type Device = z.infer<typeof DeviceSchema>;

// Add the helper function
export function generateColumnConfigs(schema: z.ZodObject<any>) {
  const configs: ColumnConfig[] = [];

  for (const [key, field] of Object.entries(schema.shape)) {

    // Handle optional fields by unwrapping them
    const unwrappedField = field instanceof z.ZodOptional ? field._def.innerType : field;
    
    const metadata = unwrappedField.metadata;
    
    if (metadata) {
      configs.push({
        key,
        ...metadata,
        path: (device: Device) => {
          if (key in device) return device[key as keyof Device];
          if (key in device.general_info) return device.general_info[key as keyof typeof device.general_info];
          if (device.product_info && key in device.product_info) return device.product_info[key as keyof typeof device.product_info];
          if (device.connectivity_info && key in device.connectivity_info) return device.connectivity_info[key as keyof typeof device.connectivity_info];
          if (device.device_info && key in device.device_info) return device.device_info[key as keyof typeof device.device_info];
          return null;
        }
      });
    }
  }
  
  return configs;
} 