const callEndpoint = require('./lib/callEndpoint');
const polls = require('./lib/polls');
const baseUri = 'http://opinionbee.uk/json/v1.0';

/**
  All functions return a Promise which resolves with an array of data objects matching those returned when calling the API directly, or
  reject with an Error with properties `httpStatusCode` and `httpResponseBody` if they represent failed API calls.
  @description ApiClient for the Opinionbee API
*/
class ApiClient {
  /**
    @description Create an API client
    @param options {object} Options for the API client
    @param apiKey {string} An API key
  */
  constructor (options) {
    if (!(options && typeof options.apiKey !== 'undefined')) {
      throw new Error('Opinionbee API key must be provided as options.apiKey');
    }

    if (!(typeof options.apiKey === 'string' && options.apiKey.length > 0)) {
      throw new Error('options.apiKey must be a string (length >= 1)');
    }

    this.endpointOptions = {
      baseUri,
      apiKey: options.apiKey
    };
  }

  /**
    @description Get companies from the Opinionbee API
    @returns {Promise<object[]>} Array of companies
  */
  companies () {
    return callEndpoint(this.endpointOptions, 'companies');
  }

  /**
    @description Get parties from the Opinionbee API
    @returns {Promise<object[]>} Array of parties
  */
  parties () {
    return callEndpoint(this.endpointOptions, 'parties');
  }

  /**
    @description Get types from the Opinionbee API
    @returns {Promise<object[]>} Array of types
  */
  types () {
    return callEndpoint(this.endpointOptions, 'types');
  }

  /**
    @description Get polls from the Opinionbee API
    @param {object} [filters] Optional filters to apply to the API call
    @param {Date} [filters.startDate] Return only polls from a date (ISO date format without a time)
    @param {Date} [filters.endDate] Return only polls older than a date (ISO date format without a time). Can be combined with startDate to get polls between two dates
    @param {string} [filters.company] Return only polls published by a specific company
    @param {number} [filters.limit] Return a limited number of polls (0 < limit < 500)
    @param {string} [filters.pollType] Return only polls of the given type
    @returns {Promise<object[]>} Array of companies
  */
  polls (filters) {
    return polls(this.endpointOptions, filters);
  }
}

module.exports = ApiClient;
