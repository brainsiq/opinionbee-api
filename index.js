const callEndpoint = require('./lib/callEndpoint');
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

    const endpointOptions = {
      baseUri,
      apiKey: options.apiKey
    };

    /**
      @description Get companies from the Opinionbee API
      @returns {Promise<object[]>} Array of companies
    */
    this.companies = callEndpoint.bind(null, endpointOptions, 'companies');

    /**
      @description Get parties from the Opinionbee API
      @returns {Promise<object[]>} Array of parties
    */
    this.parties = callEndpoint.bind(null, endpointOptions, 'parties');

    /**
      @description Get types from the Opinionbee API
      @returns {Promise<object[]>} Array of types
    */
    this.types = callEndpoint.bind(null, endpointOptions, 'types');

    /**
      @description Get polls from the Opinionbee API
      @param [filters] object Filters to apply to the API call
      @param [filters.startDate] Date Return only polls from a date (ISO date format without a time)
      @param [filters.endDate] Date Return only polls older than a date (ISO date format without a time). Can be combined with startDate to get polls between two dates
      @param [filters.company] string Return only polls published by a specific company
      @param [filters.limit] number Return a limited number of polls (0 < limit < 500)
      @returns {Promise<object[]>} Array of companies
    */
    this.polls = require('./lib/polls').bind(null, endpointOptions);
  }
}

module.exports = ApiClient;
