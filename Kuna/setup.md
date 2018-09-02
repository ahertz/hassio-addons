
## Config Parameters

| Param              | Description                                                                                                                           |
|--------------------|---------------------------------------------------------------------------------------------------------------------------------------|                                                                                                                  |
| kuna_email       | Kuna email address                                                                                                                      |
| kuna_password   | Kuna password                                                                                                                      |
| refresh_seconds    | Polling interval between updates (5 or greater) |

## Config Examles

### Kuna addon options

```json
{
    "kuna_email": "MyKunaEmailAddress",
    "kuna_password": "MyKunaPassword",
    "refresh_seconds": 5
}
```

## Message Body

``` json
{
  "state": "1",
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