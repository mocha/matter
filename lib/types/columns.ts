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
console.log("Generating General columns...");
const generalColumns = generateColumnConfigs(GeneralInfoSchema);
console.log("General columns:", generalColumns);

console.log("Generating Product columns...");
const productColumns = generateColumnConfigs(ProductInfoSchema);
console.log("Product columns:", productColumns);

console.log("Generating Connectivity columns...");
const connectivityColumns = generateColumnConfigs(ConnectivityInfoSchema);
console.log("Connectivity columns:", connectivityColumns);

console.log("Generating Light Device columns...");
const lightColumns = generateColumnConfigs(LightDeviceInfoSchema);
console.log("Light Device columns:", lightColumns);

console.log("Generating Lock Device columns...");
const lockColumns = generateColumnConfigs(LockDeviceInfoSchema);
console.log("Lock Device columns:", lockColumns);

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

// Add some debug logging
console.log('SHARED_COLUMNS:', SHARED_COLUMNS);
console.log('LIGHT_COLUMNS:', DEVICE_COLUMNS.light);
console.log('LOCK_COLUMNS:', DEVICE_COLUMNS.lock);

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