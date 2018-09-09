
## Config Parameters

| Param              | Description                                        |
|--------------------|----------------------------------------------------|
| kuna_email         | Kuna account email address                         |
| kuna_password      | Kuna account password                              |
| refresh_seconds    | Polling interval between updates (10s or greater)  |
| save_thumbnail     | If the current thumbnail image should be brought   |
|                    | back to HA as a camera. Options are true or false. |
|                    | True requires that push camera platform been       |
|                    | configured in configuration.yaml                  |

## Config Example

### Addon Options

```json
{
    "kuna_email": "MyKunaEmailAddress",
    "kuna_password": "MyKunaPassword",
    "refresh_seconds": 10,
    "save_thumbnail": "true"
}
```

### configuration.yaml

```yaml
camera:
  - platform: push
      name: MyKunaCameraName
```

## Sensor Payload

``` json
{
  "state": true,
  "attributes": {
    "friendly_name": "Kuna",
    "id": 23231,
    "serial_number": OOKNBLSDDS13100736,
    "name": "Kuna",
    "timezone": "America/Chicago",
    "bulb_on": true,
    "alarm_on": false,
    "led_mask": false,
    "sensitivity": 12,
    "volume": 100,
    "notifications_enabled": true,
    "motion_timeout": 30,
    "recording_active": false,
    "brightness": 100
  }
}
```