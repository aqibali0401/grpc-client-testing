/**
 * Swagger/OpenAPI Configuration
 * All API documentation definitions are centralized here
 */

const PORT = 3001;

// Common response schemas
const errorResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    error: {
      type: 'object',
      properties: {
        code: { type: 'string' },
        message: { type: 'string' },
      },
    },
  },
};

const successResponse = (description: string, schema?: object) => ({
  description,
  content: { 'application/json': { schema: schema || { type: 'object' } } },
});

const errorResponse = (description: string) => ({
  description,
  content: { 'application/json': { schema: errorResponseSchema } },
});

// Health APIs
const healthPaths = {
  '/health': {
    get: {
      tags: ['Health'],
      summary: 'Health check endpoint',
      description: 'Returns server health status',
      responses: {
        '200': {
          description: 'Server is healthy',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', example: 'ok' },
                  timestamp: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
      },
    },
  },
};

// Device Control APIs
const devicePaths = {
  '/api/device/get-device-info': {
    get: {
      tags: ['Device Control'],
      summary: 'Get device information',
      description: 'Retrieve detailed device information',
      responses: {
        '200': successResponse('Device information retrieved successfully'),
        '500': errorResponse('Server error'),
      },
    },
  },
  '/api/device/get-aio-bar-id': {
    get: {
      tags: ['Device Control'],
      summary: 'Get AIO Bar ID',
      description: 'Retrieve AIO Bar ID',
      responses: {
        '200': successResponse('AIO Bar ID retrieved successfully'),
        '500': errorResponse('Server error'),
      },
    },
  },
};

// System APIs
const systemPaths = {
  '/api/system/reboot': {
    post: {
      tags: ['System'],
      summary: 'Reboot the system',
      description: 'Reboots the device',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['reason'],
              properties: {
                reason: { type: 'string', description: 'Reason for reboot' },
              },
            },
          },
        },
      },
      responses: {
        '200': successResponse('Reboot initiated successfully'),
        '400': errorResponse('Invalid request'),
        '500': errorResponse('Server error'),
      },
    },
  },
};

// WiFi APIs
const wifiPaths = {
  '/api/wifi/get-wifi-details': {
    get: {
      tags: ['Network - WiFi'],
      summary: 'Get WiFi details',
      description: 'Retrieve current WiFi connection details',
      responses: {
        '200': successResponse('WiFi details retrieved successfully'),
        '500': errorResponse('Server error'),
      },
    },
  },
  '/api/wifi/scan-wifi': {
    get: {
      tags: ['Network - WiFi'],
      summary: 'Scan WiFi networks',
      description: 'Scan for available WiFi networks',
      responses: {
        '200': successResponse('WiFi networks scanned successfully'),
        '500': errorResponse('Server error'),
      },
    },
  },
  '/api/wifi/disconnect-wifi': {
    post: {
      tags: ['Network - WiFi'],
      summary: 'Disconnect WiFi network',
      description: 'Disconnect from a WiFi network',
      requestBody: {
        required: false,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'WiFi network ID (optional)' },
              },
            },
          },
        },
      },
      responses: {
        '200': successResponse('Disconnected successfully'),
        '400': errorResponse('Invalid request'),
        '500': errorResponse('Server error'),
      },
    },
  },
  '/api/wifi/connect-wifi': {
    post: {
      tags: ['Network - WiFi'],
      summary: 'Connect to WiFi network',
      description: 'Connect to a WiFi network with SSID and password',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['ssid', 'password'],
              properties: {
                ssid: { type: 'string', description: 'WiFi SSID' },
                password: { type: 'string', description: 'WiFi password' },
              },
            },
          },
        },
      },
      responses: {
        '200': successResponse('Connected successfully'),
        '400': errorResponse('Invalid request'),
        '500': errorResponse('Server error'),
      },
    },
  },
};

