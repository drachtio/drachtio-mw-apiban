const assert = require('assert');
const test = require('tape');
const Emitter = require('events');
const emitter = new Emitter();

test('apiban tests', (t) => {
  assert.ok(process.env.APIBAN_API_KEY, 'APIBAN_API_KEY env var must be set');
  t.plan(1);
  t.timeoutAfter(3000);
  emitter.on('banned', (ips) => {
    t.ok(ips.length, `successfully returned ${ips.length} banned ips`);
  })
  const fn = require('..')({apikey: process.env.APIBAN_API_KEY, emitter});
});
