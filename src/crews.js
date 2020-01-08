const { execQuery } = require('./db');
const moment = require('moment');

const CREW_GET = `
    SELECT
        CONCAT(SUBSTRING(c.first_name, 1, 1), '. ', c.last_name) as cc,
        CONCAT(SUBSTRING(d.first_name, 1, 1), '. ', d.last_name) as driver,
        CONCAT(SUBSTRING(r1.first_name, 1, 1), '. ', r1.last_name) as rider1,
        CONCAT(SUBSTRING(r2.first_name, 1, 1), '. ', r2.last_name) as rider2,
        c.radionum as ccrn,
        d.radionum as driverrn,
        r1.radionum as rider1rn,
        r2.radionum as rider2rn
    FROM
        (SELECT m.first_name, m.last_name, m.radionum, c.date FROM crews c, members m
            WHERE m.id = c.cc AND c.date = ?) as c,
        (SELECT m.first_name, m.last_name, m.radionum, c.date FROM crews c, members m
            WHERE m.id = c.driver AND c.date = ?) as d,
        (SELECT m.first_name, m.last_name, m.radionum, c.date FROM crews c, members m
            WHERE m.id = c.attendant AND c.date = ?) as r1,
        (SELECT m.first_name, m.last_name, m.radionum, c.date FROM crews c, members m
            WHERE m.id = c.observer AND c.date = ?) as r2
    WHERE
        c.date IS NOT NULL AND
        d.date IS NOT NULL AND
        r1.date IS NOT NULL AND
        r2.date IS NOT NULL;
`;

function buildDateArray() {
    const crewDate = moment();
    const currentHour = crewDate.hours();
    // If it's not noon yet we use the previous day's crew
    if (currentHour < 12) {
        crewDate.subtract(1, "days");
    }
    const d = crewDate.format('YYYY-MM-DD');
    return [d, d, d, d];
}

exports.getCrew = pool => execQuery(pool, CREW_GET, buildDateArray(), results => {
    delete results['meta'];
    return results;
}, process.env.CREWS_DB_NAME);
