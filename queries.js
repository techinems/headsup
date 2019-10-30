const moment = require('moment');

function constructCrewQuery() {
    let crew_date = moment();
    const current_hour = crew_date.hours();
    // If it's not noon yet we use the previous day's crew
    if (current_hour < 12) {
        crew_date.subtract(1, "days");
    }
    crew_date = crew_date.format('YYYY-MM-DD');
    const crew_query = `
    SELECT (
        SELECT CONCAT(SUBSTRING(m.first_name, 1, 1), '. ', m.last_name)
        FROM 
        crews c,
        members m
        WHERE
        m.id = c.cc AND
        c.date = '${crew_date}'
    ) as cc,
    (
        SELECT m.radionum
        FROM 
        crews c,
        members m
        WHERE
        m.id = c.cc AND
        c.date = '${crew_date}'
    ) as ccrn,
    (
        SELECT CONCAT(SUBSTRING(m.first_name, 1, 1), '. ', m.last_name)
        FROM 
        crews c,
        members m
        WHERE
        m.id = c.driver AND
        c.date = '${crew_date}'
    ) as driver,
    (
        SELECT m.radionum
        FROM 
        crews c,
        members m
        WHERE
        m.id = c.driver AND
        c.date = '${crew_date}'
    ) as driverrn,
    (
        SELECT CONCAT(SUBSTRING(m.first_name, 1, 1), '. ', m.last_name)
        FROM 
        crews c,
        members m
        WHERE
        m.id = c.attendant AND
        c.date = '${crew_date}'
    ) as rider1,
    (
        SELECT m.radionum
        FROM 
        crews c,
        members m
        WHERE
        m.id = c.attendant AND
        c.date = '${crew_date}'
    ) as rider1rn,
    (
        SELECT CONCAT(SUBSTRING(m.first_name, 1, 1), '. ', m.last_name)
        FROM 
        crews c,
        members m
        WHERE
        m.id = c.observer AND
        c.date = '${crew_date}'
    ) as rider2,
    (
        SELECT m.radionum
        FROM 
        crews c,
        members m
        WHERE
        m.id = c.observer AND
        c.date = '${crew_date}'
    ) as rider2rn;`;
    return crew_query;
}

exports.constructCrewQuery = constructCrewQuery;