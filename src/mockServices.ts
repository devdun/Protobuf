import * as sinon from 'sinon';

const mockCreateUser = sinon.stub();
const mockDeposit = sinon.stub();
const mockGetBalance = sinon.stub();

mockCreateUser.callsFake((call, callback) => {
  callback(null, { message: 'User created successfully' });
});

mockDeposit.callsFake((call, callback) => {
  if (call.request.username === 'testuser') {
    callback(null, { message: 'Deposit successful', balance: 150 });
  } else {
    callback(null, { message: 'User not found', balance: 0 });
  }
});

mockGetBalance.callsFake((call, callback) => {
  if (call.request.username === 'testuser') {
    callback(null, { balance: 150 });
  } else {
    callback(null, { balance: 0 });
  }
});

export { mockCreateUser, mockDeposit, mockGetBalance };
