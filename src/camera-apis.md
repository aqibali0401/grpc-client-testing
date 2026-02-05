Complete list of ALL camera-related UDI APIs

1. manual page

📷 Camera Core
GET /v1/aio/camera/device

GET /v1/aio/camera/roomstate

GET /v1/aio/camera/intelligentvideo
SET /v1/aio/camera/intelligentvideo

GET /v1/aio/camera/externalvideo
SET /v1/aio/camera/externalvideo

these are the 4 main apis for camera 


🧩 Camera Modes section

GET /v1/aio/camera/intelligentvideo
SET /v1/aio/camera/intelligentvideo


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

  for mode

  mode:
0 → Manual
1 → Auto Framing
2 → Active Speaker (Talker Switch)
3 → Intelligent Focus (Multi-Cell)



2nd page 
📄 Auto Framing – Camera Page


1️⃣ Camera Mode (Manual / Auto Framing / Intelligent Focus / Active Speaker)
🔹 What UI shows

Selected mode = Auto Framing

Other modes selectable

🔹 API
GET  /v1/aio/camera/intelligentvideo
SET  /v1/aio/camera/intelligentvideo
NOTIFY /v1/aio/camera/intelligentvideo

🔹 Fields used
{
  "mode": 1
}


Mode mapping:

0 → Manual
1 → Auto Framing
2 → Active Speaker (Talker Switch)
3 → Intelligent Focus (Multi-Cell)


✅ You already confirmed this works.


2️⃣ Auto Framing Controls (Transition Speed + Frame Padding)
🔹 What UI shows

Transition Speed slider (ms)

Frame Padding: Tight / Normal / Wide

🔹 API (same one)
/v1/aio/camera/intelligentvideo

🔹 Fields
"autoFrame": {
  "framePadding": 0,
  "transitionSpeed": 1500
}


✔️ These values come only from intelligentvideo

3️⃣ Video Fence – ON / OFF
🔹 What UI shows

Toggle: Video Fence ON/OFF

🔹 API
/v1/aio/camera/intelligentvideo

🔹 Field
{
  "fenceEnabled": true
}


✔️ You already get this field.


4️⃣ Video Fence – Top View (Editable Polygon)
🔹 What UI shows

Top view diagram

Blue polygon

Width / Length

Reset button

🔹 API (THIS IS THE KEY ONE 👇)
GET /v1/aio/camera/intelligentvideo
SET /v1/aio/camera/intelligentvideo

🔹 Field used
"fenceCoordinates": [
  { "x": -600, "y": 200 },
  { "x": -500, "y": 900 },
  { "x": 400,  "y": 1000 },
  { "x": 500,  "y": 100 }
]


📌 Important truths:

There is NO separate “top view” API

Top view is 100% derived from fenceCoordinates

Units:

API → centimeters

UI → feet/meters (UI converts)

👉 Width / Length inputs are UI helpers, not backend fields.

5️⃣ Video Fence – Live Preview (3D room image)
🔹 What UI shows

Room image

Blue fence overlay

Updates in real time

🔹 APIs involved
A) Fence geometry
/v1/aio/camera/intelligentvideo


Uses:

fenceEnabled
fenceCoordinates

B) Camera preview stream toggle
GET /v1/aio/camera/externalvideo
SET /v1/aio/camera/externalvideo

{
  "enable": true
}


📌 The preview image itself is NOT an API

It’s a rendered camera stream

Fence overlay is drawn by UI using coordinates

6️⃣ Camera Preview (ON / OFF toggle)
🔹 What UI shows

“Camera Preview” toggle

🔹 API
/v1/aio/camera/externalvideo

🔹 Field
{
  "enable": true
}


✔️ This enables/disables live camera rendering

7️⃣ Occupants Detected (People Count)
🔹 What UI shows
Occupants Detected: 3

🔹 API
GET /v1/aio/camera/roomstate
NOTIFY /v1/aio/camera/roomstate

🔹 Response
{
  "peopleNum": 3
}


📌 This is the ONLY source for occupant count.


8️⃣ Camera Health / Availability (implicit)

(Not always visible but required)

🔹 API
GET /v1/aio/camera/device
NOTIFY /v1/aio/camera/device


Used for:

Camera connected

Firmware / model

Disable UI if camera not ready

✅ FINAL – ALL APIs USED ON AUTO FRAMING PAGE
🔥 Mandatory APIs
/v1/aio/camera/intelligentvideo   ← modes, auto frame, fence
/v1/aio/camera/roomstate          ← occupants detected
/v1/aio/camera/externalvideo      ← camera preview
/v1/aio/camera/device             ← camera health


page 3rd intellegent focus --------

2️⃣ Intelligent Focus Controls (Core of this page)
🔹 UI Controls

Room View Enabled (toggle)

Smart Switching Mode (toggle)

Number of People Shown (input)

🔹 API (same one)
/v1/aio/camera/intelligentvideo

🔹 Fields used
"intelligentFocus": {
  "roomViewEnabled": true,
  "peopleShown": 4
}


📌 Notes:

Smart Switching Mode is an internal algorithm flag
(currently exposed via Intelligent Focus behavior, not a separate field)

There is NO separate API for Smart Switching

video fence is same like we implemented above for autoframing page
/v1/aio/camera/intelligentvideo   ← fence shape
/v1/aio/camera/externalvideo     ← camera preview stream


7️⃣ Occupants Detected (People Count)
🔹 UI
Occupants Detected: 3

🔹 API
GET    /v1/aio/camera/roomstate
NOTIFY /v1/aio/camera/roomstate   (optional)

🔹 Response
{
  "peopleNum": 3
}


✅ FINAL – Complete API List for Intelligent Focus Page
🔥 Mandatory (GET / SET)
/v1/aio/camera/intelligentvideo
/v1/aio/camera/roomstate
/v1/aio/camera/externalvideo
/v1/aio/camera/device


Only one API controls Intelligent Focus

/v1/aio/camera/intelligentvideo


From this API, you get only these Intelligent Focus fields:

"intelligentFocus": {
  "peopleShown": 0,
  "roomViewEnabled": false
}


“Smart Gathering Mode” is NOT exposed

It’s an internal camera algorithm

No GET / SET field exists in the UDI API

UI toggle = logical / cosmetic, not device state

Mapping clearly
UI Control	API Support
Room View Enabled	✅ intelligentFocus.roomViewEnabled
Number of People Shown	✅ intelligentFocus.peopleShown
Smart Gathering Mode	❌ No API field



page 4th active speaker framing --------------

2️⃣ Active Speaker Controls (Core of this page)
🔹 UI controls

Audio Switching Activation Level (dB)

Cross-talk Switching Time (ms)

Frame Padding (Tight / Normal / Wide)

🔹 API
/v1/aio/camera/intelligentvideo

🔹 Fields used
"talkerSwitch": {
  "level": -30,
  "time": 1500,
  "framePadding": 1
}


📌 Notes:

level → Audio activation threshold

time → Switching delay

framePadding → framing tightness

mode and video fence is same

FINAL – Complete API List for Active Speaker Framing Page
🔥 Mandatory APIs (GET / SET)
/v1/aio/camera/intelligentvideo
/v1/aio/camera/roomstate
/v1/aio/camera/externalvideo
/v1/aio/camera/device
