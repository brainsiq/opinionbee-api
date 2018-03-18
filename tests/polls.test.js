const test = require('ava');
const nock = require('nock');
const helpers = require('./helpers');
const pollsFixture = require('./fixtures/polls');
const ApiClient = require('../');

const client = new ApiClient({ apiKey: helpers.apiKey });
const stubApiCall = helpers.stubApiCall.bind(null, 'polls');

test.afterEach(() => {
  nock.cleanAll();
});

test('ApiClient#polls returns all polls from the API', async t => {
  const apiStub = stubApiCall(pollsFixture);

  await client.polls()
    .then(data => {
      t.true(apiStub.isDone(), 'Opinionbee API was called');
      t.deepEqual(data, pollsFixture);
    });
});

test('ApiClient#polls returns filtered polls from the API', async t => {
  const startDate = '2017-04-01';
  const endDate = '2017-05-01';
  const company = 'YG';
  const limit = 15;
  const filteredPolls = pollsFixture.slice(1);

  const apiStub = stubApiCall(filteredPolls, 200, {
    start_date: startDate,
    end_date: endDate,
    company,
    limit
  });

  await client.polls({ startDate, endDate, company, limit })
    .then(data => {
      t.true(apiStub.isDone(), 'Opinionbee API was called');
      t.deepEqual(data, filteredPolls);
    });
});

test('ApiClient#polls ignores the time part of startDate and endDate', async t => {
  const apiStub = stubApiCall(pollsFixture, 200, {
    start_date: '2017-04-01',
    end_date: '2017-05-01'
  });

  await client.polls({
    startDate: '2017-04-01T12:00:00.000Z',
    endDate: '2017-05-01T12:00:00.000Z'
  })
    .then(data => {
      t.true(apiStub.isDone(), 'Opinionbee API was called');
    });
});

test('ApiClient#polls omits missing filters from the request', async t => {
  const company = 'YG';
  const limit = 15;
  const { apiKey, getApiStub } = helpers;

  const apiStub = getApiStub('polls')
    .query({ key: apiKey, limit, company })
    .reply(200, pollsFixture);

  await client.polls({ company, limit })
    .then((data) => {
      t.true(apiStub.isDone(), 'Opinionbee API was called');
    });
});

test('ApiClient#polls optionally filters by poll type', async t => {
  const company = 'YG';
  const limit = 15;
  const pollType = 'WESTVI';
  const { apiKey, getApiStub } = helpers;

  const apiStub = getApiStub('polls')
    .query({ key: apiKey, code: pollType, limit, company })
    .reply(200, pollsFixture);

  await client.polls({ company, limit, pollType })
    .then((data) => {
      t.true(apiStub.isDone(), 'Opinionbee API was called');
    });
});

test('ApiClient#polls rejects calls with unsupported filters', async t => {
  await client.polls({ foo: 'bar' })
    .then((data) => t.fail('Call failed'))
    .catch(err => {
      t.truthy(err instanceof Error, 'Is an error object');
      t.is(err.message, '"foo" is not allowed');
    });
});

test('ApiClient#polls rejects calls with an invalid startDate', async t => {
  await client.polls({ startDate: 'foo' })
    .then((data) => t.fail('Call failed'))
    .catch(err => {
      t.truthy(err instanceof Error, 'Is an error object');
      t.regex(err.message, /"startDate" fails/);
    });
});

test('ApiClient#polls rejects calls with an invalid endDate', async t => {
  await client.polls({ endDate: 'foo' })
    .then((data) => t.fail('Call failed'))
    .catch(err => {
      t.truthy(err instanceof Error, 'Is an error object');
      t.regex(err.message, /"endDate" fails/);
    });
});

test('ApiClient#polls rejects calls with an invalid company', async t => {
  await client.polls({ company: true })
    .then((data) => t.fail('Call failed'))
    .catch(err => {
      t.truthy(err instanceof Error, 'Is an error object');
      t.regex(err.message, /"company" fails/);
    });
});

test('ApiClient#polls rejects calls with a limit above 500', async t => {
  await client.polls({ limit: 501 })
    .then((data) => t.fail('Call failed'))
    .catch(err => {
      t.truthy(err instanceof Error, 'Is an error object');
      t.regex(err.message, /"limit" must be less than or equal to 500/);
    });
});

test('ApiClient#polls rejects calls with a limit below 1', async t => {
  await client.polls({ limit: 0 })
    .then((data) => t.fail('Call failed'))
    .catch(err => {
      t.truthy(err instanceof Error, 'Is an error object');
      t.regex(err.message, /"limit" must be larger than or equal to 1/);
    });
});

test('ApiClient#polls rejects calls with an invalid pollType', async t => {
  await client.polls({ pollType: true })
    .then((data) => t.fail('Call failed'))
    .catch(err => {
      t.truthy(err instanceof Error, 'Is an error object');
      t.regex(err.message, /"pollType" must be a string/);
    });
});

test('ApiClient#polls returns errors from the API', async t => {
  const response = {
    error: 'Missing or Invalid API Key',
    request_domain: 'opinionbee.uk'
  };

  stubApiCall(response);

  await client.polls()
    .then(() => t.fail('Api client call did not fail'))
    .catch(err => {
      t.truthy(err instanceof Error, 'Is an error object');
      t.is(err.message, 'Opinionbee API call failed');
      t.is(err.httpStatusCode, 200);
      t.deepEqual(err.httpResponseBody, response);
    });
});

test('ApiClient#polls returns HTTP failed response as an error ', async t => {
  const statusCode = 500;
  const response = 'Oops';

  stubApiCall(response, statusCode);

  await client.polls()
    .then(() => t.fail('Api client call did not fail'))
    .catch(err => {
      t.truthy(err instanceof Error, 'Is an error object');
      t.is(err.message, 'Opinionbee API call failed');
      t.is(err.httpStatusCode, statusCode);
      t.is(err.httpResponseBody, response);
    });
});

test('ApiClient#polls returns errors from the HTTP call', async t => {
  const error = new Error('Oops');

  helpers.getApiStub('polls')
    .replyWithError(error);

  await client.polls()
    .then(() => t.fail('Api client call did not fail'))
    .catch(err => {
      t.truthy(err instanceof Error, 'Is an error object');
      t.is(err.message, err.message);
    });
});
