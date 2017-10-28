const test = require('ava');
const nock = require('nock');
const helpers = require('./helpers');
const partiesFixture = require('./fixtures/parties');
const ApiClient = require('../');

const client = new ApiClient({ apiKey: helpers.apiKey });
const stubApiCall = helpers.stubApiCall.bind(null, 'parties');
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

test.afterEach(() => {
  nock.cleanAll();
});

test('ApiClient#parties returns parties from the API', async t => {
  const apiStub = stubApiCall(partiesFixture);

  await client.parties()
    .then(data => {
      t.true(apiStub.isDone(), 'Opinionbee API was called');
      t.deepEqual(data, expectedParties);
    });
});

test('ApiClient#parties returns errors from the API', async t => {
  const response = {
    error: 'Missing or Invalid API Key',
    request_domain: 'opinionbee.uk'
  };

  stubApiCall(response);

  await client.parties()
    .then(() => t.fail('Api client call did not fail'))
    .catch(err => {
      t.truthy(err instanceof Error, 'Is an error object');
      t.is(err.message, 'Opinionbee API call failed');
      t.is(err.httpStatusCode, 200);
      t.deepEqual(err.httpResponseBody, response);
    });
});

test('ApiClient#parties returns HTTP failed response as an error ', async t => {
  const statusCode = 500;
  const response = 'Oops';

  stubApiCall(response, statusCode);

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

  helpers.getApiStub('parties')
    .replyWithError(error);

  await client.parties()
    .then(() => t.fail('Api client call did not fail'))
    .catch(err => {
      t.truthy(err instanceof Error, 'Is an error object');
      t.is(err.message, err.message);
    });
});
