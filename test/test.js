'use strict';

const { config } = require('../package.json');
const fetch = require('node-fetch');
const Keyv = require('keyv');
const KeyvReplitDb = require('../');
const keyvTestSuite = require('@keyv/test-suite').default;
const test = require('ava');

let replitDbUrl;

test.before(async function () {
  const headers = {
    Authorization: `Bearer ${process.env.REPL_API_KEY}`
  };
  const resp = await fetch(config.replitUrl, { headers }).then(status);
  replitDbUrl = await resp.text();
});

const createStore = () => new KeyvReplitDb(replitDbUrl);
keyvTestSuite(test, Keyv, createStore);

test.serial('store.list() returns a Promise', async t => {
  const store = createStore();
  const keyv = new Keyv({ store });
  const returnValue = store.list();
  t.true(returnValue instanceof Promise);
  await returnValue;
});

test.serial('store.list() gets all keys', async t => {
  const store = createStore();
  const keyv = new Keyv({ store });
  t.deepEqual(await store.list(), []);
  await keyv.set('foo', 'bar');
  await keyv.set('fizz', 'buzz');
  const actual = await store.list();
  const expected = ['foo', 'fizz'].map(key => {
    return `${store.namespace}:${key}`;
  });
  t.deepEqual(actual.sort(), expected.sort());
});

function status(response) {
  if (response.ok) return response;
  const error = new Error(response.statusText || response.status);
  error.response = response;
  throw error;
}
