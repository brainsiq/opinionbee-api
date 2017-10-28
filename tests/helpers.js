const nock = require('nock');

const apiKey = 'foo';
const getApiStub = endpoint => nock('http://opinionbee.uk').get(`/json/v1.0/${endpoint}`);
const stubApiCall = (endpoint, data = null, status = 200) => {
  return getApiStub(endpoint)
    .query({ key: apiKey })
    .reply(status, data);
};

module.exports = {
  apiKey,
  getApiStub,
  stubApiCall
};
