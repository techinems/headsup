const { execQuery } = require('./db');
const moment = require('moment');

const CREW_GET_CC = `
    SELECT
        c.cc as id,
        CONCAT(SUBSTRING(c.first_name, 1, 1), '. ', c.last_name) as name,
        c.radionum as rn
    FROM
        (SELECT c.cc, m.first_name, m.last_name, m.radionum, c.date FROM crews c, members m
            WHERE m.id = c.cc AND c.date = ?) as c
    WHERE
        c.date IS NOT NULL;
`;


const CREW_GET_D = `
    SELECT
        d.driver as id,
        CONCAT(SUBSTRING(d.first_name, 1, 1), '. ', d.last_name) as name,
        d.radionum as rn
    FROM
        (SELECT c.driver, m.first_name, m.last_name, m.radionum, c.date FROM crews c, members m
            WHERE m.id = c.driver AND c.date = ?) as d
    WHERE
        d.date IS NOT NULL;
`;

const CREW_GET_R1 = `
    SELECT
        r1.attendant as id,
        CONCAT(SUBSTRING(r1.first_name, 1, 1), '. ', r1.last_name) as name,
        r1.radionum as rn
    FROM
        (SELECT c.attendant, m.first_name, m.last_name, m.radionum, c.date FROM crews c, members m
            WHERE m.id = c.attendant AND c.date = ?) as r1
    WHERE
        r1.date IS NOT NULL;
`;

const CREW_GET_R2 = `
    SELECT
        r2.observer as id,
        CONCAT(SUBSTRING(r2.first_name, 1, 1), '. ', r2.last_name) as name,
        r2.radionum as rn
    FROM
        (SELECT c.observer, m.first_name, m.last_name, m.radionum, c.date FROM crews c, members m
            WHERE m.id = c.observer AND c.date = ?) as r2
    WHERE
        r2.date IS NOT NULL;
`;

const CREW_GET_DS = `
    SELECT
        ds.dutysup as id,
        CONCAT(SUBSTRING(ds.first_name, 1, 1), '. ', ds.last_name) as name,
        ds.radionum as rn
    FROM
        (SELECT c.dutysup, m.first_name, m.last_name, m.radionum, c.date FROM crews c, members m
            WHERE m.id = c.dutysup AND c.date = ?) as ds
    WHERE
        ds.date IS NOT NULL;
`;


function buildDate() {
    const crewDate = moment();
    const currentHour = crewDate.hours();
    // If it's not noon yet we use the previous day's crew
    if (currentHour < 12) {
        crewDate.subtract(1, 'days');
    }
    return crewDate.format('YYYY-MM-DD');
}

function cleanName(member) {
    // handle a vacant spot
    if (member.data[0] == undefined) {
        return {
            id: 0,
            name: "",
            rn: 0
        }
    }

    member = member.data[0]

    if (member.id == -1) {
        member.name = "RESERVED";
    } else if (member.id == -2) {
        member.name = "OUT OF SERVICE";
    }

    return member;
}

function cleanQueryResult(results) {
    delete results['meta'];
    return results;
}

exports.getCrew = async (pool) => {
    try {
        const date = buildDate();
        const crew = { success: true };

        let cc = await execQuery(pool, CREW_GET_CC, date, cleanQueryResult, process.env.CREWS_DB_NAME);
        crew.cc = cleanName(cc);

        let driver = await execQuery(pool, CREW_GET_D, date, cleanQueryResult, process.env.CREWS_DB_NAME);
        crew.driver = cleanName(driver);
        
        let rider1 = await execQuery(pool, CREW_GET_R1, date, cleanQueryResult, process.env.CREWS_DB_NAME);
        crew.rider1 = cleanName(rider1);  
        
        let rider2 = await execQuery(pool, CREW_GET_R2, date, cleanQueryResult, process.env.CREWS_DB_NAME);
        crew.rider2 = cleanName(rider2);  
        
        let dutysup = await execQuery(pool, CREW_GET_DS, date, cleanQueryResult, process.env.CREWS_DB_NAME);
        crew.dutysup = cleanName(dutysup);
        
        return crew;
    } catch (err) {
        console.error(err);
        return { success: false };
    }
}
