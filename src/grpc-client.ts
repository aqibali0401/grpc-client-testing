import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { join } from 'path';

// Load proto definition - path from dist folder
// dist/grpc-client.js -> .. -> grpc-client -> .. -> mithun-package -> edge-microservice/proto/edge.proto
const PROTO_PATH = join(__dirname, '../../edge-microservice/proto/edge.proto');

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
    this.client = new edgeProto.edge.EdgeService(
      address,
      grpc.credentials.createInsecure(),
    );
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
