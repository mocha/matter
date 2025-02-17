import type { Device } from "@/lib/schema/device"
import type { ColumnMetadata } from "@/lib/schema/device"

export type ColumnConfig = {
  key: string;
  label: string;
  group: ColumnMetadata['group'];
  metadata: ColumnMetadata;
  path: (device: Device) => any;
};

export type ColumnPath = (device: Device) => string | number | boolean | null | undefined; 