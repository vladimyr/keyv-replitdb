'use strict';

const fetch = require('node-fetch');
const path = require('path');
const pCatchIf = require('p-catch-if');
const pMap = require('p-map');

class KeyvReplitDb {
  constructor(url = process.env.REPLIT_DB_URL) {
    this.ttlSupport = false;
    this.url = new URL(url);
  }

  _getItemUrl(key) {
    const pathname = path.join(
      this.url.pathname,
      encodeURIComponent(key)
    );
    return new URL(pathname, this.url);
  }

  async get(key) {
    return fetch(this._getItemUrl(key))
      .then(status)
      .then(resp => resp.text())
      .then(value => {
        if (value === null) return undefined;
        return value;
      })
      .catch(pCatchIf(notFound, () => undefined));
  }

  set(key, value) {
    if (typeof value === 'undefined') {
      return Promise.resolve();
    }
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    const body = new URLSearchParams();
    body.set(key, value);
    return fetch(this.url, { method: 'POST', headers, body })
      .then(status)
      .then(() => true);
  }

  delete(key) {
    return fetch(this._getItemUrl(key), { method: 'DELETE' })
      .then(status)
      .then(() => true)
      .catch(pCatchIf(notFound, () => false));
  }

  list() {
    const prefix = this.namespace ? `${this.namespace}:` : '';
    const url = new URL(this.url);
    url.searchParams.set('encode', true);
    url.searchParams.set('prefix', prefix);
    return fetch(url)
      .then(status)
      .then(resp => resp.text())
      .then(text => {
        const lines = text.split(/\r?\n/).filter(Boolean);
        return lines.map(line => decodeURIComponent(line));
      });
  }

  clear({ concurrency = 8 } = {}) {
    return this.list()
      .then(keys => pMap(keys, key => {
        return this.delete(key);
      }, { concurrency }))
      .then(() => undefined);
  }

  static extend(base) {
    return class extends base {
      list() {
        const { store } = this.opts;
        return store.list();
      }
    };
  }
}

module.exports = KeyvReplitDb;

function notFound(error) {
  return error.response &&
    error.response.status === 404;
}

function status(response) {
  if (response.ok) return response;
  const error = new Error(response.statusText || response.status);
  error.response = response;
  throw error;
}
