import { DeviceSchema, ColumnMetadata, Device } from '../schema/device';
import type { ColumnConfig } from '../types/columns';
import { z } from 'zod';

export function generateColumnConfigs(schema: z.ZodObject<any>): ColumnConfig[] {
  const configs: ColumnConfig[] = [];
  const seenKeys = new Set<string>();

  for (const [key, field] of Object.entries(schema.shape)) {
    // Handle optional fields by unwrapping them
    const unwrappedField = field instanceof z.ZodOptional ? field._def.innerType : field;
    const metadata = unwrappedField.metadata;
        
    if (metadata && !seenKeys.has(key)) {
      seenKeys.add(key);
      configs.push({
        key,
        label: metadata.label,
        group: metadata.group,
        metadata: {
          ...metadata,
          sortable: metadata.sortable ?? false,
          filterable: metadata.filterable ?? false
        },
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