// Network APIs
const networkPaths = {
  '/api/network/get-ethernet-details': {
    get: {
      tags: ['Network - Ethernet'],
      summary: 'Get Ethernet details',
      description: 'Retrieve Ethernet connection details',
      responses: {
        '200': successResponse('Ethernet details retrieved successfully'),
        '500': errorResponse('Server error'),
      },
    },
  },
};

// DateTime APIs
const datetimePaths = {
  '/api/datetime/get-datetime': {
    get: {
      tags: ['DateTime'],
      summary: 'Get current date and time',
      description: 'Retrieve current device date and time',
      responses: {
        '200': successResponse('DateTime retrieved successfully'),
        '500': errorResponse('Server error'),
      },
    },
  },
  '/api/datetime/set-datetime': {
    post: {
      tags: ['DateTime'],
      summary: 'Set date and time',
      description: 'Set device date and time',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['datetime'],
              properties: {
                datetime: { type: 'string', format: 'date-time', description: 'DateTime value' },
              },
            },
          },
        },
      },
      responses: {
        '200': successResponse('DateTime set successfully'),
        '400': errorResponse('Invalid request'),
        '500': errorResponse('Server error'),
      },
    },
  },
};

// Timezone APIs
const timezonePaths = {
  '/api/timezone/list-timezones': {
    get: {
      tags: ['Timezone'],
      summary: 'List all timezones',
      description: 'Get list of available timezones',
      responses: {
        '200': successResponse('Timezones listed successfully'),
        '500': errorResponse('Server error'),
      },
    },
  },
  '/api/timezone/get-timezone': {
    get: {
      tags: ['Timezone'],
      summary: 'Get current timezone',
      description: 'Retrieve current device timezone',
      responses: {
        '200': successResponse('Timezone retrieved successfully'),
        '500': errorResponse('Server error'),
      },
    },
  },
  '/api/timezone/set-timezone': {
    post: {
      tags: ['Timezone'],
      summary: 'Set timezone',
      description: 'Set device timezone',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['timezone'],
              properties: {
                timezone: { type: 'string', description: 'Timezone identifier' },
              },
            },
          },
        },
      },
      responses: {
        '200': successResponse('Timezone set successfully'),
        '400': errorResponse('Invalid request'),
        '500': errorResponse('Server error'),
      },
    },
  },
};

// NTP APIs
const ntpPaths = {
  '/api/ntp/get-ntp-server': {
    get: {
      tags: ['NTP'],
      summary: 'Get NTP server',
      description: 'Retrieve current NTP server',
      responses: {
        '200': successResponse('NTP server retrieved successfully'),
        '500': errorResponse('Server error'),
      },
    },
  },
  '/api/ntp/set-ntp-server': {
    post: {
      tags: ['NTP'],
      summary: 'Set NTP server',
      description: 'Set NTP server address',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['ntpserver'],
              properties: {
                ntpserver: { type: 'string', description: 'NTP server address' },
              },
            },
          },
        },
      },
      responses: {
        '200': successResponse('NTP server set successfully'),
        '400': errorResponse('Invalid request'),
        '500': errorResponse('Server error'),
      },
    },
  },
  '/api/ntp/get-ntp-enable': {
    get: {
      tags: ['NTP'],
      summary: 'Get NTP enable status',
      description: 'Check if NTP is enabled',
      responses: {
        '200': successResponse('NTP status retrieved successfully'),
        '500': errorResponse('Server error'),
      },
    },
  },
  '/api/ntp/set-ntp-enable': {
    post: {
      tags: ['NTP'],
      summary: 'Set NTP enable status',
      description: 'Enable or disable NTP',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['enable'],
              properties: {
                enable: { type: 'boolean', description: 'Enable/disable NTP' },
              },
            },
          },
        },
      },
      responses: {
        '200': successResponse('NTP status set successfully'),
        '400': errorResponse('Invalid request'),
        '500': errorResponse('Server error'),
      },
    },
  },
};

