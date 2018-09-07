# Hassio Addons - Kuna

HASSIO addon to pull images and status information from Kuna cameras

## General

This addon uses the APIs exposed by Kuna to pull camera images and info down from their cloud servers & communicate that info back to HA. It should create a unique sensor for each camera that is linked to the Kuna account referenced in the config, and the attributes associated with those sensors can then be used with automations, views, etc.

Using the 'recording_active' value that comes back from the main camera API, we can determine (via consistent poll) whether a given camera's motion sensor has been triggered. Also, although there isn't an API that returns a stream, we can use the push camera platform introduced with release 0.74 to feed images from the thumbnail API back into HA for the front-end. I haven't found a way to use POST requests to update camera settings, but let me know if you've discovered otherwise!

Credit to [loghound](https://github.com/loghound/kuna-camera-api) for his documentation of the APIs.

For the config options, see [setup.md](https://github.com/HITChris/hassio-addons/blob/master/Kuna/setup.md)

## Releases

### 0.0.3

- Added thumbnail image integration via HA's push camera platform

### 0.0.2

- Entity creation should correctly reflect camera name

### 0.0.1

- Release