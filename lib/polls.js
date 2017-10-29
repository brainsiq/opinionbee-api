const http = require('http');
const querystring = require('querystring');
const joi = require('joi');

const ApiError = require('./ApiError');

const filtersSchema = {
  startDate: joi.string().isoDate(),
  endDate: joi.string().isoDate(),
  company: joi.string().min(1),
  limit: joi.number().integer().min(1).max(500)
};

const extractDateFromISOString = date => date ? date.substring(0, 10) : null;

const buildFilterObject = filters => {
  if (!filters) {
    return {};
  }

  const query = {
    start_date: extractDateFromISOString(filters.startDate),
    end_date: extractDateFromISOString(filters.endDate),
    company: filters.company,
    limit: filters.limit
  };

  // Remove undefined values
  return Object.keys(query).reduce((filterObject, property) => {
    if (query[property]) {
      filterObject[property] = query[property];
    }

    return filterObject;
  }, {});
};

module.exports = (apiOptions, filters) => {
  if (filters) {
    const validation = joi.validate(filters, filtersSchema);

    if (validation.error) {
      return Promise.reject(validation.error);
    }
  }

  const { baseUri, apiKey } = apiOptions;
  const filterObject = buildFilterObject(filters);
  const query = querystring.stringify(Object.assign({}, filterObject, { key: apiKey }));

  return new Promise((resolve, reject) => {
    const uri = `${baseUri}/polls?${query}`;

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

        resolve(responseData);
      });
    }).on('error', reject);
  });
};