// Audio/Speaker APIs
const audioPaths = {
  '/api/audio/get-active-speaker': {
    get: {
      tags: ['Audio - Speaker'],
      summary: 'Get active speaker',
      description: 'Retrieve active speaker information including mute status and volume',
      responses: {
        '200': successResponse('Active speaker retrieved successfully', {
          type: 'object',
          properties: {
            active: { type: 'boolean', example: true },
            description: { type: 'string', example: 'Speaker (Senary Audio)' },
            id: { type: 'string', example: '{0.0.0.00000000}.{2bf59cab-dcd4-4796-8784-6fd02b17df20}' },
            mute: { type: 'boolean', example: false },
            volume: { type: 'number', example: 50 },
          },
        }),
        '500': errorResponse('Server error'),
      },
    },
  },
  '/api/audio/get-sound-cards': {
    get: {
      tags: ['Audio - Speaker'],
      summary: 'Get all sound cards',
      description: 'Retrieve list of all available sound cards/devices',
      responses: {
        '200': successResponse('Sound cards retrieved successfully', {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              active: { type: 'boolean', example: true },
              description: { type: 'string', example: 'Speaker (Senary Audio)' },
              id: { type: 'string', example: '{0.0.0.00000000}.{2bf59cab-dcd4-4796-8784-6fd02b17df20}' },
              mute: { type: 'boolean', example: false },
              volume: { type: 'number', example: 50 },
            },
          },
        }),
        '500': errorResponse('Server error'),
      },
    },
  },
  '/api/audio/get-speaker-mute': {
    get: {
      tags: ['Audio - Speaker'],
      summary: 'Get speaker mute status',
      description: 'Retrieve current speaker mute status',
      responses: {
        '200': successResponse('Mute status retrieved successfully', {
          type: 'object',
          properties: {
            mute: { type: 'boolean', example: false },
          },
        }),
        '500': errorResponse('Server error'),
      },
    },
  },
  '/api/audio/set-speaker-mute': {
    post: {
      tags: ['Audio - Speaker'],
      summary: 'Set speaker mute status',
      description: 'Mute or unmute the speaker',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['mute'],
              properties: {
                mute: { type: 'boolean', description: 'true to mute, false to unmute' },
              },
            },
          },
        },
      },
      responses: {
        '200': successResponse('Mute status set successfully'),
        '400': errorResponse('Invalid request'),
        '500': errorResponse('Server error'),
      },
    },
  },
  '/api/audio/get-speaker-volume': {
    get: {
      tags: ['Audio - Speaker'],
      summary: 'Get speaker volume',
      description: 'Retrieve current speaker volume level (0-100)',
      responses: {
        '200': successResponse('Volume retrieved successfully', {
          type: 'object',
          properties: {
            volume: { type: 'number', example: 50, minimum: 0, maximum: 100 },
          },
        }),
        '500': errorResponse('Server error'),
      },
    },
  },
  '/api/audio/set-speaker-volume': {
    post: {
      tags: ['Audio - Speaker'],
      summary: 'Set speaker volume',
      description: 'Set speaker volume level (0-100)',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['volume'],
              properties: {
                volume: { type: 'number', description: 'Volume level (0-100)', minimum: 0, maximum: 100 },
              },
            },
          },
        },
      },
      responses: {
        '200': successResponse('Volume set successfully'),
        '400': errorResponse('Invalid request'),
        '500': errorResponse('Server error'),
      },
    },
  }
};

