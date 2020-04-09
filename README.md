[![version][version-badge]][package]
[![downloads][downloads-badge]][npm-stat]
[![MIT License][license-badge]][license]
[![Examples][examples-badge]][examples]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

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


[version-badge]: https://img.shields.io/npm/v/express-stackdriver-pino.svg?style=flat-square
[package]: https://www.npmjs.com/package/express-stackdriver-logger
[downloads-badge]: https://img.shields.io/npm/dm/express-stackdriver-logger.svg?style=flat-square
[npm-stat]: http://npm-stat.com/charts.html?package=express-stackdriver-pino&from=2016-04-01
[license-badge]: https://img.shields.io/npm/l/express-stackdriver-pino.svg?style=flat-square
[license]: https://github.com/obengwilliam/express-stackdriver-pino/blob/master/other/LICENSE
[examples-badge]: https://img.shields.io/badge/%F0%9F%92%A1-examples-8C8E93.svg?style=flat-square
[examples]: https://github.com/obengwilliam/express-stackdriver-pino/blob/master/examples/EXAMPLES.md
[github-watch-badge]: https://img.shields.io/github/watchers/obengwilliam/express-stackdriver-pino.svg?style=social
[github-watch]: https://github.com/obengwilliam/express-stackdriver-pino/watchers
[github-star-badge]: https://img.shields.io/github/stars/obengwilliam/express-stackdriver-pino
[github-star]: https://github.com/obengwilliam/express-stackdriver-pino/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20express-stackdriver-pino!%20https://github.com/obengwilliam/expresss-stackdriver-pino%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/obengwilliam/express-stackdriver-pino.svg?style=social
