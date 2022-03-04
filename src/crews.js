const { execQuery } = require('./db');
const moment = require('moment');

const CREW_GET = `
    SELECT
        c.id as cc_id,
        d.id as driver_id,
        r1.id as rider1_id,
        r2.id as rider2_id,
        ds.id as dutysup_id,
        CONCAT(SUBSTRING(c.first_name, 1, 1), '. ', c.last_name) as cc,
        CONCAT(SUBSTRING(d.first_name, 1, 1), '. ', d.last_name) as driver,
        CONCAT(SUBSTRING(r1.first_name, 1, 1), '. ', r1.last_name) as rider1,
        CONCAT(SUBSTRING(r2.first_name, 1, 1), '. ', r2.last_name) as rider2,
        CONCAT(SUBSTRING(ds.first_name, 1, 1), '. ', ds.last_name) as dutysup,
        c.radionum as ccrn,
        d.radionum as driverrn,
        r1.radionum as rider1rn,
        r2.radionum as rider2rn,
        ds.radionum as dutysuprn
    FROM
        (SELECT m.id, m.first_name, m.last_name, m.radionum, c.date FROM crews c, members m
            WHERE m.id = c.cc AND c.date = ?) as c,
        (SELECT m.id, m.first_name, m.last_name, m.radionum, c.date FROM crews c, members m
            WHERE m.id = c.driver AND c.date = ?) as d,
        (SELECT m.id, m.first_name, m.last_name, m.radionum, c.date FROM crews c, members m
            WHERE m.id = c.attendant AND c.date = ?) as r1,
        (SELECT m.id, m.first_name, m.last_name, m.radionum, c.date FROM crews c, members m
            WHERE m.id = c.observer AND c.date = ?) as r2,
        (SELECT m.id, m.first_name, m.last_name, m.radionum, c.date FROM crews c, members m
            WHERE m.id = c.dutysup AND c.date = ?) as ds
    WHERE
        c.date IS NOT NULL AND
        d.date IS NOT NULL AND
        r1.date IS NOT NULL AND
        r2.date IS NOT NULL AND
        ds.date IS NOT NULL;
`;

function buildDateArray() {
    const crewDate = moment();
    const currentHour = crewDate.hours();
    // If it's not noon yet we use the previous day's crew
    if (currentHour < 12) {
        crewDate.subtract(1, 'days');
    }
    const d = crewDate.format('YYYY-MM-DD');
    return [d, d, d, d, d];
}

function cleanName(memberid) {
  if (memberid == 0) {
    return "VACANT";
  } else if (memberid == -1) {
    return "RESERVED";
  } else if (memberid == -2) {
    return "OUT OF SERVICE";
  }
}

exports.getCrew = pool => execQuery(pool, CREW_GET, buildDateArray(), results => {
    delete results['meta'];

    // if any of the rider spots are vacant/OOS/reserved, give them the correct "name"/radio number

    if (results[data][0].cc_id <= 0) {
      results[data][0].ccrn = 0;
      results[data][0].cc = cleanName(results[data][0].cc_id);
    }

    if (results[data][0].driver_id <= 0) {
      results[data][0].driverrn = 0;
      results[data][0].driver = cleanName(results[data][0].driver_id);
    }

    if (results[data][0].rider1_id <= 0) {
      results[data][0].rider1rn = 0;
      results[data][0].rider1 = cleanName(results[data][0].rider1_id);
    }

    if (results[data][0].rider2_id <= 0) {
      results[data][0].rider2rn = 0;
      results[data][0].rider2 = cleanName(results[data][0].rider3_id);
    }

    if (results[data][0].dutysup_id <= 0) {
      results[data][0].dutysuprn = 0;
      results[data][0].dutysup = cleanName(results[data][0].dutysup_id);
    }

    return results;
}, process.env.CREWS_DB_NAME);
