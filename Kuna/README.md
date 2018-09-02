# Hassio Addons - Kuna

HASSIO addon to pull status information from Kuna cameras

## General

This add-on takes advantage of a new API that Kuna exposed to pull camera information down from Kuna's cloud service & communicate that back to HA in the form of sensor entities. It should create a unique sensor for each camera that is linked to the Kuna account passed along in the request, and the attributes associated with those sensors can then be used with automations, views, etc.

Their web service is pretty limited, but using the 'recording_active' value that comes back in the response, we can at least determine (via continuous poll) whether a given camera's motion sensor has been triggered recently. I haven't found a way to use POST requests to update camera settings, and there doesn't seen to be something such as a webhook that might let us avoid the need for continuous polling, but feel free to contribute additional endpoints that I'm not aware of :)

For the config options, see [setup.md](https://github.com/HITChris/hassio-addons/blob/master/Kuna/setup.md)

## Releases

### 0.0.1

- Initial release.