class ApiError extends Error {
  constructor (statusCode, responseBody, ...args) {
    super('Opinionbee API call failed');

    this.httpStatusCode = statusCode;
    this.httpResponseBody = responseBody;
  }
}

module.exports = ApiError;
