const callEndpoint = require('./lib/callEndpoint');
const baseUri = 'http://opinionbee.uk/json/v1.0';

class ApiClient {
  constructor (options) {
    if (!(options && typeof options.apiKey !== 'undefined')) {
      throw new Error('Opinionbee API key must be provided as options.apiKey');
    }

    if (!(typeof options.apiKey === 'string' && options.apiKey.length > 0)) {
      throw new Error('options.apiKey must be a string (length >= 1)');
    }

    const endpointOptions = {
      baseUri,
      apiKey: options.apiKey
    };

    this.companies = callEndpoint.bind(null, endpointOptions, 'companies');
    this.parties = callEndpoint.bind(null, endpointOptions, 'parties');
    this.types = callEndpoint.bind(null, endpointOptions, 'types');
    this.polls = require('./lib/polls').bind(null, endpointOptions);
  }
}

module.exports = ApiClient;
