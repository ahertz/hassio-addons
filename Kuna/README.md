# Hassio Addons - Kuna

HASSIO addon to pull status information from Kuna cameras

## General

This addon uses the APIs Kuna has exposed to pull camera info down from their cloud servers & communicate that info back to HA in the form of sensor entities. It should create a unique sensor for each camera that is linked to the Kuna account referenced in the config, and the attributes associated with those sensors can then be used with automations, views, etc.

Using the 'recording_active' value that comes back from the main camera API, we can determine (via consistent poll) whether a given camera's motion sensor has been triggered recently. And although there isn't an API that returns a LIVE stream, we can use the push camera platform introduced with HA release 0.74 to feed images from the thumbnail API back into HA for front-end display. I haven't found a way to use POST requests to update camera settings, and there doesn't seem to be a webhook that could let us avoid continuous polling for presence dectection, but feel free to contribute!

Credit to [loghound](https://github.com/loghound/kuna-camera-api) for his documentation of the APIs.

For the config options, see [setup.md](https://github.com/HITChris/hassio-addons/blob/master/Kuna/setup.md)

## Releases

### 0.0.3

- Added thumbnail integration via HA's push camera platform

### 0.0.2

- Entity creation should correctly reflect camera name

### 0.0.1

- Release