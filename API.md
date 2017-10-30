<a name="ApiClient"></a>

## ApiClient
All functions return a Promise which either resolves with an array of data objects matching those returned when calling the API directly, or rejects with an Error with properties `httpStatusCode` and `httpResponseBody` if the Error represents a failed API call.

**Kind**: global class  

* [ApiClient](#ApiClient)
    * [new ApiClient(options, apiKey)](#new_ApiClient_new)
    * [.companies](#ApiClient+companies) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
    * [.parties](#ApiClient+parties) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
    * [.types](#ApiClient+types) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
    * [.polls](#ApiClient+polls) ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>

<a name="new_ApiClient_new"></a>

### new ApiClient(options, apiKey)
ApiClient for the Opinionbee API


| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Options for the API client |
| apiKey | <code>string</code> | An API key |

<a name="ApiClient+companies"></a>

### apiClient.companies ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
Get companies from the Opinionbee API

**Kind**: instance property of [<code>ApiClient</code>](#ApiClient)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - Array of companies  
<a name="ApiClient+parties"></a>

### apiClient.parties ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
Get parties from the Opinionbee API

**Kind**: instance property of [<code>ApiClient</code>](#ApiClient)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - Array of parties  
<a name="ApiClient+types"></a>

### apiClient.types ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
Get types from the Opinionbee API

**Kind**: instance property of [<code>ApiClient</code>](#ApiClient)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - Array of types  
<a name="ApiClient+polls"></a>

### apiClient.polls ⇒ <code>Promise.&lt;Array.&lt;object&gt;&gt;</code>
Get polls from the Opinionbee API

**Kind**: instance property of [<code>ApiClient</code>](#ApiClient)  
**Returns**: <code>Promise.&lt;Array.&lt;object&gt;&gt;</code> - Array of companies  

| Param | Description |
| --- | --- |
| [filters] | object Filters to apply to the API call |
| [filters.startDate] | Date Return only polls from a date (ISO date format without a time) |
| [filters.endDate] | Date Return only polls older than a date (ISO date format without a time). Can be combined with startDate to get polls between two dates |
| [filters.company] | string Return only polls published by a specific company |
| [filters.limit] | number Return a limited number of polls (0 < limit < 500) |
