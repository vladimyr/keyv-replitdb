'use strict';

require('dotenv').config();
const crypto = require('crypto');
const { send } = require('micro');

module.exports = (req, res) => {
  if (!isAllowed(req)) {
    send(res, 401);
  } else {
    send(res, 200, process.env.REPLIT_DB_URL);
  }
};

function isAllowed({ headers = {} }) {
  const { authorization = '' } = headers;
  const [type, credentials] = authorization.split(' ');
  return type === 'Bearer' &&
    safeEqual(process.env.REPL_API_KEY, credentials);
}

function safeEqual(str1, str2) {
  const buf1 = Buffer.from(str1);
  const buf2 = Buffer.from(str2);
  return buf1.length === buf2.length &&
    crypto.timingSafeEqual(buf1, buf2);
}
