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
    ) as CC,
    (
        SELECT CONCAT(SUBSTRING(m.first_name, 1, 1), '. ', m.last_name)
        FROM 
        crews c,
        members m
        WHERE
        m.id = c.driver AND
        c.date = '${crew_date}'
    ) as Driver,
    (
        SELECT CONCAT(SUBSTRING(m.first_name, 1, 1), '. ', m.last_name)
        FROM 
        crews c,
        members m
        WHERE
        m.id = c.attendant AND
        c.date = '${crew_date}'
    ) as Rider1,
    (
        SELECT CONCAT(SUBSTRING(m.first_name, 1, 1), '. ', m.last_name)
        FROM 
        crews c,
        members m
        WHERE
        m.id = c.observer AND
        c.date = '${crew_date}'
    ) as Rider2;`;
    return crew_query;
}

exports.constructCrewQuery = constructCrewQuery;