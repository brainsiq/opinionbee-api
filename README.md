# opinionbee-api

[![CircleCI](https://circleci.com/gh/brainsiq/opinionbee-api/tree/master.svg?style=svg&circle-token=010bc8270831fcda503790ca7075512c712b8b73)](https://circleci.com/gh/brainsiq/opinionbee-api/tree/master)

A Node.js client library for the [Opinionbee API](http://opinionbee.uk/api). Tested against Node.js versions 6, 7 and 8.

### Installation

`npm install opinionbee-api`

### Usage

```
const ApiClient = require('opinionbee-api');
const apiClient = new ApiClient({ apiKey: 'your-api-key' });

apiClient.polls()
  .then(polls => console.log(polls))
  .catch(console.error);
```

See [API documentation](API.md) for more details.
