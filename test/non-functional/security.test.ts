import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';

const PROTO_PATH = path.join(__dirname, '../../proto/banking.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const bankingProto: any = grpc.loadPackageDefinition(packageDefinition).exbanking;
const unauthorizedClient = new bankingProto.BankingService('127.0.0.1:50051', grpc.credentials.createInsecure());

jest.setTimeout(20000); // Set timeout to 20 seconds for the test

describe('Banking Service - Security Test', () => {
  it('should reject unauthorized deposit attempt', (done) => {
    unauthorizedClient.deposit({ username: 'unknownUser', amount: 100 }, (err: any, response: any) => {
      expect(err).not.toBeNull();
      expect(err.code).toBe(grpc.status.UNAUTHENTICATED);
      done();
    });
  });
});
