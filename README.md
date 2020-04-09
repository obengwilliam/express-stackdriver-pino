# Overview
- Provides a number of express log utilities that are formatted to work on stackdriver using fastest the logger in nodejs :) [pino](https://github.com/pinojs/pino)


### Checklist 
-  [ ] Add correlation ids to global log or parent log
- [x] Logs should be in json
- [x] Do not log to file, log to stdout and stderr
- [x] Middleware to log on every request
- [x] Redact sensitive information
- [x] Middleware to log every error
- [x] Logs should be formatted for Stackdriver

### Installation
```
npm install express-stackdriver-pino 
```

### Usage
### Log every request middleware
logs requests is formatted to match  [google stack driver HttpRequest format](https://cloud.google.com/logging/docs/reference/v2/rpc/google.logging.type#google.logging.type.HttpRequest)

```
const express = require('express');
const expressLogger = require('express-stackdriver-pino');

const app = express();

const options = {
  serviceName: 'service-name',
}
const logger = expressLogger(options);
app.use(logger.reqResLogger())

```

### Log every error middleware
Log errors are formatted to match [Stackdriver](https://cloud.google.com/error-reporting/docs/formatting-error-messages)

```
const express = require('express');
const expressLogger = require('express-stackdriver-logger');

const app = express();
const options = {
  serviceName: 'service-name',
}

const logger = expressLogger(options)
app.use(logger.errorLogger())

```
The above also attaches a logger to req.log. This can be used in the controllers to log anything.

### Options
| param | description |
|-|-| 
| serviceName(required) | name of service |
| enabled | Enable service or not eg. true or false |
| destination | Destination for logs, it should be a WritableStream |

```
const express = require('express');
const expressLogger = require('express-stackdriver-logger');

const app = express();
const options = {
  serviceName: 'service-name',
}

const logger = expressLogger(options)
app.use(logger.errorLogger())

```
