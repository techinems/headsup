const { execQuery } = require('./db');

const MISHAP_CREATE = 'INSERT INTO dispatch_mishaps (date, mishap) VALUES (?, ?)';
const MISHAP_COUNT = 'SELECT count(*) as mishapCount from dispatch_mishaps';

exports.createMishap = (pool, mishap) => {
    return execQuery(pool, MISHAP_CREATE, [new Date(), mishap]);
};

exports.getTotalMishaps = pool => {
    return execQuery(pool, MISHAP_COUNT, null, r => r[0].mishapCount);
};