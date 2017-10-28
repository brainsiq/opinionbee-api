const test = require('ava');
const nock = require('nock');
const ApiClient = require('../');

const apiKey = 'foo';
const client = new ApiClient({ apiKey });
const expectedParties = [{
  name: 'Conservative',
  colour: '0087DC',
  code: 'CON',
  textcolor: 'f3f3f3'
}, {
  name: 'Labour',
  colour: 'DC241F',
  code: 'LAB',
  textcolor: 'f3f3f3'
}, {
  name: 'Liberal Democrats',
  colour: 'FDBB30',
  code: 'LD',
  textcolor: '191919'
}];

let apiStub = null;

test.beforeEach(() => {
  apiStub = nock('http://opinionbee.uk');
});

test.afterEach(() => {
  nock.cleanAll();
});

const getApiStub = () => nock('http://opinionbee.uk').get('/json/v1.0/parties');
const stubApiCall = (status = 200, data = require('./fixtures/parties.json')) => {
  getApiStub()
    .query({ key: apiKey })
    .reply(status, data);
};

test('ApiClient#parties returns parties from the API', async t => {
  stubApiCall();

  await client.parties()
    .then(data => {
      t.true(apiStub.isDone(), 'Opinionbee API was called');
      t.deepEqual(data, expectedParties);
    });
});

test('ApiClient#parties returns errors from the API', async t => {
  const statusCode = 200;
  const response = {
    error: 'Missing or Invalid API Key',
    request_domain: 'opinionbee.uk'
  };

  stubApiCall(statusCode, response);

  await client.parties()
    .then(() => t.fail('Api client call did not fail'))
    .catch(err => {
      t.truthy(err instanceof Error, 'Is an error object');
      t.is(err.message, 'Opinionbee API call failed');
      t.is(err.httpStatusCode, statusCode);
      t.deepEqual(err.httpResponseBody, response);
    });
});

test('ApiClient#parties returns HTTP failed response as an error ', async t => {
  const statusCode = 500;
  const response = 'Oops';

  stubApiCall(statusCode, response);

  await client.parties()
    .then(() => t.fail('Api client call did not fail'))
    .catch(err => {
      t.truthy(err instanceof Error, 'Is an error object');
      t.is(err.message, 'Opinionbee API call failed');
      t.is(err.httpStatusCode, statusCode);
      t.is(err.httpResponseBody, response);
    });
});

test('ApiClient#parties returns errors from the HTTP call', async t => {
  const error = new Error('Oops');

  getApiStub().replyWithError(error);

  await client.parties()
    .then(() => t.fail('Api client call did not fail'))
    .catch(err => {
      t.truthy(err instanceof Error, 'Is an error object');
      t.is(err.message, err.message);
    });
});
