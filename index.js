
const bent = require('bent');
const getJSON = bent('json', 200);
const debug = require('debug')('drachtio:apiban');
const baseUrl = 'https://apiban.org/api/';
const banned = [];

module.exports = function({apikey, statusCode, emitter}) {
  (async function() {
    try {
      let url = `${baseUrl}${apikey}/banned`;
      do {
        debug(`querying with ${url}`);
        const results = await getJSON(url);
        debug({results});
        url = null;
        if (Array.isArray(results.ipaddress)) {
          Array.prototype.push.apply(banned, results.ipaddress);
          if (results.ID && 'none' !== results.ID) url = `${baseUrl}${apikey}/banned/${results.ID}`
        }
      } while (url);
      if (emitter) emitter.emit('banned', banned);
    } catch (err) {
      if (400 === err.statusCode) {
        const body = (await err.responseBody).toString();
        if (body.includes('no new bans')) {
          if (emitter) emitter.emit('banned', banned);
        }
      }
    }
  })();

  return (req, res, next) => {
    if (banned.includes(req.source_address)) {
      debug(`rejecting call from spammer at ${req.source_address}`);
      return res.send(statusCode || 403, {
        headers: {
          'X-Reason': `detected potential spammer from ${req.source_address}:${req.source_port}`
        }
      });
    }
  };
};
