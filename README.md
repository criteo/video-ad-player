## Criteo video player

## Purpose

This library aims at rendering ad videos with a vast file (either by content or by URL).
You can import this library as a package or as a file. Both are provided in the examples

### Usage

There are two examples in the `examples/` folder of how to use the library. You could either install it with npm or you can directly include the bundled script file and css in an html file. 

The package provides two APIs to render your videos. 
- From URL: `criteoVideoPlayerFromUrl`. The script will fetch the VAST file from the URL and afterwards display the video. 
- From content: `criteoVideoPlayerFromContent`. The script will use the passed file content (expecting a stringified XML) and afterwards display the video. 

For each, you should provide a `video element` which should be an HTML element in which you want the video to be rendered. 


### Viewability measurement
To support viewability measurement, the IAB Open Measurement SDK (OM SDK) for Web requires two scripts:

- `omweb-v1.js` – the OMID JS library for the web context.
- `omid-session-client-v1.js` – used by integration partners to perform ad session activities in the JavaScript layer.

Per IAB requirements, each retailer must obtain their own build of these scripts from the IAB Tech Lab Tools Portal. This ensures the SDK is correctly registered to your organization and remains up to date with the official specification.

**Steps to download your scripts:**

1. Log in or register at the [IAB Tech Lab Tools Portal](https://tools.iabtechlab.com/login).
2. Navigate to the [Open Measurement SDK for Web](https://iabtechlab.com/standards/open-measurement-sdk/#:~:text=to%20get%20started-,OM%20Web%20Video%20SDK,-OM%20SDK%20Web) section.
3. Generate and download your **`OMSDK_<YourRetailerName>`** package.
4. Host the downloaded files in your environment or reference them from your own CDN.
    