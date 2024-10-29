import * as sinon from 'sinon';

const mockCreateUser = sinon.stub();
const mockDeposit = sinon.stub();
const mockGetBalance = sinon.stub();

let userBalance = 0;

mockCreateUser.callsFake((call, callback) => {
  if (call.request.username === 'testuser') {
    userBalance = 100; // Initial balance for testuser
    callback(null, { message: 'User created successfully' });
  } else {
    callback(null, { message: 'User already exists' });
  }
});

mockDeposit.callsFake((call, callback) => {
  if (call.request.username === 'testuser') {
    userBalance += call.request.amount;
    callback(null, { message: 'Deposit successful', balance: userBalance });
  } else {
    callback(null, { message: 'User not found', balance: 0 });
  }
});

mockGetBalance.callsFake((call, callback) => {
  if (call.request.username === 'testuser') {
    callback(null, { balance: userBalance });
  } else {
    callback(null, { balance: 0 });
  }
});

export { mockCreateUser, mockDeposit, mockGetBalance };
