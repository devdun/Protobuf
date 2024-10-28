import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';

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

function createUser(username: string) {
  client.createUser({ username }, (err: any, response: any) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('Create User Response:', response);
    }
  });
}

function deposit(username: string, amount: number) {
  client.deposit({ username, amount }, (err: any, response: any) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('Deposit Response:', response);
    }
  });
}

function getBalance(username: string) {
  client.getBalance({ username }, (err: any, response: any) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('Balance Response:', response);
    }
  });
}

// Example usage
createUser('testuser');
deposit('testuser', 50);
getBalance('testuser');
