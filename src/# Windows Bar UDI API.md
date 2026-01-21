# Windows Bar UDI API

## Revision History
### 20251014
1. `/v1/aio/controller/screenbrightness`
   1. Define the value range 0~100
2. `/v1/aio/camera/intelligentvideo` 
   1. Add enumeration mapping for the "mode" : 
    ```c++
    enum {
      NONE = 0,
      AUTOFRAME,
      TALKER_SWITCH,
      INTWLLIGENT_FOCUS // MULTICELL
    } 
    ```

### 20251013
1. `/v1/aio/system/wlan/scan`
   1. The WiFi information in the wlanscan response message is changed to the following
    ```json
      "phyType" : 7,      // https://learn.microsoft.com/en-us/windows/win32/nativewifi/dot11-phy-type
      "quality" : 96,     // 0~100, A percentage value that represents the signal quality of the network
      "securityType" : 9, // https://learn.microsoft.com/en-us/windows/win32/nativewifi/dot11-auth-algorithm
      "ssid" : "HOTSPOT-10F60AB37031"
    ```  
   2. Wlan scan is changed to unspecified wireless network card, return all networks searched by wireless network cards
2. `/v1/aio/system/wlan/interface`
   1. Add the following parameters, which are valid when connected is true
    ```json
      "phyType" : 7,      // https://learn.microsoft.com/en-us/windows/win32/nativewifi/dot11-phy-type
      "quality" : 96,     // 0~100, A percentage value that represents the signal quality of the network
      "securityType" : 9, // https://learn.microsoft.com/en-us/windows/win32/nativewifi/dot11-auth-algorithm
      "ssid" : "HOTSPOT-10F60AB37031"
    ```  

### 20251011
1. `/v1/aio/system/ethnet/interface` `/v1/aio/system/wlan/interface`
   1. Rename dhcpServers -> dnsServers

### 20250928
1. `/v1/aio/camera/intelligentvideo`
   1. Added description of video fence coordinates.
2. `/v1/aio/system/sound/parameters`
   1. Added description of audio fence angles.

### 20250825
1. `/v1/aio/system/info`
   1. Fix spelling errors
      1. firmwaire -> firmware
   2. Added parameter for video bar model name
   3. Added parameter for video bar serial number
   4. Added parameter for the date/time of last video bar firmware update
2. `/v1/aio/schedulingpanel/device`
   1. Rename the parameter version -> firmware
3. Added `/v1/aio/system/ethnet/interface`
   1. Supports get and notify. Notify is a full update.
4. Modified `/v1/aio/system/wlan/interface`
   1. supports get and notify, notify is a full update.
5. Added `/v1/aio/controller/screenbrightness`
6. `/v1/aio/controller/byodsupport`
   1. BYOD mode supports settings and notifications
7. Modified the built-in dsp api group
   1. Added `/v1/aio/system/sound/device`
   2. Changed `/v1/aio/mic/parameters` to `/v1/aio/system/sound/parameters` and `/v1/aio/system/sound/inputeq`
   3. Changed `/v1/aio/mic/extension` -> `/v1/aio/system/sound/extension`
   4. Changed `/v1/aio/mic/device` -> `/v1/aio/system/sound/extension/device`

### 20250818
1. The Camera API now supports only one device; messages no longer support list responses.
   1. `/v1/aio/camera/device`
   2. `/v1/aio/camera/roomstate`
   3. `/v1/aio/camera/intelligentvideo`
   4. `/v1/aio/camera/externalvideo`

### 20250813
1. API Name Changes
    | Original API | Changed to |
    | --- | --- |
    | `/v1/aio/byod/device` | `/v1/aio/controller/device` |
    | `/v1/aio/byod/sensor/state` | `/v1/aio/controller/sensorstate` |
    | `/v1/aio/system/metting/mode` | `/v1/aio/uc/meetingmode` |
2. Added Controller BYOD Support API (GET)
   - `/v1/aio/controller/byodsupport`
3. Added Controller BYOD Device Connection Status (GET & NOTIFY)
   - `/v1/aio/controller/byoddevice`
4. Added Expected Monitor Count API
   - `/v1/aio/system/monitor/extension`
5. Added Device Information API
   - `/v1/aio/system/info`
6. Added Scheduling Panel APIs
   - `/v1/aio/schedulingpanel/device`
   - `/v1/aio/schedulingpanel/environment`
   - `/v1/aio/schedulingpanel/powermode`
   - `/v1/aio/schedulingpanel/Screenrotation`
7. Modified Camera Group APIs
   - Added device ID for multi-camera compatibility (currently unsupported)
   - Removed deprecated APIs (AutoFrame/TalkerSwitch/IntelligentFocus parameters now consolidated in `/v1/aio/camera/intelligentvideo`):
     - `/v1/aio/camera/autoframe`
     - `/v1/aio/camera/talkerswitch`
     - `/v1/aio/camera/intelligentfocus`

## Overview

