const test = require('ava');
const nock = require('nock');
const ApiClient = require('../');

const apiKey = 'foo';
const client = new ApiClient({ apiKey });
const expectedTypes = [{
  id: 1,
  code: 'WESTVI',
  name: 'Westminster Voting Intention',
  country: 'GBR',
  canonical: 'westminster',
  menu: 'Westminster',
  short_name: 'Westminster VI',
  category: 1,
  hashtag: null,
  partylist: [
    'CON',
    'LAB',
    'LD',
    'GRN',
    'UKIP'
  ],
  complist: [],
  candidatelist: []
}, {
  id: 2,
  code: 'EUUK',
  name: 'European Parliament',
  country: 'GBR',
  canonical: 'european-parliament',
  menu: 'European Parliament',
  short_name: 'Euro Parl',
  category: 1,
  hashtag: '#EU19',
  partylist: [
    'UKIP',
    'CON',
    'LAB',
    'LD',
    'GRN'
  ],
  complist: [],
  candidatelist: []
}];

let apiStub = null;

test.beforeEach(() => {
  apiStub = nock('http://opinionbee.uk');
});

test.afterEach(() => {
  nock.cleanAll();
});

const getApiStub = () => nock('http://opinionbee.uk').get('/json/v1.0/types');
const stubApiCall = (status = 200, data = require('./fixtures/types.json')) => {
  getApiStub()
    .query({ key: apiKey })
    .reply(status, data);
};

test('ApiClient#types returns types from the API', async t => {
  stubApiCall();

  await client.types()
    .then(data => {
      t.true(apiStub.isDone(), 'Opinionbee API was called');
      t.deepEqual(data, expectedTypes);
    });
});

test('ApiClient#types returns errors from the API', async t => {
  const statusCode = 200;
  const response = {
    error: 'Missing or Invalid API Key',
    request_domain: 'opinionbee.uk'
  };

  stubApiCall(statusCode, response);

  await client.types()
    .then(() => t.fail('Api client call did not fail'))
    .catch(err => {
      t.truthy(err instanceof Error, 'Is an error object');
      t.is(err.message, 'Opinionbee API call failed');
      t.is(err.httpStatusCode, statusCode);
      t.deepEqual(err.httpResponseBody, response);
    });
});

test('ApiClient#types returns HTTP failed response as an error ', async t => {
  const statusCode = 500;
  const response = 'Oops';

  stubApiCall(statusCode, response);

  await client.types()
    .then(() => t.fail('Api client call did not fail'))
    .catch(err => {
      t.truthy(err instanceof Error, 'Is an error object');
      t.is(err.message, 'Opinionbee API call failed');
      t.is(err.httpStatusCode, statusCode);
      t.is(err.httpResponseBody, response);
    });
});

test('ApiClient#types returns errors from the HTTP call', async t => {
  const error = new Error('Oops');

  getApiStub().replyWithError(error);

  await client.types()
    .then(() => t.fail('Api client call did not fail'))
    .catch(err => {
      t.truthy(err instanceof Error, 'Is an error object');
      t.is(err.message, err.message);
    });
});
