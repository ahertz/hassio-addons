# Hassio Addons - Kuna

HASSIO addon to pull status information from Kuna cameras

## General

This addon takes advantage of new APIs that Kuna has exposed to pull camera information down from Kuna's cloud servers & communicate that info back to HA in the form of sensor entities. It should create a unique sensor for each camera that is linked to the Kuna account referenced in the config, and the attributes associated with those sensors can then be used with automations, views, etc.

The endpoints/responses are pretty limited, but using the 'recording_active' value that comes back from the main API, we can at least determine (via consistent poll) whether a given camera's motion sensor has been triggered recently. I haven't found a way to use POST requests to update settings, and there doesn't seen to be something such as a webhook that might let us avoid the need for continuous polling, but feel free to dig into it.

Credit to [loghound](https://github.com/loghound/kuna-camera-api) for his recent documentation on the APIs.

For the config options, see [setup.md](https://github.com/HITChris/hassio-addons/blob/master/Kuna/setup.md)

## Releases

### 0.0.1

- Release.