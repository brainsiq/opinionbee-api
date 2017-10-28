const test = require('ava');
const nock = require('nock');
const helpers = require('./helpers');
const typesFixture = require('./fixtures/types');
const ApiClient = require('../');

const client = new ApiClient({ apiKey: helpers.apiKey });
const stubApiCall = helpers.stubApiCall.bind(null, 'types');
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

test.afterEach(() => {
  nock.cleanAll();
});

test('ApiClient#types returns types from the API', async t => {
  const apiStub = stubApiCall(typesFixture);

  await client.types()
    .then(data => {
      t.true(apiStub.isDone(), 'Opinionbee API was called');
      t.deepEqual(data, expectedTypes);
    });
});

test('ApiClient#types returns errors from the API', async t => {
  const response = {
    error: 'Missing or Invalid API Key',
    request_domain: 'opinionbee.uk'
  };

  stubApiCall(response);

  await client.types()
    .then(() => t.fail('Api client call did not fail'))
    .catch(err => {
      t.truthy(err instanceof Error, 'Is an error object');
      t.is(err.message, 'Opinionbee API call failed');
      t.is(err.httpStatusCode, 200);
      t.deepEqual(err.httpResponseBody, response);
    });
});

test('ApiClient#types returns HTTP failed response as an error ', async t => {
  const statusCode = 500;
  const response = 'Oops';

  stubApiCall(response, statusCode);

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

  helpers.getApiStub('types')
    .replyWithError(error);

  await client.types()
    .then(() => t.fail('Api client call did not fail'))
    .catch(err => {
      t.truthy(err instanceof Error, 'Is an error object');
      t.is(err.message, err.message);
    });
});
