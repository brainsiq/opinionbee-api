const test = require('ava');
const nock = require('nock');
const helpers = require('./helpers');
const companiesFixture = require('./fixtures/companies');
const ApiClient = require('../');

const client = new ApiClient({ apiKey: helpers.apiKey });
const stubApiCall = helpers.stubApiCall.bind(null, 'companies');
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

test.afterEach(() => {
  nock.cleanAll();
});

test('ApiClient#companies returns companies from the API', async t => {
  const apiStub = stubApiCall(companiesFixture);

  await client.companies()
    .then(data => {
      t.true(apiStub.isDone(), 'Opinionbee API was called');
      t.deepEqual(data, expectedCompanies);
    });
});

test('ApiClient#companies returns errors from the API', async t => {
  const response = {
    error: 'Missing or Invalid API Key',
    request_domain: 'opinionbee.uk'
  };

  stubApiCall(response);

  await client.companies()
    .then(() => t.fail('Api client call did not fail'))
    .catch(err => {
      t.truthy(err instanceof Error, 'Is an error object');
      t.is(err.message, 'Opinionbee API call failed');
      t.is(err.httpStatusCode, 200);
      t.deepEqual(err.httpResponseBody, response);
    });
});

test('ApiClient#companies returns HTTP failed response as an error ', async t => {
  const statusCode = 500;
  const response = 'Oops';

  stubApiCall(response, 500);

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

  helpers.getApiStub('companies')
    .replyWithError(error);

  await client.companies()
    .then(() => t.fail('Api client call did not fail'))
    .catch(err => {
      t.truthy(err instanceof Error, 'Is an error object');
      t.is(err.message, err.message);
    });
});
