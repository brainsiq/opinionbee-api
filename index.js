const callEndpoint = require('./lib/callEndpoint');

class ApiClient {
  constructor ({ apiKey }) {
    const options = {
      baseUri: 'http://opinionbee.uk/json/v1.0',
      apiKey
    };

    this.companies = callEndpoint.bind(null, options, 'companies');
    this.parties = callEndpoint.bind(null, options, 'parties');
    this.types = callEndpoint.bind(null, options, 'types');
    this.polls = require('./lib/polls').bind(null, options);
  }
}

module.exports = ApiClient;
