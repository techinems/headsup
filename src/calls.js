const { execQuery } = require('./db');

const CALL_INSERT = 'INSERT INTO calls VALUES (?, ?, ?, ?, ?)';
const CALL_COUNT = 'SELECT count(*) as callCount from calls';

exports.createCall = (pool, call_data) => execQuery(pool, CALL_INSERT, [call_data.prid,
    call_data.cc, call_data.driver, call_data.category, call_data.response]);

exports.getTotalCalls = pool => execQuery(pool, CALL_COUNT, null, r => parseInt(r[0].callCount));
