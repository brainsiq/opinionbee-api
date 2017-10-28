class ApiClient {
  constructor ({ apiKey }) {
    const options = {
      baseUri: 'http://opinionbee.uk/json/v1.0',
      apiKey
    };

    this.companies = require('./lib/companies').bind(null, options);
    this.parties = require('./lib/parties').bind(null, options);
  }
}

module.exports = ApiClient;
