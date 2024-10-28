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

const users: Record<string, number> = {};

function createUser(call: any, callback: any) {
  const { username } = call.request;
  if (users[username]) {
    callback(null, { message: 'User already exists' });
  } else {
    users[username] = 0;
    callback(null, { message: 'User created successfully' });
  }
}

function deposit(call: any, callback: any) {
  const { username, amount } = call.request;
  if (!users[username]) {
    callback(null, { message: 'User not found', balance: 0 });
  } else {
    users[username] += amount;
    callback(null, { message: 'Deposit successful', balance: users[username] });
  }
}

function getBalance(call: any, callback: any) {
  const { username } = call.request;
  if (!users[username]) {
    callback(null, { balance: 0 });
  } else {
    callback(null, { balance: users[username] });
  }
}

function main() {
  const server = new grpc.Server();
  server.addService(bankingProto.BankingService.service, {
    createUser,
    deposit,
    getBalance,
  });
  server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Server running at http://127.0.0.1:50051');
    server.start();
  });
}

main();
