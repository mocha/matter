---
last_updated: 2025-02-14
last_updated_by: "@mocha"
---

# Matter device ids and types

In general, we're grouping all device types together by their top-level group (according to how it's structured in the [Matter 1.4 Device Library-Specification)(https://csa-iot.org/wp-content/uploads/2024/11/24-27351-005_Matter-1.4-Device-Library-Specification.pdf)]. If there are enough devices in a category to be broken out later, we can do so then.

All of these folders have been prepopulated in the `/devices` directory.

## Lighting
- Stored in the `/devices/lighting` directory
- Referenced as `lighting` in device frontmatter

| device_id | device_name |
| ---       | ---         |
| 0x0100    | On/Off Light |
| 0x0101    | Dimmable Light |
| 0x010C    | Color Temperature Light |
| 0x010D    | Extended Color Light |

---

## Smart plugs/outlets and other actuators
| device_id | device_name |
| ---       | ---         |
| 0x010A    | On/Off Plug-in Unit |
| 0x010B    | Dimmable Plug-In Unit |
| 0x010F    | Mounted On/Off Control |
| 0x0110    | Mounted Dimmable Load Control |
| 0x0303    | Pump |
| 0x0042    | Water Valve |

## Switches and controls
| device_id | device_name |
| ---       | ---         |
| 0x0103    | On/Off Light Switch |
| 0x0104    | Dimmer Switch |
| 0x0105    | Color Dimmer Switch |
| 0x0840    | Control Bridge |
| 0x0304    | Pump Controller |
| 0x000F    | Generic Switch | 

## Sensors
| device_id | device_name |
| ---       | ---         |
| 0x0015    | Contact Sensor |
| 0x0106    | Light Sensor |
| 0x0107    | Occupancy Sensor |
| 0x0302    | Temperature Sensor |
| 0x0305    | Pressure Sensor |
| 0x0306    | Flow Sensor |
| 0x0307    | Humidity Sensor |
| 0x0850    | On/Off Sensor |
| 0x0076    | Smoke CO Alarm |
| 0x002C    | Air Quality Sensor |
| 0x0041    | Water Freeze Detector |
| 0x0043    | Water Leak Detector |
| 0x0044    | Rain Sensor |

## Closures
| device_id | device_name |
| ---       | ---         |
| 0x000A    | Door Lock |
| 0x000B    | Door Lock Controller |
| 0x0202    | Window Covering |
| 0x0203    | Window Covering Controller |

## HVAC
| device_id | device_name |
| ---       | ---         |
| 0x0301    | Thermostat |
| 0x002B    | Fan |
| 0x002D    | Air Purifier |

## Media
| device_id | device_name |
| ---       | ---         |
| 0x0028    | Basic Video Player |
| 0x0023    | Casting Video Player |
| 0x0022    | Speaker |
| 0x0024    | Content App |
| 0x0029    | Casting Video Client |
| 0x002A    | Video Remote Control |

## Generic
| device_id | device_name |
| ---       | ---         |
| 0x0027    | Mode Select |
| 0x000E    | Aggregator |

## Robotic devices
| device_id | device_name |
| ---       | ---         |
| 0x0074    | Robotic Vacuum Cleaner |

## Appliances
| device_id | device_name |
| ---       | ---         |
| 0x0070    | Refrigerator |
| 0x0071    | Temperature Controlled Cabinet |
| 0x0072    | Room Air Conditioner |
| 0x0073    | Laundry Washer |
| 0x0075    | Dishwasher |
| 0x0077    | Cook Surface |
| 0x0078    | Cooktop | 

## Energy
| device_id | device_name |
| ---       | ---         |
| 0x0079    | Microwave Oven |
| 0x007A    | Extractor Hood |
| 0x007B    | Oven |
| 0x007C    | Laundry Dryer |

## Energy
| device_id | device_name |
| ---       | ---         |
| 0x050C    | EVSE |
| 0x050F    | Water Heater |
| 0x0017    | Solar Power |
| 0x0018    | Battery Storage |
| 0x0309    | Heat Pump |

## Network infrastructure
| device_id | device_name |
| ---       | ---         |
| 0x0090    | Network Infrastructure Manager |
| 0x0091    | Thread Border Router |


---

## References

- https://csa-iot.org/wp-content/uploads/2024/11/24-27351-005_Matter-1.4-Device-Library-Specification.pdf