// Microphone APIs (Section 2) - Input EQ only, no mute API
const microphonePaths = {
  '/api/microphone/get-input-eq': {
    get: {
      tags: ['Audio - Microphone'],
      summary: 'Get input EQ settings',
      description: 'Retrieve microphone input EQ bands (Low 120Hz, Medium 1000Hz, High 8000Hz)',
      responses: {
        '200': successResponse('Input EQ retrieved successfully', {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              bandwidth: { type: 'number', example: 0 },
              frequency: { type: 'number', example: 120, description: 'Frequency in Hz (120, 1000, 8000)' },
              gain: { type: 'number', example: 0, minimum: -6, maximum: 6, description: 'Gain in dB (-6 to +6)' },
            },
          },
        }),
        '500': errorResponse('Server error'),
      },
    },
  },
  '/api/microphone/set-input-eq': {
    post: {
      tags: ['Audio - Microphone'],
      summary: 'Set input EQ settings',
      description: 'Configure microphone input EQ bands. Gain must be between -6dB and +6dB',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['bands'],
              properties: {
                bands: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['bandwidth', 'frequency', 'gain'],
                    properties: {
                      bandwidth: { type: 'number', example: 0 },
                      frequency: { type: 'number', example: 120, description: 'Frequency in Hz' },
                      gain: { type: 'number', example: 0, minimum: -6, maximum: 6, description: 'Gain in dB (-6 to +6)' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        '200': successResponse('Input EQ set successfully'),
        '400': errorResponse('Invalid request'),
        '500': errorResponse('Server error'),
      },
    },
  },
};

// Audio Fence APIs (Section 3) - Separate from Microphone
const audioFencePaths = {
  '/api/audio-fence/get-parameters': {
    get: {
      tags: ['Audio - Fence'],
      summary: 'Get audio fence parameters',
      description: 'Retrieve audio fence parameters including enable status and angle',
      responses: {
        '200': successResponse('Audio fence parameters retrieved successfully', {
          type: 'object',
          properties: {
            fenceEnable: { type: 'boolean', example: true },
            fenceAngle: {
              type: 'object',
              properties: {
                start: { type: 'number', example: 45, description: 'Start angle (0-180)' },
                end: { type: 'number', example: 135, description: 'End angle (0-180)' },
              },
            },
            maxVolume: { type: 'number', example: 0 },
            nsLevel: { type: 'number', example: 0 },
          },
        }),
        '500': errorResponse('Server error'),
      },
    },
  },
  '/api/audio-fence/enable': {
    post: {
      tags: ['Audio - Fence'],
      summary: 'Enable audio fence',
      description: 'Enable audio fence with specified angle. Angle range must be between 30° and 90°. End must be greater than start.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['fenceAngle'],
              properties: {
                fenceAngle: {
                  type: 'object',
                  required: ['start', 'end'],
                  properties: {
                    start: { type: 'number', example: 45, description: 'Start angle (0-180)' },
                    end: { type: 'number', example: 135, description: 'End angle (0-180)' },
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        '200': successResponse('Audio fence enabled successfully'),
        '400': errorResponse('Invalid request'),
        '500': errorResponse('Server error'),
      },
    },
  },
  '/api/audio-fence/disable': {
    post: {
      tags: ['Audio - Fence'],
      summary: 'Disable audio fence',
      description: 'Disable audio fence. Firmware will auto-reset angle to {0, 180}',
      responses: {
        '200': successResponse('Audio fence disabled successfully'),
        '500': errorResponse('Server error'),
      },
    },
  },
  '/api/audio-fence/set-angle': {
    post: {
      tags: ['Audio - Fence'],
      summary: 'Set fence angle',
      description: 'Set audio fence angle. Only valid when fence is already enabled. Range must be 30-90°.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['fenceAngle'],
              properties: {
                fenceAngle: {
                  type: 'object',
                  required: ['start', 'end'],
                  properties: {
                    start: { type: 'number', example: 55, description: 'Start angle (0-180)' },
                    end: { type: 'number', example: 120, description: 'End angle (0-180)' },
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        '200': successResponse('Fence angle set successfully'),
        '400': errorResponse('Invalid request'),
        '500': errorResponse('Server error'),
      },
    },
  },
  '/api/audio-fence/get-status': {
    get: {
      tags: ['Audio - Fence'],
      summary: 'Get audio fence status',
      description: 'Retrieve audio fence status including parameters and last known angle',
      responses: {
        '200': successResponse('Audio fence status retrieved successfully', {
          type: 'object',
          properties: {
            parameters: {
              type: 'object',
              properties: {
                fenceEnable: { type: 'boolean' },
                fenceAngle: {
                  type: 'object',
                  properties: {
                    start: { type: 'number' },
                    end: { type: 'number' },
                  },
                },
                maxVolume: { type: 'number' },
                nsLevel: { type: 'number' },
              },
            },
            lastKnownAngle: {
              type: 'object',
              properties: {
                start: { type: 'number' },
                end: { type: 'number' },
              },
            },
          },
        }),
        '500': errorResponse('Server error'),
      },
    },
  },
};

// ============================================
// CAMERA APIs - Full Camera Page Support
// ============================================

// Reusable Schema Definitions
const fenceCoordinateSchema = {
  type: 'object',
  properties: {
    x: { type: 'number', description: 'X coordinate in centimeters' },
    y: { type: 'number', description: 'Y coordinate in centimeters' },
  },
};

const autoFrameSettingsSchema = {
  type: 'object',
  properties: {
    framePadding: { type: 'number', example: 1, description: '0=Tight, 1=Normal, 2=Wide' },
    transitionSpeed: { type: 'number', example: 1500, description: 'Speed in milliseconds' },
  },
};

const talkerSwitchSettingsSchema = {
  type: 'object',
  properties: {
    framePadding: { type: 'number', example: 1, description: '0=Tight, 1=Normal, 2=Wide' },
    level: { type: 'number', example: -30, description: 'Audio activation level in dB' },
    time: { type: 'number', example: 1500, description: 'Cross-talk switching time in ms' },
  },
};

const intelligentFocusSettingsSchema = {
  type: 'object',
  properties: {
    peopleShown: { type: 'number', example: 2, description: 'Number of people to show in frame' },
    roomViewEnabled: { type: 'boolean', example: false, description: 'Room view mode enabled' },
  },
};

const intelligentVideoResponseSchema = {
  type: 'object',
  properties: {
    fenceCoordinates: {
      type: 'array',
      items: fenceCoordinateSchema,
      description: 'Video fence polygon (4 points in centimeters)',
    },
    fenceEnabled: { type: 'boolean', example: true },
    mode: { type: 'number', example: 1, description: '0=Manual, 1=Auto Framing, 2=Active Speaker, 3=Intelligent Focus' },
    privacyShutter: { type: 'boolean', example: false },
    autoframe: autoFrameSettingsSchema,
    talkerswitch: talkerSwitchSettingsSchema,
    intelligentfocus: intelligentFocusSettingsSchema,
  },
};

const cameraPaths = {
  // Camera Device (Health/Availability)
  '/api/camera/device': {
    get: {
      tags: ['Camera - Device'],
      summary: 'Get camera device information',
      description: 'Retrieve camera health/availability status including model, connection status, firmware version',
      responses: {
        '200': successResponse('Camera device info retrieved successfully', {
          type: 'object',
          properties: {
            connected: { type: 'boolean', example: true },
            model: { type: 'string', example: 'AIO Camera' },
            firmwareVersion: { type: 'string', example: '1.0.0' },
            serialNumber: { type: 'string', example: 'SN123456' },
            status: { type: 'string', example: 'active' },
          },
        }),
        '500': errorResponse('Server error'),
      },
    },
  },

  // Camera Room State (Occupancy)
  '/api/camera/roomstate': {
    get: {
      tags: ['Camera - Device'],
      summary: 'Get room state (occupancy)',
      description: 'Retrieve number of people detected in the room',
      responses: {
        '200': successResponse('Room state retrieved successfully', {
          type: 'object',
          properties: {
            peopleNum: { type: 'number', example: 3, description: 'Number of people detected' },
          },
        }),
        '500': errorResponse('Server error'),
      },
    },
  },

  // Intelligent Video (Main Camera Settings)
  '/api/camera/intelligentvideo': {
    get: {
      tags: ['Camera - Intelligent Video'],
      summary: 'Get intelligent video parameters',
      description: 'Retrieve all camera settings including mode, fence, auto frame, talker switch, and intelligent focus settings',
      responses: {
        '200': successResponse('Intelligent video params retrieved successfully', intelligentVideoResponseSchema),
        '500': errorResponse('Server error'),
      },
    },
    post: {
      tags: ['Camera - Intelligent Video'],
      summary: 'Set intelligent video parameters',
      description: 'Update camera settings (partial update supported - only include fields to change)',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                mode: { type: 'number', description: '0=Manual, 1=Auto Framing, 2=Active Speaker, 3=Intelligent Focus' },
                fenceEnabled: { type: 'boolean', description: 'Enable/disable video fence' },
                fenceCoordinates: {
                  type: 'array',
                  items: fenceCoordinateSchema,
                  description: 'Video fence polygon (4 points)',
                },
                autoframe: autoFrameSettingsSchema,
                talkerswitch: talkerSwitchSettingsSchema,
                intelligentfocus: intelligentFocusSettingsSchema,
              },
            },
            examples: {
              setMode: {
                summary: 'Set camera mode to Auto Framing',
                value: { mode: 1 },
              },
              enableFence: {
                summary: 'Enable video fence',
                value: { fenceEnabled: true },
              },
              setAutoFrame: {
                summary: 'Configure auto framing',
                value: { autoframe: { framePadding: 1, transitionSpeed: 1500 } },
              },
            },
          },
        },
      },
      responses: {
        '200': successResponse('Intelligent video params updated successfully'),
        '400': errorResponse('Invalid request'),
        '500': errorResponse('Server error'),
      },
    },
  },

  // Camera Mode APIs
  '/api/camera/mode': {
    post: {
      tags: ['Camera - Mode'],
      summary: 'Set camera mode',
      description: 'Change camera mode. Mode 0=Manual, 1=Auto Framing, 2=Active Speaker, 3=Intelligent Focus',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['mode'],
              properties: {
                mode: { type: 'number', enum: [0, 1, 2, 3], description: '0=Manual, 1=Auto Framing, 2=Active Speaker, 3=Intelligent Focus' },
              },
            },
          },
        },
      },
      responses: {
        '200': successResponse('Camera mode set successfully'),
        '400': errorResponse('Invalid request'),
        '500': errorResponse('Server error'),
      },
    },
  },

  // Video Fence APIs
  '/api/camera/fence/status': {
    get: {
      tags: ['Camera - Video Fence'],
      summary: 'Get video fence status',
      description: 'Retrieve video fence enabled status and coordinates',
      responses: {
        '200': successResponse('Video fence status retrieved successfully', {
          type: 'object',
          properties: {
            fenceEnabled: { type: 'boolean', example: true },
            fenceCoordinates: {
              type: 'array',
              items: fenceCoordinateSchema,
            },
          },
        }),
        '500': errorResponse('Server error'),
      },
    },
  },
  '/api/camera/fence/enable': {
    post: {
      tags: ['Camera - Video Fence'],
      summary: 'Enable video fence',
      description: 'Enable the video fence feature',
      responses: {
        '200': successResponse('Video fence enabled successfully'),
        '500': errorResponse('Server error'),
      },
    },
  },
  '/api/camera/fence/disable': {
    post: {
      tags: ['Camera - Video Fence'],
      summary: 'Disable video fence',
      description: 'Disable the video fence feature',
      responses: {
        '200': successResponse('Video fence disabled successfully'),
        '500': errorResponse('Server error'),
      },
    },
  },
  '/api/camera/fence/coordinates': {
    post: {
      tags: ['Camera - Video Fence'],
      summary: 'Set video fence coordinates',
      description: 'Set the video fence polygon coordinates. Requires exactly 4 coordinate points in centimeters.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['fenceCoordinates'],
              properties: {
                fenceCoordinates: {
                  type: 'array',
                  minItems: 4,
                  maxItems: 4,
                  items: {
                    type: 'object',
                    required: ['x', 'y'],
                    properties: {
                      x: { type: 'number', description: 'X coordinate in centimeters' },
                      y: { type: 'number', description: 'Y coordinate in centimeters' },
                    },
                  },
                },
              },
            },
            example: {
              fenceCoordinates: [
                { x: -600, y: 200 },
                { x: -500, y: 900 },
                { x: 400, y: 1000 },
                { x: 500, y: 100 },
              ],
            },
          },
        },
      },
      responses: {
        '200': successResponse('Fence coordinates set successfully'),
        '400': errorResponse('Invalid request'),
        '500': errorResponse('Server error'),
      },
    },
  },

  // Auto Framing APIs
  '/api/camera/autoframe': {
    post: {
      tags: ['Camera - Auto Framing'],
      summary: 'Set auto framing settings',
      description: 'Configure auto framing frame padding (Tight/Normal/Wide) and transition speed',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                framePadding: { type: 'number', enum: [0, 1, 2], description: '0=Tight, 1=Normal, 2=Wide' },
                transitionSpeed: { type: 'number', minimum: 0, description: 'Transition speed in milliseconds' },
              },
            },
            examples: {
              setPadding: {
                summary: 'Set frame padding to Normal',
                value: { framePadding: 1 },
              },
              setSpeed: {
                summary: 'Set transition speed',
                value: { transitionSpeed: 1500 },
              },
              setBoth: {
                summary: 'Set both settings',
                value: { framePadding: 2, transitionSpeed: 2000 },
              },
            },
          },
        },
      },
      responses: {
        '200': successResponse('Auto framing settings updated successfully'),
        '400': errorResponse('Invalid request'),
        '500': errorResponse('Server error'),
      },
    },
  },

  // Talker Switch (Active Speaker) APIs
  '/api/camera/talkerswitch': {
    post: {
      tags: ['Camera - Active Speaker'],
      summary: 'Set talker switch settings',
      description: 'Configure active speaker framing settings including frame padding, audio level, and switching time',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                framePadding: { type: 'number', enum: [0, 1, 2], description: '0=Tight, 1=Normal, 2=Wide' },
                level: { type: 'number', description: 'Audio activation level in dB (e.g., -30)' },
                time: { type: 'number', description: 'Cross-talk switching time in milliseconds' },
              },
            },
            example: { framePadding: 1, level: -30, time: 1500 },
          },
        },
      },
      responses: {
        '200': successResponse('Talker switch settings updated successfully'),
        '400': errorResponse('Invalid request'),
        '500': errorResponse('Server error'),
      },
    },
  },

  // Intelligent Focus APIs
  '/api/camera/intelligentfocus': {
    post: {
      tags: ['Camera - Intelligent Focus'],
      summary: 'Set intelligent focus settings',
      description: 'Configure intelligent focus settings including number of people to show and room view mode',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                peopleShown: { type: 'number', description: 'Number of people to show in frame' },
                roomViewEnabled: { type: 'boolean', description: 'Enable room view mode' },
              },
            },
            example: { peopleShown: 2, roomViewEnabled: false },
          },
        },
      },
      responses: {
        '200': successResponse('Intelligent focus settings updated successfully'),
        '400': errorResponse('Invalid request'),
        '500': errorResponse('Server error'),
      },
    },
  },

  // External Video (Camera Preview)
  '/api/camera/externalvideo': {
    get: {
      tags: ['Camera - External Video'],
      summary: 'Get external video (camera preview) status',
      description: 'Retrieve camera preview enabled status',
      responses: {
        '200': successResponse('External video status retrieved successfully', {
          type: 'object',
          properties: {
            enable: { type: 'boolean', example: true },
          },
        }),
        '500': errorResponse('Server error'),
      },
    },
    post: {
      tags: ['Camera - External Video'],
      summary: 'Set external video (camera preview) status',
      description: 'Enable or disable camera preview output',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['enable'],
              properties: {
                enable: { type: 'boolean', description: 'true to enable, false to disable' },
              },
            },
          },
        },
      },
      responses: {
        '200': successResponse('External video status updated successfully'),
        '400': errorResponse('Invalid request'),
        '500': errorResponse('Server error'),
      },
    },
  },

  // Combined Camera Page Data
  '/api/camera/page-data': {
    get: {
      tags: ['Camera - Page Data'],
      summary: 'Get combined camera page data',
      description: 'Retrieve all data needed for camera page in a single API call (device info, intelligent video, room state, external video)',
      responses: {
        '200': successResponse('Camera page data retrieved successfully', {
          type: 'object',
          properties: {
            deviceInfo: {
              type: 'object',
              description: 'Camera device health/availability',
              properties: {
                connected: { type: 'boolean' },
                model: { type: 'string' },
                firmwareVersion: { type: 'string' },
              },
            },
            intelligentVideo: intelligentVideoResponseSchema,
            roomState: {
              type: 'object',
              properties: {
                peopleNum: { type: 'number' },
              },
            },
            externalVideo: {
              type: 'object',
              properties: {
                enable: { type: 'boolean' },
              },
            },
          },
        }),
        '500': errorResponse('Server error'),
      },
    },
  },
};


