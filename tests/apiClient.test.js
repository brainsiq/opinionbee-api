const test = require('ava');
const ApiClient = require('../');

test('ApiClient throws an error if constructed without options', t => {
  const error = t.throws(() => new ApiClient());

  t.is(error.message, 'Opinionbee API key must be provided as options.apiKey');
});

test('ApiClient throws an error if constructed without an API key', t => {
  const error = t.throws(() => new ApiClient({}));

  t.is(error.message, 'Opinionbee API key must be provided as options.apiKey');
});

test('ApiClient throws an error if constructed with an API key that is not a string', t => {
  const error = t.throws(() => new ApiClient({ apiKey: true }));

  t.is(error.message, 'options.apiKey must be a string (length >= 1)');
});

test('ApiClient throws an error if constructed with an API key that is an empty string', t => {
  const error = t.throws(() => new ApiClient({ apiKey: '' }));

  t.is(error.message, 'options.apiKey must be a string (length >= 1)');
});
