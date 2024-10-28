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
const client = new bankingProto.BankingService('127.0.0.1:50051', grpc.credentials.createInsecure());

jest.setTimeout(60000); // Set timeout to 1 minute for the test

describe('Banking Service - Performance Test', () => {
  it('should handle 1000 concurrent requests successfully', (done) => {
    const totalRequests = 1000;
    let completedRequests = 0;

    for (let i = 0; i < totalRequests; i++) {
      client.createUser({ username: `user${i}` }, (err: any) => {
        if (!err) {
          completedRequests++;
          if (completedRequests === totalRequests) {
            done();
          }
        } else {
          done(err);
        }
      });
    }
  });
});
