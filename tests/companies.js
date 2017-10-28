const test = require('ava');
const nock = require('nock');
const ApiClient = require('../');

const apiKey = 'foo';
const client = new ApiClient({ apiKey });
const expectedCompanies = [{
  code: 'YG',
  name: 'YouGov',
  canonical: 'yougov'
}, {
  code: 'OP',
  name: 'Opinium',
  canonical: 'opinium'
}, {
  code: 'IPSOS',
  name: 'Ipsos MORI',
  canonical: 'ipsos-mori'
}];

let apiStub = null;

test.beforeEach(() => {
  apiStub = nock('http://opinionbee.uk');
});

test.afterEach(() => {
  nock.cleanAll();
});

const getApiStub = () => nock('http://opinionbee.uk').get('/json/v1.0/companies');
const stubApiCall = (status = 200, data = require('./fixtures/companies.json')) => {
  getApiStub()
    .query({ key: apiKey })
    .reply(status, data);
};

test('ApiClient#companies returns companies from the API', async t => {
  stubApiCall();

  await client.companies()
    .then(data => {
      t.true(apiStub.isDone(), 'Opinionbee API was called');
      t.deepEqual(data, expectedCompanies);
    });
});

test('ApiClient#companies returns errors from the API', async t => {
  const statusCode = 200;
  const response = {
    error: 'Missing or Invalid API Key',
    request_domain: 'opinionbee.uk'
  };

  stubApiCall(statusCode, response);

  await client.companies()
    .then(() => t.fail('Api client call did not fail'))
    .catch(err => {
      t.truthy(err instanceof Error, 'Is an error object');
      t.is(err.message, 'Opinionbee API call failed');
      t.is(err.httpStatusCode, statusCode);
      t.deepEqual(err.httpResponseBody, response);
    });
});

test('ApiClient#companies returns HTTP failed response as an error ', async t => {
  const statusCode = 500;
  const response = 'Oops';

  stubApiCall(statusCode, response);

  await client.companies()
    .then(() => t.fail('Api client call did not fail'))
    .catch(err => {
      t.truthy(err instanceof Error, 'Is an error object');
      t.is(err.message, 'Opinionbee API call failed');
      t.is(err.httpStatusCode, statusCode);
      t.is(err.httpResponseBody, response);
    });
});

test('ApiClient#companies returns errors from the HTTP call', async t => {
  const error = new Error('Oops');

  getApiStub().replyWithError(error);

  await client.companies()
    .then(() => t.fail('Api client call did not fail'))
    .catch(err => {
      t.truthy(err instanceof Error, 'Is an error object');
      t.is(err.message, err.message);
    });
});
