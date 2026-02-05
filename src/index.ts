import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import GrpcClient from './grpc-client';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './swagger-config';

declare module 'swagger-ui-express';

const app: Express = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request/Response logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  console.log(`\n📥 [${new Date().toISOString()}] ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }

  const originalJson = res.json.bind(res);
  res.json = function (body: any) {
    const duration = Date.now() - startTime;
    console.log(`📤 [${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    console.log('Response:', JSON.stringify(body, null, 2));
    return originalJson(body);
  };

  next();
});

// Initialize gRPC client
const grpcClient = new GrpcClient('localhost:50051');

// Swagger documentation setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


app.get('/api/getDetails', async (req: Request, res: Response) => {
  try {
    const response = await grpcClient.handleRequest(
      'command-control',
      // 'get-device-info',
      // 'get-wifi-details',
      // 'get-aio-bar-id',
      // 'get-ethernet-details',
      // 'get-datetime',

      // speaker details -----
      // 'get-active-speaker',
      // 'get-controller-device',
      // 'get-extension-mic-device',
      // 'get-monitors',
      'get-camera-preview',


      
      {},
    );
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

// Device Control APIs
app.get('/api/device/get-device-info', async (req: Request, res: Response) => {
  try {
    const response = await grpcClient.handleRequest('command-control', 'get-device-info', {});
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});
// Device Control APIs
app.post('/api/device/system-reboot', async (req: Request, res: Response) => {
  try {
    const response = await grpcClient.handleRequest('command-control', 'system-reboot', {});
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

app.get('/api/device/get-aio-bar-id', async (req: Request, res: Response) => {
  try {
    const response = await grpcClient.handleRequest('command-control', 'get-aio-bar-id', {});
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

// WiFi APIs
app.get('/api/wifi/get-wifi-details', async (req: Request, res: Response) => {
  try {
    const response = await grpcClient.handleRequest('command-control', 'get-wifi-details', {});
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

app.get('/api/wifi/scan-wifi', async (req: Request, res: Response) => {
  try {
    const response = await grpcClient.handleRequest('command-control', 'scan-wifi', {});
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

app.post('/api/wifi/disconnect-wifi', async (req: Request, res: Response) => {
  try {
    // const { id } = req.body;
    const response = await grpcClient.handleRequest('command-control', 'disconnect-wifi');
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

app.post('/api/wifi/connect-wifi', async (req: Request, res: Response) => {
  try {
    const { ssid, password } = req.body;
    if (!ssid || !password) {
      return res.status(400).json({ error: 'SSID and password are required' });
    }
    const response = await grpcClient.handleRequest('command-control', 'connect-wifi', { ssid, password });
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

// Network APIs
app.get('/api/network/get-ethernet-details', async (req: Request, res: Response) => {
  try {
    const response = await grpcClient.handleRequest('command-control', 'get-ethernet-details', {});
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

// DateTime APIs
app.get('/api/datetime/get-datetime', async (req: Request, res: Response) => {
  try {
    const response = await grpcClient.handleRequest('command-control', 'get-datetime', {});
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

app.post('/api/datetime/set-datetime', async (req: Request, res: Response) => {
  try {
    const { datetime } = req.body;
    if (!datetime) {
      return res.status(400).json({ error: 'DateTime is required' });
    }
    const response = await grpcClient.handleRequest('command-control', 'set-datetime', { datetime });
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

// Timezone APIs
app.get('/api/timezone/list-timezones', async (req: Request, res: Response) => {
  try {
    const response = await grpcClient.handleRequest('command-control', 'list-timezones', {});
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

app.get('/api/timezone/get-timezone', async (req: Request, res: Response) => {
  try {
    const response = await grpcClient.handleRequest('command-control', 'get-timezone', {});
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

app.post('/api/timezone/set-timezone', async (req: Request, res: Response) => {
  try {
    const { timezone } = req.body;
    if (!timezone) {
      return res.status(400).json({ error: 'Timezone is required' });
    }
    const response = await grpcClient.handleRequest('command-control', 'set-timezone', { timezone });
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

// NTP APIs
app.get('/api/ntp/get-ntp-server', async (req: Request, res: Response) => {
  try {
    const response = await grpcClient.handleRequest('command-control', 'get-ntp-server', {});
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

app.post('/api/ntp/set-ntp-server', async (req: Request, res: Response) => {
  try {
    const { ntpserver } = req.body;
    if (!ntpserver) {
      return res.status(400).json({ error: 'NTP server is required' });
    }
    const response = await grpcClient.handleRequest('command-control', 'set-ntp-server', { ntpserver });
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

app.get('/api/ntp/get-ntp-enable', async (req: Request, res: Response) => {
  try {
    const response = await grpcClient.handleRequest('command-control', 'get-ntp-enable', {});
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

app.post('/api/ntp/set-ntp-enable', async (req: Request, res: Response) => {
  try {
    const { enable } = req.body;
    if (enable === undefined) {
      return res.status(400).json({ error: 'Enable flag is required' });
    }
    const response = await grpcClient.handleRequest('command-control', 'set-ntp-enable', { enable });
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

// Audio/Speaker APIs
app.get('/api/audio/get-active-speaker', async (req: Request, res: Response) => {
  try {
    const response = await grpcClient.handleRequest('command-control', 'get-active-speaker', {});
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

app.get('/api/audio/get-sound-cards', async (req: Request, res: Response) => {
  try {
    const response = await grpcClient.handleRequest('command-control', 'get-sound-cards', {});
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

app.get('/api/audio/get-speaker-mute', async (req: Request, res: Response) => {
  try {
    const response = await grpcClient.handleRequest('command-control', 'get-speaker-mute', {});
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

app.post('/api/audio/set-speaker-mute', async (req: Request, res: Response) => {
  try {
    const { mute } = req.body;
    if (mute === undefined) {
      return res.status(400).json({ error: 'Mute flag is required' });
    }
    const response = await grpcClient.handleRequest('command-control', 'set-speaker-mute', { mute });
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

app.get('/api/audio/get-speaker-volume', async (req: Request, res: Response) => {
  try {
    const response = await grpcClient.handleRequest('command-control', 'get-speaker-volume', {});
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

app.post('/api/audio/set-speaker-volume', async (req: Request, res: Response) => {
  try {
    const { volume } = req.body;
    if (volume === undefined) {
      return res.status(400).json({ error: 'Volume is required' });
    }
    if (volume < 0 || volume > 100) {
      return res.status(400).json({ error: 'Volume must be between 0 and 100' });
    }
    const response = await grpcClient.handleRequest('command-control', 'set-speaker-volume', { volume });
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

// Microphone APIs (Section 2) - Input EQ only, no mute API
app.get('/api/microphone/get-input-eq', async (req: Request, res: Response) => {
  try {
    const response = await grpcClient.handleRequest('command-control', 'get-input-eq', {});
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

app.post('/api/microphone/set-input-eq', async (req: Request, res: Response) => {
  try {
    const { bands } = req.body;
    if (!bands || !Array.isArray(bands)) {
      return res.status(400).json({ error: 'EQ bands array is required' });
    }
    // Validate gain range for each band
    for (const band of bands) {
      if (band.gain < -6 || band.gain > 6) {
        return res.status(400).json({ error: 'EQ gain must be between -6 and +6 dB' });
      }
    }
    const response = await grpcClient.handleRequest('command-control', 'set-input-eq', { bands });
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

// Audio Fence APIs (Section 3) - Separate from Microphone
app.get('/api/audio-fence/get-parameters', async (req: Request, res: Response) => {
  try {
    const response = await grpcClient.handleRequest('command-control', 'get-audio-fence-parameters', {});
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

app.post('/api/audio-fence/enable', async (req: Request, res: Response) => {
  try {
    const { fenceAngle } = req.body;
    if (!fenceAngle || fenceAngle.start === undefined || fenceAngle.end === undefined) {
      return res.status(400).json({ error: 'Fence angle with start and end is required' });
    }
    // Validate fence angle
    const range = fenceAngle.end - fenceAngle.start;
    if (fenceAngle.end <= fenceAngle.start) {
      return res.status(400).json({ error: 'Fence angle end must be greater than start' });
    }
    if (range < 30 || range > 90) {
      return res.status(400).json({ error: 'Fence angle range must be between 30 and 90 degrees' });
    }
    const response = await grpcClient.handleRequest('command-control', 'enable-audio-fence', { fenceAngle });
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

app.post('/api/audio-fence/disable', async (req: Request, res: Response) => {
  try {
    const response = await grpcClient.handleRequest('command-control', 'disable-audio-fence', {});
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

app.post('/api/audio-fence/set-angle', async (req: Request, res: Response) => {
  try {
    const { fenceAngle } = req.body;
    if (!fenceAngle || fenceAngle.start === undefined || fenceAngle.end === undefined) {
      return res.status(400).json({ error: 'Fence angle with start and end is required' });
    }
    // Validate fence angle
    const range = fenceAngle.end - fenceAngle.start;
    if (fenceAngle.end <= fenceAngle.start) {
      return res.status(400).json({ error: 'Fence angle end must be greater than start' });
    }
    if (range < 30 || range > 90) {
      return res.status(400).json({ error: 'Fence angle range must be between 30 and 90 degrees' });
    }
    const response = await grpcClient.handleRequest('command-control', 'set-fence-angle', { fenceAngle });
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

app.get('/api/audio-fence/get-status', async (req: Request, res: Response) => {
  try {
    const response = await grpcClient.handleRequest('command-control', 'get-audio-fence-status', {});
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

// Combined Audio Page API
app.get('/api/audio/get-audio-page-status', async (req: Request, res: Response) => {
  try {
    const response = await grpcClient.handleRequest('command-control', 'get-audio-page-status', {});
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

// ============================================
// CAMERA APIs
// ============================================

// Camera Device (Health/Availability)
app.get('/api/camera/device', async (req: Request, res: Response) => {
  try {
    const response = await grpcClient.handleRequest('command-control', 'get-camera-device', {});
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

// Camera Room State (Occupancy Detection)
app.get('/api/camera/roomstate', async (req: Request, res: Response) => {
  try {
    const response = await grpcClient.handleRequest('command-control', 'get-occupant-detected-count', {});
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

// Intelligent Video (Main Camera Settings)
app.get('/api/camera/intelligentvideo', async (req: Request, res: Response) => {
  try {
    const response = await grpcClient.handleRequest('command-control', 'get-intelligent-video', {});
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

app.post('/api/camera/intelligentvideo', async (req: Request, res: Response) => {
  try {
    const params = req.body;
    if (!params || Object.keys(params).length === 0) {
      return res.status(400).json({ error: 'At least one parameter is required' });
    }
    const response = await grpcClient.handleRequest('command-control', 'set-camera-mode', params);
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

app.post('/api/camera/mode', async (req: Request, res: Response) => {
  try {
    const { mode } = req.body;
    if (mode === undefined) {
      return res.status(400).json({ error: 'Mode is required' });
    }
    if (![0, 1, 2, 3].includes(mode)) {
      return res.status(400).json({ error: 'Mode must be 0 (Manual), 1 (Auto Framing), 2 (Active Speaker), or 3 (Intelligent Focus)' });
    }
    const response = await grpcClient.handleRequest('command-control', 'set-camera-mode', { mode });
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

// Video Fence APIs
app.get('/api/camera/fence/status', async (req: Request, res: Response) => {
  try {
    const response = await grpcClient.handleRequest('command-control', 'get-video-fence-status', {});
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

app.post('/api/camera/fence/enable', async (req: Request, res: Response) => {
  try {
    const response = await grpcClient.handleRequest('command-control', 'set-video-fence-enabled', { fenceEnabled: true });
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

app.post('/api/camera/fence/disable', async (req: Request, res: Response) => {
  try {
    const response = await grpcClient.handleRequest('command-control', 'set-video-fence-enabled', { fenceEnabled: false });
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

app.post('/api/camera/fence/coordinates', async (req: Request, res: Response) => {
  try {
    const { fenceCoordinates } = req.body;
    if (!fenceCoordinates || !Array.isArray(fenceCoordinates)) {
      return res.status(400).json({ error: 'fenceCoordinates array is required' });
    }
    // if (fenceCoordinates.length !== 4) {
    //   return res.status(400).json({ error: 'fenceCoordinates must contain exactly 4 points' });
    // }
    for (const coord of fenceCoordinates) {
      if (coord.x === undefined || coord.y === undefined) {
        return res.status(400).json({ error: 'Each coordinate must have x and y values' });
      }
    }
    const response = await grpcClient.handleRequest('command-control', 'set-video-fence-coordinates', { fenceCoordinates });
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

app.post('/api/camera/autoframe', async (req: Request, res: Response) => {
  try {
    const { framePadding, transitionSpeed } = req.body;
    if (framePadding === undefined && transitionSpeed === undefined) {
      return res.status(400).json({ error: 'At least one of framePadding or transitionSpeed is required' });
    }
    const autoframe: any = {};
    if (framePadding !== undefined) {
      if (![0, 1, 2].includes(framePadding)) {
        return res.status(400).json({ error: 'framePadding must be 0 (Tight), 1 (Normal), or 2 (Wide)' });
      }
      autoframe.framePadding = framePadding;
    }
    if (transitionSpeed !== undefined) {
      if (transitionSpeed < 0) {
        return res.status(400).json({ error: 'transitionSpeed must be a positive number (milliseconds)' });
      }
      autoframe.transitionSpeed = transitionSpeed;
    }
    const response = await grpcClient.handleRequest('command-control', 'set-auto-frame-settings', { autoframe });
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

app.post('/api/camera/talkerswitch', async (req: Request, res: Response) => {
  try {
    const { framePadding, level, time } = req.body;
    if (framePadding === undefined && level === undefined && time === undefined) {
      return res.status(400).json({ error: 'At least one of framePadding, level, or time is required' });
    }
    const talkerswitch: any = {};
    if (framePadding !== undefined) {
      if (![0, 1, 2].includes(framePadding)) {
        return res.status(400).json({ error: 'framePadding must be 0 (Tight), 1 (Normal), or 2 (Wide)' });
      }
      talkerswitch.framePadding = framePadding;
    }
    if (level !== undefined) talkerswitch.level = level;
    if (time !== undefined) talkerswitch.time = time;
    const response = await grpcClient.handleRequest('command-control', 'set-talker-switch-settings', { talkerswitch });
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

app.post('/api/camera/intelligentfocus', async (req: Request, res: Response) => {
  try {
    const { peopleShown, roomViewEnabled } = req.body;
    if (peopleShown === undefined && roomViewEnabled === undefined) {
      return res.status(400).json({ error: 'At least one of peopleShown or roomViewEnabled is required' });
    }
    const intelligentfocus: any = {};
    if (peopleShown !== undefined) intelligentfocus.peopleShown = peopleShown;
    if (roomViewEnabled !== undefined) intelligentfocus.roomViewEnabled = roomViewEnabled;
    const response = await grpcClient.handleRequest('command-control', 'set-intelligent-focus-settings', { intelligentfocus });
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

// External Video (Camera Preview)
app.get('/api/camera/externalvideo', async (req: Request, res: Response) => {
  try {
    const response = await grpcClient.handleRequest('command-control', 'get-camera-preview', {});
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

app.post('/api/camera/externalvideo', async (req: Request, res: Response) => {
  try {
    const { enable } = req.body;
    if (enable === undefined) {
      return res.status(400).json({ error: 'enable flag is required' });
    }
    const response = await grpcClient.handleRequest('command-control', 'set-camera-preview', { enable });
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

// Combined Camera Page Data API
app.get('/api/camera/page-data', async (req: Request, res: Response) => {
  try {
    const response = await grpcClient.handleRequest('command-control', 'get-camera-page-data', {});
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    error: { code: 'SERVER_ERROR', message: err.message },
  });
});

// System APIs
app.post('/api/system/reboot', async (req: Request, res: Response) => {
  try {
    const { reason } = req.body;
    const response = await grpcClient.handleRequest('command-control', 'system-reboot', { reason: reason || 'User requested reboot' });
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 gRPC Client HTTP Server running on http://localhost:${PORT}`);
  console.log(`📡 Connected to gRPC server: localhost:50051`);
  console.log(`\n📚 API Documentation available at: http://localhost:${PORT}/api-docs`);
});