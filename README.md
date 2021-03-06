# keyv-replitdb

[![build status](https://badgen.net/circleci/github/vladimyr/keyv-replitdb/master)](https://app.circleci.com/pipelines/github/vladimyr/keyv-replitdb?branch=master)
[![install size](https://badgen.net/packagephobia/install/keyv-replitdb)](https://packagephobia.now.sh/result?p=keyv-replitdb)
[![npm package version](https://badgen.net/npm/v/keyv-replitdb)](https://npm.im/keyv-replitdb)
[![github license](https://badgen.net/github/license/vladimyr/keyv-replitdb)](https://github.com/vladimyr/keyv-replitdb/blob/master/LICENSE)
[![js semistandard style](https://badgen.net/badge/code%20style/semistandard/pink)](https://github.com/standard/semistandard)

> [Repl.it Database](https://docs.repl.it/misc/database) storage adapter for [Keyv](https://github.com/lukechilds/keyv).

[![run on repl.it](https://repl.it/badge/github/vladimyr/keyv-replitdb)](https://repl.it/github/vladimyr/keyv-replitdb)

## Install

```
npm install keyv keyv-replitdb
```

## Usage

```js
const ReplitDbStore = require('keyv-replitdb');
const Keyv = ReplitDbStore.extend(require('keyv'));

const keyv = new Keyv({ store: new ReplitDbStore() });
```
