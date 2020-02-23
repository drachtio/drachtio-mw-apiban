# drachtio-mw-apiban

drachtio middleware that uses [APIBAN](https://apiban.org/) from [LOD] to reject incoming requests from known spammers.

## Usage

```
const apiban = require('drachtio-mw-apiban')({apikey: 'xxx'});
const srf = require('drachtio-srf');

srf.use(apiban);
srf.invite((req, res) => {..});
```

The middleware returns a function that is executed with your api key.  By default, calls from a source address that matches a banned IP are rejected with a 403.  This can be changed by passing an optional desired status code as shown below.
```
const apiban = require('drachtio-mw-apiban')({apikey: 'xxx', statusCode: 603});
```


