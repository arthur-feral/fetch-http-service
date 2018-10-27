# fetch-http-service
---
This package provide a simple API to use fetch and send HTTP Queries.

### How to use it
First, install it
```javascript
yarn add fetch-http-service
```

Then import the lib whenever you want

```javascript
import {
  get,
  post,
  put,
  delete,
} from 'fetch-http-service';

const url = 'curl https://api.github.com/search/repositories';

get(
  url,
  {
    q: 'fetch-http-service',
    sort: 'star',
    order: 'desc'
  }
).then((response) => {
  // do something with the JSON response
})
```

### API
####GET/DELETE

| name           | type      | default | required | Description                                                                        |
|----------------|-----------|---------|----------|------------------------------------------------------------------------------------|
| url            | `string`  |         | yes      | The endpoint url                                                                   |
| queryParams    | `object`  | `{}`    | no       | The query params to add on the url                                                 |
| requestOptions | `object`  | `{}`    | no       | Some optional options you wanna use on the fetch request (see fetch documentation) |
| useCredentials | `boolean` | `false` | no       | Do you wanan send the cookies for the request?                                     |
| isCrossDomain  | `boolean` | `false` | no       | Is the request cross domain?                                                       |


####POST/PATCH/PUT

| name           | type      | default | required | Description                                                                        |
|----------------|-----------|---------|----------|------------------------------------------------------------------------------------|
| url            | `string`  |         | yes      | The endpoint url                                                                   |
| queryParams    | `object`  | `{}`    | no       | The query params to add on the url                                                 |
| body           | `object`  | `{}`    | no       | The body of the request to post                                                    |
| requestOptions | `object`  | `{}`    | no       | Some optional options you wanna use on the fetch request (see fetch documentation) |
| useCredentials | `boolean` | `false` | no       | Do you wanan send the cookies for the request?                                     |
| isCrossDomain  | `boolean` | `false` | no       | Is the request cross domain?                                                       |


### Notes
This is an early version. I know it needs some fixes and optimization but it works.
Please contribute if you found it useful! ❤️

```javascript
return 'enjoy';
```