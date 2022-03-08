const { execQuery } = require('./db');
const moment = require('moment');

function getQuery(role) {
    return `SELECT
        c.${role} AS id,
        CONCAT(SUBSTRING(m.first_name, 1, 1), '. ', m.last_name) as name,
        m.radionum AS rn
    FROM
        crews AS c
    INNER JOIN members AS m ON m.id = c.${role}
    WHERE c.date = ?`;
}

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

        let cc = await execQuery(pool, getQuery('cc'), date, cleanQueryResult, process.env.CREWS_DB_NAME);
        crew.cc = cleanName(cc);

        let driver = await execQuery(pool, getQuery('driver'), date, cleanQueryResult, process.env.CREWS_DB_NAME);
        crew.driver = cleanName(driver);
        
        let rider1 = await execQuery(pool, getQuery('attendant'), date, cleanQueryResult, process.env.CREWS_DB_NAME);
        crew.rider1 = cleanName(rider1);  
        
        let rider2 = await execQuery(pool, getQuery('observer'), date, cleanQueryResult, process.env.CREWS_DB_NAME);
        crew.rider2 = cleanName(rider2);  
        
        let dutysup = await execQuery(pool, getQuery('dutysup'), date, cleanQueryResult, process.env.CREWS_DB_NAME);
        crew.dutysup = cleanName(dutysup);
        
        return crew;
    } catch (err) {
        console.error(err);
        return { success: false };
    }
}
