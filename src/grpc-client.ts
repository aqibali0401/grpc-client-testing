import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';

// Load proto definition - path from src folder
// src/grpc-client.ts -> .. -> grpc-client -> .. -> Edge-moduler/proto/edge.proto
const PROTO_PATH = join(__dirname, '../../Edge-moduler/proto/edge.proto');

// Path to certificates directory
const CERTS_DIR = join(__dirname, '../certs');

/**
 * mTLS status tracking - exported for logging
 */
export interface MtlsStatus {
  enabled: boolean;
  certsFound: boolean;
  envSetting: string;
  certsDir: string;
  missingCerts: string[];
}

let mtlsStatus: MtlsStatus | null = null;

/**
 * Get the current mTLS status for logging purposes
 */
export const getMtlsStatus = (): MtlsStatus | null => mtlsStatus;

/**
 * Check if mTLS certificates are available and return details
 */
const checkCertificates = (): { available: boolean; missing: string[] } => {
  const requiredFiles = ['ca.crt', 'client.crt', 'client.key'];
  const missing = requiredFiles.filter(file => !existsSync(join(CERTS_DIR, file)));
  return { available: missing.length === 0, missing };
};

/**
 * Create mTLS client credentials
 * @returns ChannelCredentials with mutual TLS enabled
 */
const createMtlsCredentials = (): grpc.ChannelCredentials => {
  const caCert = readFileSync(join(CERTS_DIR, 'ca.crt'));
  const clientCert = readFileSync(join(CERTS_DIR, 'client.crt'));
  const clientKey = readFileSync(join(CERTS_DIR, 'client.key'));

  console.log('🔐 mTLS enabled: Client will present certificate to server');

  return grpc.credentials.createSsl(
    caCert,      // CA certificate to verify server certificate
    clientKey,   // Client private key
    clientCert   // Client certificate
  );
};

/**
 * Get client credentials based on environment
 * - mTLS enabled: Uses SSL credentials with client certificate
 * - mTLS disabled: Uses insecure credentials (for development only)
 */
const getClientCredentials = (): grpc.ChannelCredentials => {
  const envSetting = process.env.MTLS_ENABLED || 'true';
  const certCheck = checkCertificates();
  const mtlsEnabled = envSetting !== 'false' && certCheck.available;

  // Store status for later logging
  mtlsStatus = {
    enabled: mtlsEnabled,
    certsFound: certCheck.available,
    envSetting,
    certsDir: CERTS_DIR,
    missingCerts: certCheck.missing,
  };

  // Log mTLS configuration
  const logLines = [
    '',
    '========== mTLS Configuration (gRPC Client) ==========',
    `MTLS_ENABLED env: ${envSetting}`,
    `Certs directory: ${CERTS_DIR}`,
    `Certs found: ${certCheck.available}`,
    ...(certCheck.missing.length > 0 ? [`Missing certs: ${certCheck.missing.join(', ')}`] : []),
    `mTLS status: ${mtlsEnabled ? '🔐 ENABLED' : '⚠️  DISABLED'}`,
    '=====================================================',
    '',
  ];

  // Use process.stdout.write for immediate output visibility
  process.stdout.write(logLines.join('\n'));

  if (mtlsEnabled) {
    return createMtlsCredentials();
  } else {
    console.log('ℹ️  mTLS disabled: Running in insecure mode (development only)');
    return grpc.credentials.createInsecure();
  }
};

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const edgeProto = grpc.loadPackageDefinition(packageDefinition) as any;

export class GrpcClient {
  private client: any;

  constructor(address: string = 'localhost:50051') {
    const credentials = getClientCredentials();
    this.client = new edgeProto.edge.EdgeService(address, credentials);
  }

  /**
   * Handle request via gRPC
   */
  async handleRequest(
    module: string,
    action: string,
    payload?: Record<string, any>,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = {
        module,
        action,
        payload: payload ? JSON.stringify(payload) : '{}',
      };

      this.client.handleRequest(request, (error: any, response: any) => {
        if (error) {
          reject(error);
        } else {
          // Parse the response
          const parsedResponse = {
            success: response.success,
            data: response.data ? JSON.parse(response.data) : null,
            error: response.error,
            timestamp: response.timestamp,
          };
          resolve(parsedResponse);
        }
      });
    });
  }

  /**
   * Health check via gRPC
   */
  async healthCheck(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.healthCheck({}, (error: any, response: any) => {
        if (error) {
          reject(error);
        } else {
          // Parse modules if they have details
          const modules = response.modules.map((m: any) => ({
            ...m,
            details: m.details ? JSON.parse(m.details) : null,
          }));
          resolve({
            healthy: response.healthy,
            modules,
            timestamp: response.timestamp,
          });
        }
      });
    });
  }
}

export default GrpcClient;