// Main Swagger Document
export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'gRPC Client HTTP Server',
    version: '1.0.0',
    description: 'HTTP wrapper for gRPC device control operations',
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: 'Development server',
    },
  ],
  tags: [
    { name: 'Health', description: 'Health check endpoints' },
    { name: 'Device Control', description: 'Device information and control' },
    { name: 'System', description: 'System operations (reboot, shutdown, etc.)' },
    { name: 'Network - WiFi', description: 'WiFi network operations' },
    { name: 'Network - Ethernet', description: 'Ethernet network operations' },
    { name: 'DateTime', description: 'Date and time operations' },
    { name: 'Timezone', description: 'Timezone operations' },
    { name: 'NTP', description: 'NTP server operations' },
    { name: 'Audio - Speaker', description: 'Speaker control operations (Section 1)' },
    { name: 'Audio - Microphone', description: 'Microphone and Input EQ operations (Section 2)' },
    { name: 'Audio - Fence', description: 'Audio fence control operations (Section 3)' },
    { name: 'Camera - Device', description: 'Camera device health and room state' },
    { name: 'Camera - Intelligent Video', description: 'Main camera settings (mode, fence, auto frame, etc.)' },
    { name: 'Camera - Mode', description: 'Camera mode control (Manual, Auto Framing, Active Speaker, Intelligent Focus)' },
    { name: 'Camera - Video Fence', description: 'Video fence enable/disable and coordinates' },
    { name: 'Camera - Auto Framing', description: 'Auto framing settings (frame padding, transition speed)' },
    { name: 'Camera - Active Speaker', description: 'Active speaker (talker switch) settings' },
    { name: 'Camera - Intelligent Focus', description: 'Intelligent focus (multi-cell) settings' },
    { name: 'Camera - External Video', description: 'Camera preview (external video) control' },
    { name: 'Camera - Page Data', description: 'Combined camera page data' },
    { name: 'Camera - Legacy', description: 'Legacy camera APIs (deprecated)' },
  ],
  paths: {
    ...healthPaths,
    ...devicePaths,
    ...systemPaths,
    ...wifiPaths,
    ...networkPaths,
    ...datetimePaths,
    ...timezonePaths,
    ...ntpPaths,
    ...audioPaths,
    ...microphonePaths,
    ...audioFencePaths,
    ...cameraPaths,
  },
};

export default swaggerDocument;
