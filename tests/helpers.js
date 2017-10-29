const nock = require('nock');

const apiKey = 'foo';
const getApiStub = endpoint => nock('http://opinionbee.uk').get(`/json/v1.0/${endpoint}`);
const stubApiCall = (endpoint, data = null, status = 200, query = true) => {
  const queryString = Object.assign({ key: apiKey }, query);

  return getApiStub(endpoint)
    .query(queryString)
    .reply(status, data);
};

module.exports = {
  apiKey,
  getApiStub,
  stubApiCall
};
