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

const client = new bankingProto.BankingService(
  '127.0.0.1:50051',
  grpc.credentials.createInsecure()
);

jest.setTimeout(30000); // Adjust timeout to handle network delays if needed

describe('Banking Service', () => {
  beforeAll((done) => {
    client.createUser({ username: 'testuser' }, (err: any, response: any) => {
      if (err) {
        console.error('Error in createUser:', err);
      }
      done();
    });
  });

  it('should deposit money for an existing user', (done) => {
    client.deposit({ username: 'testuser', amount: 50 }, (err: any, response: any) => {
      expect(response.message).toBe('Deposit successful');
      expect(response.balance).toBe(50); // Assuming initial balance is 0
      done();
    });
  });

  it('should return the updated balance after a deposit', (done) => {
    client.getBalance({ username: 'testuser' }, (err: any, response: any) => {
      expect(response.balance).toBe(50); // Reflects the balance after the deposit
      done();
    });
  });

  it('should return an error when depositing for a non-existent user', (done) => {
    client.deposit({ username: 'nonexistentuser', amount: 50 }, (err: any, response: any) => {
      expect(response.message).toBe('User not found');
      expect(response.balance).toBe(0);
      done();
    });
  });

  it('should return a balance of 0 for a non-existent user', (done) => {
    client.getBalance({ username: 'nonexistentuser' }, (err: any, response: any) => {
      expect(response.balance).toBe(0);
      done();
    });
  });
});