- This document describes the Controller, MIC, Camera and System parameter query, setting or status monitoring interface, which is a set of UDI-based interfaces. For details on UDI access, please refer to [[Device interface]](resource/english/archive/site/index.html). This document is divided into the following parts:
  - [[Reference]](https://udi.test.seewo.com/howto.html)
  - [[All Apis]](resource/english/archive/site/apis/all_index_table.html): Not applicable to this project, please refer to the API definition in this document.
  - [[Debug]](resource/english/archive/site/debug/udicli.html): The tool [udicli.exe] has been integrated in the directory where this document is located.
  - [[FAQ]](resource/english/archive/site/faq.html)
  
- The logical view of UDI Framework is as follows, which is divided into three parts: APP, UDI Server, and Service:
  - APP: business application, initiates requests to UDI Server, or subscribes to notifications from UDI Server.
  
  - UDI Server: interface gateway, responsible for forwarding APP requests to Service or forwarding Service notifications to APP.
  
  - Service: for business services, implements the underlying operation logic, Service is the smallest unit that provides an interface, and unlike a process, a process may have multiple Services.
  
  ![Logical view](resource/images/logicalview.jpg)


## Controller

### `/v1/aio/controller/device`
- Description: Controller device information  
- GET: Retrieve Controller device information  
- NOTIFY: Controller device connection status change notification  
#### GET
- Request Parameters: None  
- Response Content:  
  ```json
  {
    "connected": false,
    "firmware": "",
    "model": "",
    "name": "",
    "serial": ""
  }
  ```

#### NOTIFY
- Notification Content:  
  ```json
  {
    "connected": false,
    "firmware": "",
    "model": "",
    "name": "",
    "serial": ""
  }
  ```

### `/v1/aio/controller/hotspot`
- Description: Controller hotspot information retrieval/configuration  
- GET: Retrieve Controller hotspot information  
- SET: Configure Controller hotspot information  
- NOTIFY: Controller hotspot information change notification  
#### GET
- Request Parameters: None  
- Response Content:  
  ```json
  {
    "password": "",
    "ssid": ""
  }
  ```

#### SET
- Request Parameters:  
  ```json
  {
    "password": "",
    "ssid": ""
  }
  ```
- Response Content:  
  ```
  status: 200
  OK
  ```

### `/v1/aio/controller/sensorstate`
- Description: Controller sensor status  
- GET: Retrieve controller sensor status  
- NOTIFY: Controller sensor status change notification  
#### GET
- Request Parameters: None  
- Response Content:  
  ```json
  {
    "motion": false
  }
  ```

#### NOTIFY
- Notification Content:  
  ```json
  {
    "motion": false
  }
  ```
  
### `/v1/aio/controller/byodsupport`
- Description: Controller support status  
- GET: Retrieve controller support status  
#### GET
- Request Parameters: None  
- Response Content:  
  ```json
  {
    "support": true
  }
  ```

#### SET
- Request Parameters:  
  ```json
  {
    "support": true
  }
  ```
- Response Content:  
  ```
  status: 200
  OK
  ```

#### NOTIFY
- Notification Content:  
  ```json
  {
    "support": true
  }
  ```
  
### `/v1/aio/controller/byoddevice`
- Description: Controller status (currently connection only)  
- GET: Retrieve controller status  
- NOTIFY: Controller status change notification  
#### GET
- Request Parameters: None  
- Response Content:  
  ```json
  {
    "connected": false
  }
  ```

#### NOTIFY
- Notification Content:  
  ```json
  {
    "connected": false
  }
  ```
  
### `/v1/aio/controller/screenbrightness`
- Description: Controller screen brightness
- GET: Retrieve controller screen brightness  
- SET: Configure controller screen brightness  
- NOTIFY: Controller screen brightness change notification  
#### GET
- Request Parameters: None  
- Response Content:  
  ```json
  {
    "value" : 0 // 0~100
  }
  ```

#### SET
- Request Parameters:  
  ```json
  {
    "value" : 0 // 0~100
  }
  ```
- Response Content:  
  ```
  status: 200
  OK
  ```

#### NOTIFY
- Notification Content:  
  ```json
  {
    "value" : 0 // 0~100
  }
  ```

## Camera

### `/v1/aio/camera/device`
- Description: Camera device information  
- GET: Retrieve camera device information  
- NOTIFY: Camera device information change notification  
#### GET
- Request Parameters: None
- Response Content:  
  ```json
  {
    "connected": true, // false: The built-in audio device is being updated or the device is abnormal
    "firmware": "",
    "model": "",
    "name": "",
    "serial": ""
  }
  ```

#### NOTIFY
- Notification Content:  
  ```json
  {
    "connected": true,
    "firmware": "",
    "model": "",
    "name": "",
    "serial": ""
  }
  ```

### `/v1/aio/camera/roomstate`
- Description: Room status  
- GET: Retrieve room status  
- NOTIFY: Room status change notification  
#### GET
- Request Parameters: None
- Response Content:  
  ```json
  {
    "peopleNum": 0
  }
  ```

#### NOTIFY
- Notification Content:  
  ```json
  {
    "peopleNum": 0
  }
  ```

### `/v1/aio/camera/intelligentvideo`
- Description: Intelligent video parameters  
- GET: Retrieve intelligent video parameters  
- SET: Configure intelligent video parameters  
- NOTIFY: Intelligent video parameter change notification  
#### GET
- Request Parameters: None
- Response Content: Device intelligent video parameters
  ```json
  {
    "fenceCoordinates": [
        {
          "x": -600,
          "y": 200,
        },
        {
          "x": -500,
          "y": 900,
        },
        {
          "x": 400,
          "y": 1000,
        },
        {
          "x": 500,
          "y": 100,
        }
    ],
    "fenceEnabled": true,
    "mode": 0,
    "privacyShutter": false,
    "autoframe": {
      "framePadding": 0,
      "transitionSpeed": 0
    },
    "talkerswitch": {
      "framePadding": 0,
      "level": 0,
      "time": 0
    },
    "intelligentfocus": {
      "peopleShown": 0,
      "roomViewEnabled": false
    }
  }
  ```

#### SET
- Request Parameters:  
  ```json
  {
    "fenceCoordinates": [
        {
          "x": -600,
          "y": 200,
        },
        {
          "x": -500,
          "y": 900,
        },
        {
          "x": 400,
          "y": 1000,
        },
        {
          "x": 500,
          "y": 100,
        }
    ],
    "fenceEnabled": true,
    "mode": 0,
    "privacyShutter": false,
    "autoframe": {
      "framePadding": 0,
      "transitionSpeed": 0
    },
    "talkerswitch": {
      "framePadding": 0,
      "level": 0,
      "time": 0
    },
    "intelligentfocus": {
      "peopleShown": 0,
      "roomViewEnabled": false
    }
  }
  ```
- Response Content:  
  ```
  status: 200
  OK
  ```

#### NOTIFY
- Notification Content:  
  ```json
  {
    "fenceCoordinates": [
        {
          "x": -600,
          "y": 200,
        },
        {
          "x": -500,
          "y": 900,
        },
        {
          "x": 400,
          "y": 1000,
        },
        {
          "x": 500,
          "y": 100,
        }
    ],
    "fenceEnabled": true,
    "mode": 0,
    "privacyShutter": false,
    "autoframe": {
      "framePadding": 0,
      "transitionSpeed": 0
    },
    "talkerswitch": {
      "framePadding": 0,
      "level": 0,
      "time": 0
    },
    "intelligentfocus": {
      "peopleShown": 0,
      "roomViewEnabled": false
    }
  }
  ```
#### Note:
- mode: 
  ```c++
  enum {
    NONE = 0,
    AUTOFRAME,
    TALKER_SWITCH,
    INTWLLIGENT_FOCUS // MULTICELL
  }
  ```
- The video fence coordinate reference system is a plane horizontal to the camera with the camera as the origin. The positive x direction is to the right of the camera, and the positive y direction is directly in front of the camera. The coordinates <x, y> represent the absolute distance from the coordinate axis, in centimeters. A maximum of 32 coordinates are supported.
- ![Logical view](resource/images/video_fence.jpg)

### `/v1/aio/camera/externalvideo`
- Description: Non-meeting main camera view configuration  
- GET: Retrieve non-meeting main camera view configuration  
- SET: Configure non-meeting main camera view  
- NOTIFY: Non-meeting main camera view configuration change notification  
#### GET
- Request Parameters: None
- Response Content:  
  ```json
  {
    "enable": false,
    "interface": 1,
    "rate": 0,
    "resolution": 0
  }
  ```

#### SET
- Request Parameters:  
  ```json
  {
    "enable": false,
    "interface": 1,
    "rate": 0,
    "resolution": 0
  }
  ```
- Response Content:  
  ```
  status: 200
  OK
  ```

#### NOTIFY
- Notification Content:  
  ```json
  {
    "enable": false,
    "interface": 1,
    "rate": 0,
    "resolution": 0
  }
  ```

## MIC

### `/v1/aio/system/sound/device`
- Description: Build-in sound device information  
- GET: Retrieve build-in sound information  
- NOTIFY: Build-in sound device information change notification  
#### GET
- Request Parameters: None
- Response Content:  fv
  ```json
  {
    "connected": true, // false: The built-in audio device is being updated or the device is abnormal
    "firmware": "",
    "model": "",
    "name": "",
    "serial": ""
  }
  ```

#### NOTIFY
- Notification Content:  
  ```json
  {
    "connected": true,
    "firmware": "",
    "model": "",
    "name": "",
    "serial": ""
  }
  ```

### `/v1/aio/system/sound/parameters`
- Description: Extension microphone parameter configuration  
- GET: Retrieve extension microphone parameters  
- SET: Configure extension microphone parameters  
- NOTIFY: Extension microphone parameter change notification  
#### GET
- Request Parameters: None
- Response Content: Device parameters  
  ```json
  {
    "fenceAngle": {
        "start": 55,
        "end": 120,
    },
    "fenceEnable": true,
    "maxVolume": 0,
    "nsLevel": 0,
  }
  ```

#### SET
- Request Parameters:  
  ```json
  {
    "fenceAngle": {
        "start": 55,
        "end": 120,
    },
    "fenceEnable": true,
    "maxVolume": 0,
    "nsLevel": 0,
  }
  ```
- Response Content:  
  ```
  status: 200
  OK
  ```

#### NOTIFY
- Notification Content: (Delta notifications)  
  ```json
  {
    "fenceAngle": {
        "start": 55,
        "end": 120,
    },
    "fenceEnable": true,
    "maxVolume": 0,
    "nsLevel": 0,
  }
  ```

#### Note:
- The audio fence is an angle. With the microphone as the origin, the angle ranges from 0° to 180° from left to right. The minimum supported angle is 30°, and the maximum supported angle is 90°. If the angle is less than 30°, the microphone algorithm will correct it to 30°. If the angle is greater than 90°, it will correct it to 180°. The end angle must be greater than the start angle. Any angle between 30° and 90° can be set.
- ![Logical view](resource/images/audio_fence.jpg)

### `/v1/aio/system/sound/inputeq`
- Description: Input EQ configuration  
- GET: Retrieve input EQ parameters  
- SET: Configure Input EQ parameters  
- NOTIFY: Input EQ parameter change notification  
#### GET
- Request Parameters: None
- Response Content:  
  ```json
  [
    {
      "bandwidth": 0,
      "frequency": 0,
      "gain": 0,
    },
    {
      "bandwidth": 0,
      "frequency": 0,
      "gain": 0,
    },
    {
      "bandwidth": 0,
      "frequency": 0,
      "gain": 0,
    }
  ] 
  ```

#### SET
- Request Parameters:  
  ```json
  [
    {
      "bandwidth": 0,
      "frequency": 0,
      "gain": 0,
    },
    {
      "bandwidth": 0,
      "frequency": 0,
      "gain": 0,
    },
    {
      "bandwidth": 0,
      "frequency": 0,
      "gain": 0,
    }
  ] 
  ```
- Response Content:  
  ```
  status: 200
  OK
  ```

#### NOTIFY
- Notification Content:  
  ```json
  [
    {
      "bandwidth": 0,
      "frequency": 0,
      "gain": 0,
    },
    {
      "bandwidth": 0,
      "frequency": 0,
      "gain": 0,
    },
    {
      "bandwidth": 0,
      "frequency": 0,
      "gain": 0,
    }
  ] 
  ```

### `/v1/aio/system/sound/extension`
- Description: Expected extension MIC count  
- GET: Retrieve extension MIC count  
- SET: Configure extension MIC count  
#### GET
- Request Parameters: None  
- Response Content:  
  ```json
  {
    "num": 0
  }
  ```

#### SET
- Request Parameters:  
  ```json
  {
    "num": 0
  }
  ```
- Response Content:  
  ```
  status: 200
  OK
  ```

### `/v1/aio/system/sound/extension/device`
- Description: Detected extension MIC  
- GET: Retrieve extension MIC device information  
- NOTIFY: Extension microphone connection status change notification (delta notifications)  
#### GET
- Request Parameters: None
- Response Content: Device list information  
  ```json
  [
    {
      "connected": true,
      "firmware": "",
      "id": "aaaaaaaa",
      "model": "",
      "name": "",
      "power": 2,
      "serial": ""
    },
    {
      "connected": true,
      "firmware": "",
      "id": "bbbbbbbb",
      "model": "",
      "name": "",
      "power": 2,
      "serial": ""
    }
  ]
  ```
- Note:  
  - Returns information for all connected devices when no device ID is specified  
  - Returns information for specified device when device ID is specified  

#### NOTIFY
- Notification Content:  
  ```json
  {
    "connected": true,
    "firmware": "",
    "id": "bbbbbb",
    "model": "",
    "name": "",
    "power": 2,
    "serial": ""
  }
  ```

## System

### `/v1/aio/system/info`
- Description: System information  
- GET: Retrieve system information  
#### GET
- Request Parameters: None  
- Response Content:  
  ```json
  {
    "application" : "5.3.111.0",
    "firmware" : "10.0.22631",
    "lastUpdate" : "20250910T080000Z",
    "model" : "XBar W70",
    "name" : "DESKTOP-CHDVMK7",
    "serial" : "TO be filled by O.E.M."
  }
  ```

### `/v1/aio/system/monitor/extension`
- Description: Expected extension monitor count  
- GET: Retrieve extension monitor count  
- SET: Configure extension monitor count  
#### GET
- Request Parameters: None  
- Response Content:  
  ```json
  {
    "num": 0
  }
  ```

#### SET
- Request Parameters:  
  ```json
  {
    "num": 0
  }
  ```
- Response Content:  
  ```
  status: 200
  OK
  ```

### `/v1/aio/system/monitors`
- Description: Monitor information  
- GET: Retrieve all monitor information  
- NOTIFY: Monitor information change notification (includes connection count, resolution, refresh rate, etc.)  
#### GET
- Request Parameters: None  
- Response Content: Monitor list (with ID, resolution, refresh rate, etc.)  
  ```json
  [
    {
      "connected": true,
      "frequency": 60,
      "id": "\\\\?\\DISPLAY#HKC2717#4&16aad721&1&UID4152#{e6f07b5f-ee97-4a90-b076-33f57bf4eaa7}",
      "logical": {
        "height": 1440,
        "width": 2560
      },
      "master": false,
      "model": "HKC2717",
      "physical": {
        "height": 1440,
        "width": 2560
      },
      "size": {
        "height": 336,
        "width": 597
      }
    },
    {
      "connected": true,
      "frequency": 60,
      "id": "\\\\?\\DISPLAY#HKC2717#4&16aad721&1&UID8262#{e6f07b5f-ee97-4a90-b076-33f57bf4eaa7}",
      "logical": {
        "height": 1440,
        "width": 2560
      },
      "master": false,
      "model": "HKC2717",
      "physical": {
        "height": 1440,
        "width": 2560
      },
      "size": {
        "height": 336,
        "width": 597
      }
    }
  ]
  ```

#### NOTIFY
- Notification Content: Monitor list (full notifications)  
  ```json
  [
    {
      "connected": true,
      "frequency": 60,
      "id": "\\\\?\\DISPLAY#HKC2717#4&16aad721&1&UID4152#{e6f07b5f-ee97-4a90-b076-33f57bf4eaa7}",
      "logical": {
        "height": 1440,
        "width": 2560
      },
      "master": false,
      "model": "HKC2717",
      "physical": {
        "height": 1440,
        "width": 2560
      },
      "size": {
        "height": 336,
        "width": 597
      }
    },
    {
      "connected": true,
      "frequency": 60,
      "id": "\\\\?\\DISPLAY#HKC2717#4&16aad721&1&UID8262#{e6f07b5f-ee97-4a90-b076-33f57bf4eaa7}",
      "logical": {
        "height": 1440,
        "width": 2560
      },
      "master": false,
      "model": "HKC2717",
      "physical": {
        "height": 1440,
        "width": 2560
      },
      "size": {
        "height": 336,
        "width": 597
      }
    },
    {
      "connected": true,
      "frequency": 60,
      "id": "\\\\?\\DISPLAY#LEN41C0#4&16aad721&1&UID8388688#{e6f07b5f-ee97-4a90-b076-33f57bf4eaa7}",
      "logical": {
        "height": 933,
        "width": 1493
      },
      "master": true,
      "model": "LEN41C0",
      "physical": {
        "height": 1400,
        "width": 2240
      },
      "size": {
        "height": 188,
        "width": 302
      }
    }
  ]
  ```

### `/v1/aio/system/sound/cards`
- Description: Sound card information  
- GET: Retrieve all available sound card information  
- NOTIFY: Sound card connection/disconnection notification (full notifications)  
#### GET
- Request Parameters: None  
- Response Content: Sound card list (with ID, description, volume, mute status, etc.)  
  ```json
  [
    {
      "active" : true,
      "description" : "Speaker (Senary Audio)",
      "id" : "{0.0.0.00000000}.{2bf59cab-dcd4-4796-8784-6fd02b17df20}",
      "mute" : true,
      "volume" : 50
    },
    {
      "active" : false,
      "description" : "T2752Q (5- HD Audio Driver for Display Audio)",
      "id" : "{0.0.0.00000000}.{6b12e1c6-32a1-43aa-8614-b08ed18c5d26}",
      "mute" : true,
      "volume" : 100
    }
  ]
  ```

#### NOTIFY
- Notification Content:  
  ```json
  [
    {
      "active" : true,
      "description" : "Speaker (Senary Audio)",
      "id" : "{0.0.0.00000000}.{2bf59cab-dcd4-4796-8784-6fd02b17df20}",
      "mute" : true,
      "volume" : 50
    },
    {
      "active" : false,
      "description" : "T2752Q (5- HD Audio Driver for Display Audio)",
      "id" : "{0.0.0.00000000}.{6b12e1c6-32a1-43aa-8614-b08ed18c5d26}",
      "mute" : true,
      "volume" : 100
    },
    {
      "active" : false,
      "description" : "T2752Q (4- HD Audio Driver for Display Audio)",
      "id" : "{0.0.0.00000000}.{a4a0f1fc-65ee-4d48-883f-1816c190b27c}",
      "mute" : false,
      "volume" : 67
    }
  ]
  ```

### `/v1/aio/system/sound/active`
- Description: Active sound card information  
- GET: Retrieve active sound card information  
- SET: Activate sound card and configure volume/mute status (currently unsupported)  
- NOTIFY: Active sound card change notification (includes sound card switch, volume change, mute status change)  
#### GET
- Request Parameters: None  
- Response Content: Currently active sound card information  
  ```json
  {
    "active" : true,
    "description" : "Speaker (Senary Audio)",
    "id" : "{0.0.0.00000000}.{2bf59cab-dcd4-4796-8784-6fd02b17df20}",
    "mute" : true,
    "volume" : 50
  }
  ```

#### SET
- Request Parameters:  
  ```json
  {
    "id": "{0.0.0.00000000}.{2bf59cab-dcd4-4796-8784-6fd02b17df20}",
    "mute": true,
    "volume": 50
  }
  ```
- Response Content:  
  ```
  status: 200
  OK
  ```

#### NOTIFY
- Notification Content:  
  ```json
  {
    "active" : true,
    "description" : "Speaker (Senary Audio)",
    "id" : "{0.0.0.00000000}.{2bf59cab-dcd4-4796-8784-6fd02b17df20}",
    "mute" : true,
    "volume" : 50
  }
  ```

### `/v1/aio/system/sound/mute`
- Description: Active sound card mute status (mute status changes notified via [/v1/aio/system/sound/active])  
- GET: Retrieve sound card mute status  
- SET: Set sound card mute status  
#### GET
- Request Parameters: None  
- Response Content:  
  ```json
  {
    "mute": true
  }
  ```
- Note: Retrieves active sound card mute status  

#### SET
- Request Parameters:  
  ```json
  {
    "mute": true
  }
  ```
- Response Content:  
  ```
  status: 200
  OK
  ```
- Note: Sets active sound card mute status  

### `/v1/aio/system/sound/volume`
- Description: Active sound card volume (volume changes notified via [/v1/aio/system/sound/active])  
- GET: Retrieve active sound card volume  
- SET: Set active sound card volume  
#### GET
- Request Parameters: None  
- Response Content:  
  ```json
  {
    "volume": 50
  }
  ```
- Note: Retrieves active sound card volume  

#### SET
- Request Parameters:  
  ```json
  {
    "volume": 50
  }
  ```
- Response Content:  
  ```
  status: 200
  OK
  ```
- Note: Sets active sound card volume  

### `/v1/aio/system/ethnet/interface`
- Description: Ethnet interfaces  
- GET: Retrieve ethnet interface list  
#### GET
- Request Parameters: None  
- Response Content: Ethnet interface list  
  ```json
  [
    {
      "addrs" :
      [
        "172.25.130.33/24"
      ],
      "addrs6" :
      [
        "fe80::3e7:de5c:5166:779f%10"
      ],
      "connected" : true,
      "description" : "ASIX USB to Gigabit Ethernet Family Adapter #2",
      "dnsServers" :
      [
        "10.254.254.254"
      ],
      "gateways" :
      [
        "172.25.130.1"
      ],
      "id" : "{6220B844-6898-401E-999C-1EABF0FA85CC}",
      "linkSpeed" : 1000,
      "mac" : "F8:E4:3B:90:1E:68",
      "name" : "Ethnet",
      "network" : "gz.cvte.cn"
    },
    {
      "addrs" :
      [
        "192.168.20.10/24",
        "192.168.153.111/24"
      ],
      "addrs6" :
      [
        "fe80::222:b069:ec3e:431%17"
      ],
      "connected" : true,
      "description" : "ASIX USB to Gigabit Ethernet Family Adapter",
      "dnsServers6" :
      [
        "fec0:0:0:ffff::1",
        "fec0:0:0:ffff::2",
        "fec0:0:0:ffff::3"
      ],
      "id" : "{8B597366-D819-437D-B003-B2377E494766}",
      "linkSpeed" : 1000,
      "mac" : "00:0E:C6:3B:9E:07",
      "name" : "Ethnet 3",
      "network" : ""
    }
  ]
  ```

### `/v1/aio/system/wlan/interface`
- Description: WLAN interfaces  
- GET: Retrieve WLAN interface list  
#### GET
- Request Parameters: None  
- Response Content: WLAN interface list  
  ```json
  [
    {
      "addrs" :
      [
        "10.42.0.251/24"
      ],
      "addrs6" :
      [
        "fe80::4024:9eb8:4078:7fd1%12"
      ],
      "connected" : true,
      "description" : "Intel(R) Wi-Fi 6E AX211 160MHz",
      "dnsServers" :
      [
        "10.42.0.1"
      ],
      "gateways" :
      [
        "10.42.0.1"
      ],
      "id" : "{67A63136-798D-4C7B-8D81-572E13EB6595}",
      "linkSpeed" : 144,
      "mac" : "A0:59:50:74:51:CB",
      "name" : "WLAN",
      "network" : "",
      "phyType" : 7,      // https://learn.microsoft.com/en-us/windows/win32/nativewifi/dot11-phy-type
      "quality" : 96,     // 0~100, A percentage value that represents the signal quality of the network
      "securityType" : 9, // https://learn.microsoft.com/en-us/windows/win32/nativewifi/dot11-auth-algorithm
      "ssid" : "HOTSPOT-10F60AB37031"
    }
  ]
  ```

### `/v1/aio/system/wlan/scan`
- Description: Wireless network scan  
- SET: Initiate wireless network scan (async request, scan results notified via this interface)  
#### SET
- Request Parameters: `NULL` or  
  ```json
  {
    "id": "67A63136-798D-4C7B-8D81-572E13EB6595"
  }
  ```
- Response Content:  
  ```
  status: 200
  OK
  ```
- Note: If a wireless network card ID is specified, only the wireless networks found by the specified wireless network card will be scanned, and the scan results will be responded to through the API [/v1/aio/system/wlan/interface] 

#### NOTIFY
- Notification Content: List of scanned wireless networks  
  ```json
  {
    "{67A63136-798D-4C7B-8D81-572E13EB6595}" :
    [
      {
        "phyType" : 7,      // https://learn.microsoft.com/en-us/windows/win32/nativewifi/dot11-phy-type
        "quality" : 96,     // 0~100, A percentage value that represents the signal quality of the network
        "securityType" : 9, // https://learn.microsoft.com/en-us/windows/win32/nativewifi/dot11-auth-algorithm
        "ssid" : "HOTSPOT-10F60AB37031"
      },
      {
        "phyType" : 10,     // https://learn.microsoft.com/en-us/windows/win32/nativewifi/dot11-phy-type
        "quality" : 88,     // 0~100, A percentage value that represents the signal quality of the network
        "securityType" : 1, // https://learn.microsoft.com/en-us/windows/win32/nativewifi/dot11-auth-algorithm
        "ssid" : "CVTE"
      },
      ...
    ]
  }
  ```

### `/v1/aio/system/wlan/connect`
- Description: Connect to wireless network  
- SET: Connect to wireless network (async request, connection result notified via this interface)  
- NOTIFY: Connection result notification  
#### SET
- Request Parameters:  
  ```json
  {
    "id": "67A63136-798D-4C7B-8D81-572E13EB6595",
    "ssid": "CVTE",
    "password": "xxxxxxxx"
  }
  ```
- Note: ID can be omitted when only one interface exists; ID must be specified when multiple interfaces exist  

#### NOTIFY
- Notification Content:  
  ```json
  {
    "connected": true
  }
  ```

### `/v1/aio/system/wlan/disconnect`
#### SET
- Request Parameters:  
  ```json
  {
    "id": "67A63136-798D-4C7B-8D81-572E13EB6595"
  }
  ```
- Note: ID can be omitted when only one interface exists; ID must be specified when multiple interfaces exist  

### `/v1/aio/system/cec`
- Description: HDMI CEC switch status  
- GET: Retrieve HDMI CEC switch status  
- SET: Configure HDMI CEC switch status  
- NOTIFY: HDMI CEC switch status change notification  
#### GET
- Request Parameters: None  
- Response Content:  
  ```json
  {
    "state": false
  }
  ```

#### SET
- Request Parameters:  
  ```json
  {
    "state": 0
  }
  ```
- Response Content:  
  ```
  status: 200
  OK
  ```

#### NOTIFY
- Notification Content:  
  ```json
  {
    "state": 0
  }
  ```

#### Note
- state:  
  ```
  enum { OFF, ON }
  ```

### `/v1/aio/system/datetime`
- Description: System date/time  
- GET: Retrieve system date/time  
- SET: Set system date/time  
#### GET
- Request Parameters: None  
- Response Content:  
  ```json
  {
    "datetime": "2025-07-16 15:39:05"
  }
  ```

#### SET
- Request Parameters:  
  ```json
  {
    "datetime": "2025-07-16 15:39:05"
  }
  ```
- Response Content:  
  ```
  status: 200
  OK
  ```

### `/v1/aio/system/timezones`
- Description: Timezone list  
- GET: Retrieve timezone list  
#### GET
- Request Parameters: None  
- Response Content:  
  ```json
  [
    ...
    "China Standard Time",
    "Cuba Standard Time",
    "Dateline Standard Time",
    ...
  ]
  ```

### `/v1/aio/system/timezone`
- Description: Timezone  
- GET: Retrieve timezone  
- SET: Set timezone ("timezone" value must be selected from list returned by [/v1/aio/system/timezones])  
- NOTIFY: Timezone change notification  
#### GET
- Request Parameters: None  
- Response Content:  
  ```json
  {
    "timezone": "China Standard Time"
  }
  ```

#### SET
- Request Parameters:  
  ```json
  {
    "timezone": "China Standard Time"
  }
  ```
- Response Content:  
  ```
  status: 200
  OK
  ```

#### NOTIFY
- Notification Content:  
  ```json
  {
    "timezone": "China Standard Time"
  }
  ```

### `/v1/aio/system/ntpserver`
- Description: NTP server  
- GET: Retrieve NTP server  
- SET: Configure NTP server  
- NOTIFY: NTP server change notification  
#### GET
- Request Parameters: None  
- Response Content:  
  ```json
  {
    "ntpserver": "time.windows.com,0x8"
  }
  ```

#### SET
- Request Parameters:  
  ```json
  {
    "ntpserver": "time.windows.com,0x8"
  }
  ```
- Response Content:  
  ```
  status: 200
  OK
  ```

#### NOTIFY
- Notification Content:  
  ```json
  {
    "ntpserver": "time.windows.com,0x8"
  }
  ```

### `/v1/aio/system/ntpenable`
- Description: Automatic time synchronization  
- SET: Enable/disable automatic time synchronization  
- GET: Check if automatic time synchronization is enabled  
- NOTIFY: Automatic time synchronization status change notification  
#### GET
- Request Parameters: None  
- Response Content:  
  ```json
  {
    "enabled": true
  }
  ```

#### SET
- Request Parameters:  
  ```json
  {
    "enable": true
  }
  ```
- Response Content:  
  ```
  status: 200
  OK
  ```

#### NOTIFY
- Notification Content:  
  ```json
  {
    "enabled": true
  }
  ```

### `/v1/aio/system/update`
- Description: System update (requires administrator privileges)  
- GET: Retrieve system update status  
- SET: Start/stop system update  
- NOTIFY: System update status change notification  
#### GET
- Request Parameters: None  
- Response Content:  
  ```json
  {
    "state": 7,
    "progress": 0,
    "rebootRequired": true
  }
  ```

#### SET
- Request Parameters:  
  ```json
  {
    "enable": true
  }
  ```
- Response Content:  
  ```
  status: 200
  OK
  ```

#### NOTIFY
- Notification Content:  
  ```json
  {
    "state": 3,
    "progress": 40,
    "rebootRequired": false
  }
  ```
#### Note
- state values:  
  ```cpp
  enum State { 
    IDLE,
    INITIALIZING,
    SEARCHING,
    DOWNLOADING,
    INSTALLING,
    FAILED,
    ABORTED,
    COMPLETED 
  }
  ```

### `/v1/aio/system/power/lock`
- Description: Lock system  
#### SET
- Request Parameters: None  
- Response Content:  
  ```
  status: 200
  OK
  ```

### `/v1/aio/system/power/logoff`
- Description: Log out of system  
#### SET
- Request Parameters: None  
- Response Content:  
  ```
  status: 200
  OK
  ```

### `/v1/aio/system/power/reboot`
- Description: Reboot system  
#### SET
- Request Parameters: None  
- Response Content:  
  ```
  status: 200
  OK
  ```

### `/v1/aio/system/power/shutdown`
- Description: Shut down system  
#### SET
- Request Parameters: None  
- Response Content:  
  ```
  status: 200
  OK
  ```

### `/v1/aio/system/power/scheme`
- Description: Power scheme  
- GET: Retrieve current power scheme  
- SET: Configure power scheme  
- NOTIFY: Power scheme change notification  
#### GET
- Request Parameters: None  
- Response Content:  
  ```json
  {
    "acDisplayTimeout": 0,
    "acStandbyTimeout": 0,
    "dcDisplayTimeout": 0,
    "dcStandbyTimeout": 0
  }
  ```

#### SET
- Request Parameters:  
  ```json
  {
    "acDisplayTimeout": 0,
    "acStandbyTimeout": 0,
    "dcDisplayTimeout": 0,
    "dcStandbyTimeout": 0
  }
  ```
- Response Content:  
  ```
  status: 200
  OK
  ```

#### NOTIFY
- Notification Content:  
  ```json
  {
    "acDisplayTimeout": 0,
    "acStandbyTimeout": 0,
    "dcDisplayTimeout": 0,
    "dcStandbyTimeout": 0
  }
  ```

### `/v1/aio/system/languages`
- Description: System language list  
#### GET
- Request Parameters: None  
- Response Content: Language list  
  ```json
  [
    {
      "display" : "Chinese (Simplified, China)",
      "name" : "zh-CN"
    },
    {
      "display" : "English (United States)",
      "name" : "en-US"
    }
  ]
  ```

### `/v1/aio/system/language`
- Description: System language  
- GET: Retrieve system language  
- SET: Configure system language  
- NOTIFY: System language change notification  
#### GET
- Request Parameters: None  
- Response Content:  
  ```json
  {
    "display": "Chinese (Simplified, China)",
    "name": "zh-CN"
  }
  ```

#### SET
- Request Parameters: "name" value must be selected from list returned by [/v1/aio/system/languages]  
  ```json
  {
    "name": "zh-CN"
  }
  ```
- Response Content:  
  ```
  status: 200
  OK
  ```

#### NOTIFY
- Notification Content:  
  ```json
  {
    "display": "Chinese (Simplified, China)",
    "name": "zh-CN"
  }
  ```

### `/v1/aio/system/locales`
#### GET
- Request Parameters: None  
- Response Content: Region list  
  ```json
  [
    {
      "display": "Andorra",
      "name": "AD"
    },
    ...
    {
      "display": "China",
      "name": "CN"
    }
  ]
  ```

### `/v1/aio/system/locale`
- Description: Country/Region  
- GET: Retrieve current country/region  
- SET: Configure current country/region  
- NOTIFY: Current country/region change notification  
#### GET
- Request Parameters: None  
- Response Content:  
  ```json
  {
    "display": "China",
    "name": "CN"
  }
  ```

#### SET
- Request Parameters: "name" value must be selected from list returned by [/v1/aio/system/locales]  
  ```json
  {
    "name": "CN"
  }
  ```
- Response Content:  
  ```
  status: 200
  OK
  ```

#### NOTIFY
- Notification Content:  
  ```json
  {
    "display": "China",
    "name": "CN"
  }
  ```

## UC

### `/v1/aio/uc/state`
- Description: UC status  
- GET: Retrieve UC status  
- NOTIFY: UC status change notification  
#### GET
- Request Parameters: None  
- Response Content:  
  ```json
  {
    "meeting": false,
    "sharing": false
  }
  ```

#### NOTIFY
- Notification Content:  
  ```json
  {
    "meeting": false,
    "sharing": false
  }
  ```

### `/v1/aio/uc/meetingmode`
- Description: Meeting mode  
- GET: Retrieve meeting mode  
- NOTIFY: Meeting mode change notification  
#### GET
- Request Parameters: None  
- Response Content:  
  ```json
  {
    "mode": 0
  }
  ```

#### NOTIFY
- Notification Content:  
  ```json
  {
    "mode": 0
  }
  ```
#### Note
- mode:  
  ```
  enum { IDLE, MTR, ZR, BYOD }
  ```

## Version
### `/v1/aio/version`
- Description: Retrieve version information  
#### GET
- Request Parameters: None  
- Response Content:  
  ```json
  {
    "major": 0,
    "minor": 0,
    "patch": 1
  }
  ```

### `/v1/aio/revision`
- Description: Retrieve revision information  
#### GET
- Request Parameters: None  
- Response Content:  
  ```json
  {
    "build": 12,
    "major": 0,
    "minor": 0,
    "patch": 1
  }
  ```

## Scheduling Panel

### `/v1/aio/schedulingpanel/device`
- Description: Doorplate device information  
#### GET
- Request Parameters: `None` or  
  ```json
  {
    "id": "aaaaaaaa"
  }
  ```
- Response Content: Device list or single device information  
  ```json
  [
    {
      "id": "aaaaaaaa",
      "connected": true,
      "name": "",
      "model": "",
      "serial": "",
      "firmware": ""
    },
    {
      "id": "bbbbbbbb",
      "connected": true,
      "name": "",
      "model": "",
      "serial": "",
      "firmware": ""
    }
  ]
  or
  {
      "id": "aaaaaaaa",
      "connected": true,
      "name": "",
      "model": "",
      "serial": "",
      "firmware": ""
  }
  ```
- Note:  
  - Returns information for all connected devices when no device ID is specified  
  - Returns information for specified device when device ID is specified  

#### NOTIFY
- Notification Content:  
  ```json
    {
        "id": "aaaaaaaa",
        "connected": true,
        "name": "",
        "model": "",
        "serial": "",
        "firmware": ""
    }
  ```

### `/v1/aio/schedulingpanel/environment`
- Description: Environment information (lightLevel only)  
#### GET
- Request Parameters: `None` or  
  ```json
  {
    "id": "aaaaaaaa"
  }
  ```
- Response Content: Device list or single device information  
  ```json
  [
    {
      "id": "aaaaaaaa",
      "lightLevel": 0
    },
    {
      "id": "bbbbbbbb",
      "lightLevel": 0
    }
  ]
  or
  {
      "id": "bbbbbbbb",
      "lightLevel": 0
  }
  ```
- Note:  
  - Returns environment information for all connected devices when no device ID is specified  
  - Returns environment information for specified device when device ID is specified  

#### NOTIFY
- Notification Content:  
  ```json
    {
      "id": "bbbbbbbb",
      "lightLevel": 0
    }
  ```

### `/v1/aio/schedulingpanel/powermode`
- Description: Power mode  
#### GET
- Request Parameters: `None` or  
  ```json
  {
    "id": "aaaaaaaa"
  }
  ```
- Response Content: Power mode list or single device power mode  
  ```json
  [
    {
      "id": "aaaaaaaa",
      "powerMode": 0
    },
    {
      "id": "bbbbbbbb",
      "powerMode": 0
    }
  ]
  or
  {
      "id": "bbbbbbbb",
      "powerMode": 0
  }
  ```
- Note:  
  - Returns power mode for all connected devices when no device ID is specified  
  - Returns power mode for specified device when device ID is specified  

#### NOTIFY
- Notification Content:  
  ```json
    {
      "id": "bbbbbbbb",
      "powerMode": 0
    }
  ```
#### Note
- powerMode:  
  ```cpp
  enum { SAVING, BALANCE, PERFORMANCE }
  ```

### `/v1/aio/schedulingpanel/Screenrotation`
- Description: Screen orientation  
#### GET
- Request Parameters: `None` or  
  ```json
  {
    "id": "aaaaaaaa"
  }
  ```
- Response Content: Screen orientation list or single device orientation  
  ```json
  [
    {
      "id": "aaaaaaaa",
      "rotation": 0
    },
    {
      "id": "bbbbbbbb",
      "rotation": 0
    }
  ]
  or
  {
      "id": "bbbbbbbb",
      "rotation": 0
  }
  ```
- Note:  
  - Returns screen orientation for all connected devices when no device ID is specified  
  - Returns screen orientation for specified device when device ID is specified  

#### NOTIFY
- Notification Content:  
  ```json
    {
      "id": "bbbbbbbb",
      "rotation": 0
    }
  ```
#### Note
- rotation:  
  ```cpp
  enum { PORTRAIT, LANDSCAPE }
  ```
