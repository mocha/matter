import type { Device } from "@/lib/schema/device"
import { 
  DeviceSchema, 
  GeneralInfoSchema, 
  ProductInfoSchema, 
  ConnectivityInfoSchema, 
  LightDeviceInfoSchema, 
  LockDeviceInfoSchema, 
  generateColumnConfigs } from "@/lib/schema/device";

// Generate column configs from schemas
const generalColumns = generateColumnConfigs(GeneralInfoSchema);
const productColumns = generateColumnConfigs(ProductInfoSchema);
const connectivityColumns = generateColumnConfigs(ConnectivityInfoSchema);
const lightColumns = generateColumnConfigs(LightDeviceInfoSchema);
const lockColumns = generateColumnConfigs(LockDeviceInfoSchema);

// Export shared columns
export const SHARED_COLUMNS = [
  ...generalColumns,
  ...productColumns,
  ...generateColumnConfigs(ConnectivityInfoSchema)
].map(col => ({
  ...col,
  metadata: {
    ...col.metadata,  // Spread original metadata first
    sortable: col.metadata?.sortable ?? true,
    filterable: col.metadata?.filterable ?? false
  }
}));

// Export device-specific columns
export const DEVICE_COLUMNS = {
  light: lightColumns.map(col => ({
    ...col,
    metadata: {
      sortable: true,  // Explicitly set metadata
      filterable: true,
      ...col.metadata
    }
  })),
  lock: lockColumns.map(col => ({
    ...col,
    metadata: {
      sortable: true,  // Explicitly set metadata
      filterable: true,
      ...col.metadata
    }
  }))
} as const;

// Export types for use in other parts of the application
export type ColumnPath = (device: Device) => string | number | boolean | null | undefined;

// Export the column config type
export type ColumnConfig = {
  key: string;
  label: string;
  group: 'General' | 'Product' | 'Connectivity' | 'Device Features';
  metadata: {
    sortable?: boolean;
    filterable?: boolean;
    renderBadge?: boolean;
  };
  path: (device: any) => any;
}; 