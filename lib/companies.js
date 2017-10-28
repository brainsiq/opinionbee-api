const http = require('http');
const ApiError = require('./ApiError');

module.exports = ({ baseUri, apiKey }) =>
  new Promise((resolve, reject) => {
    const uri = `${baseUri}/companies?key=${apiKey}`;

    http.get(uri, response => {
      let data = '';

      response.on('data', chunk => {
        data += chunk;
      });

      response.on('end', () => {
        if (response.statusCode !== 200) {
          return reject(new ApiError(response.statusCode, data));
        }

        const responseData = JSON.parse(data);

        if (responseData.error) {
          return reject(new ApiError(response.statusCode, responseData));
        }

        const companies = Object.keys(responseData).map(key => responseData[key]);

        resolve(companies);
      });
    }).on('error', reject);
  });
