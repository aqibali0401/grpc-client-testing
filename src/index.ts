import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import GrpcClient from './grpc-client';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import fs from 'fs';

declare module 'swagger-ui-express';
declare module 'yamljs';

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
const swaggerFilePath = path.join(__dirname, '../swagger.yaml');
let swaggerDocument: any;

if (fs.existsSync(swaggerFilePath)) {
  swaggerDocument = YAML.load(swaggerFilePath);
  console.log('✅ Swagger documentation loaded successfully');
} else {
  console.warn('⚠️ Swagger file not found at:', swaggerFilePath);
  swaggerDocument = {
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
    paths: {
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
      '/api/device/get-device-info': {
        get: {
          tags: ['Device Control'],
          summary: 'Get device information',
          description: 'Retrieve detailed device information',
          responses: {
            '200': {
              description: 'Device information retrieved successfully',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
            '500': {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: {
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
                  },
                },
              },
            },
          },
        },
      },
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
            '200': {
              description: 'Reboot initiated successfully',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
            '400': {
              description: 'Invalid request',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
            '500': {
              description: 'Server error',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
          },
        },
      },
      '/api/wifi/get-wifi-details': {
        get: {
          tags: ['Network - WiFi'],
          summary: 'Get WiFi details',
          description: 'Retrieve current WiFi connection details',
          responses: {
            '200': {
              description: 'WiFi details retrieved successfully',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
            '500': {
              description: 'Server error',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
          },
        },
      },
      '/api/device/get-aio-bar-id': {
        get: {
          tags: ['Device Control'],
          summary: 'Get AIO Bar ID',
          description: 'Retrieve AIO Bar ID',
          responses: {
            '200': {
              description: 'AIO Bar ID retrieved successfully',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
            '500': {
              description: 'Server error',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
          },
        },
      },
      '/api/network/get-ethernet-details': {
        get: {
          tags: ['Network - Ethernet'],
          summary: 'Get Ethernet details',
          description: 'Retrieve Ethernet connection details',
          responses: {
            '200': {
              description: 'Ethernet details retrieved successfully',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
            '500': {
              description: 'Server error',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
          },
        },
      },
      '/api/wifi/scan-wifi': {
        get: {
          tags: ['Network - WiFi'],
          summary: 'Scan WiFi networks',
          description: 'Scan for available WiFi networks',
          responses: {
            '200': {
              description: 'WiFi networks scanned successfully',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
            '500': {
              description: 'Server error',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
          },
        },
      },
      '/api/wifi/disconnect-wifi': {
        post: {
          tags: ['Network - WiFi'],
          summary: 'Disconnect WiFi network',
          description: 'Disconnect from a WiFi network',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['id'],
                  properties: {
                    id: { type: 'string', description: 'WiFi network ID' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Disconnected successfully',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
            '400': {
              description: 'Invalid request',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
            '500': {
              description: 'Server error',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
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
            '200': {
              description: 'Connected successfully',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
            '400': {
              description: 'Invalid request',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
            '500': {
              description: 'Server error',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
          },
        },
      },
      '/api/datetime/get-datetime': {
        get: {
          tags: ['DateTime'],
          summary: 'Get current date and time',
          description: 'Retrieve current device date and time',
          responses: {
            '200': {
              description: 'DateTime retrieved successfully',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
            '500': {
              description: 'Server error',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
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
            '200': {
              description: 'DateTime set successfully',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
            '400': {
              description: 'Invalid request',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
            '500': {
              description: 'Server error',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
          },
        },
      },
      '/api/timezone/list-timezones': {
        get: {
          tags: ['Timezone'],
          summary: 'List all timezones',
          description: 'Get list of available timezones',
          responses: {
            '200': {
              description: 'Timezones listed successfully',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
            '500': {
              description: 'Server error',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
          },
        },
      },
      '/api/timezone/get-timezone': {
        get: {
          tags: ['Timezone'],
          summary: 'Get current timezone',
          description: 'Retrieve current device timezone',
          responses: {
            '200': {
              description: 'Timezone retrieved successfully',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
            '500': {
              description: 'Server error',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
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
            '200': {
              description: 'Timezone set successfully',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
            '400': {
              description: 'Invalid request',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
            '500': {
              description: 'Server error',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
          },
        },
      },
      '/api/ntp/get-ntp-server': {
        get: {
          tags: ['NTP'],
          summary: 'Get NTP server',
          description: 'Retrieve current NTP server',
          responses: {
            '200': {
              description: 'NTP server retrieved successfully',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
            '500': {
              description: 'Server error',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
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
            '200': {
              description: 'NTP server set successfully',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
            '400': {
              description: 'Invalid request',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
            '500': {
              description: 'Server error',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
          },
        },
      },
      '/api/ntp/get-ntp-enable': {
        get: {
          tags: ['NTP'],
          summary: 'Get NTP enable status',
          description: 'Check if NTP is enabled',
          responses: {
            '200': {
              description: 'NTP status retrieved successfully',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
            '500': {
              description: 'Server error',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
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
            '200': {
              description: 'NTP status set successfully',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
            '400': {
              description: 'Invalid request',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
            '500': {
              description: 'Server error',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
          },
        },
      },
    },
  };
}

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
      'get-datetime',

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
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'WiFi network ID is required' });
    }
    const response = await grpcClient.handleRequest('command-control', 'disconnect-wifi', { id });
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