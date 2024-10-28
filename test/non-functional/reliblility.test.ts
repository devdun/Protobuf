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

jest.setTimeout(300000); // Set timeout to 5 minutes for the reliability test

describe('Banking Service - Reliability Test', () => {
  it('should handle continuous requests for 5 minutes without crashing', (done) => {
    const endTime = Date.now() + 5 * 60 * 1000; // 5 minutes from now

    function sendRequest() {
      if (Date.now() >= endTime) {
        done();
      } else {
        client.deposit({ username: 'reliabilityUser', amount: 1 }, (err: any) => {
          if (err) {
            done(err);
          } else {
            sendRequest();
          }
        });
      }
    }

    client.createUser({ username: 'reliabilityUser' }, (err: any) => {
      if (err) {
        done(err);
      } else {
        sendRequest();
      }
    });
  });
});
