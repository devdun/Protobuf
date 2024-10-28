import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';
import { mockCreateUser, mockDeposit, mockGetBalance } from '../src/mockServices';
import * as sinon from 'sinon';

const PROTO_PATH = path.join(__dirname, '../proto/banking.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const bankingProto: any = grpc.loadPackageDefinition(packageDefinition).exbanking;

const client = new bankingProto.BankingService('127.0.0.1:50051', grpc.credentials.createInsecure());

jest.setTimeout(20000); // Increase the default timeout to handle potential network delay

describe('Banking Service', () => {
  beforeEach(() => {
    // Replace actual client methods with mocks
    sinon.replace(client, 'createUser', mockCreateUser);
    sinon.replace(client, 'deposit', mockDeposit);
    sinon.replace(client, 'getBalance', mockGetBalance);
  });

  afterEach(() => {
    // Restore original methods after tests
    sinon.restore();
  });

  it('should create a user', (done) => {
    client.createUser({ username: 'newuser' }, (err: any, response: any) => {
      expect(response.message).toBe('User created successfully');
      done();
    });
  });

  it('should deposit money', (done) => {
    mockCreateUser.callsFake((call, callback) => {
      callback(null, { message: 'User created successfully' });
    });

    mockDeposit.callsFake((call, callback) => {
      if (call && call.request && call.request.username === 'testuser') {
        callback(null, { message: 'Deposit successful', balance: 150 });
      } else {
        callback(null, { message: 'User not found', balance: 0 });
      }
    });

    client.createUser({ username: 'testuser' }, (err: any) => {
      if (!err) {
        client.deposit({ username: 'testuser', amount: 50 }, (err: any, response: any) => {
          expect(response.message).toBe('Deposit successful');
          expect(response.balance).toBe(150);
          done();
        });
      } else {
        done(err);
      }
    });
  });

  it('should get balance', (done) => {
    mockCreateUser.callsFake((call, callback) => {
      callback(null, { message: 'User created successfully' });
    });

    mockGetBalance.callsFake((call, callback) => {
      if (call && call.request && call.request.username === 'testuser') {
        callback(null, { balance: 150 });
      } else {
        callback(null, { balance: 0 });
      }
    });

    client.createUser({ username: 'testuser' }, (err: any) => {
      if (!err) {
        client.getBalance({ username: 'testuser' }, (err: any, response: any) => {
          expect(response.balance).toBe(150);
          done();
        });
      } else {
        done(err);
      }
    });
  });
});
