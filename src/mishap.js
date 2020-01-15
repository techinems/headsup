const { execQuery } = require('./db');

const MISHAP_CREATE = 'INSERT INTO dispatchMishaps (date, mishap) VALUES (?, ?)';
const MISHAP_COUNT = 'SELECT count(*) as mishapCount from dispatchMishaps';

exports.createMishap = (pool, mishap) => {
    return execQuery(pool, MISHAP_CREATE, [new Date(), mishap]);
};

exports.getTotalMishaps = pool => {
    return execQuery(pool, MISHAP_COUNT, null, r => r[0].mishapCount);
};