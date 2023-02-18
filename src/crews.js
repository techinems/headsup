const { execQuery } = require('./db');
const moment = require('moment');

const DEV = process.env.ENV == 'dev' ? true : false;

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
    if (currentHour < 9) {
        crewDate.subtract(1, 'days');
    }
    return crewDate.format('YYYY-MM-DD');
}

function cleanName(member) {
    // handle a vacant spot
    if (member.data[0] == undefined) {
        return {
            id: 0,
            name: '',
            rn: 0,
        };
    }

    member = member.data[0];

    if (member.id == -1) {
        member.name = 'RESERVED';
    } else if (member.id == -2) {
        member.name = 'OUT OF SERVICE';
    }

    return member;
}

function cleanQueryResult(results) {
    delete results['meta'];
    return results;
}

exports.getCrew = async (pool) => {
    if (DEV) {
        const crew = {
            success: true,
            'cc': {
                id: 1,
                name: 'C. Chief',
                rn: '901'
            },
            'driver': {
                id:2,
                name: 'D. Driver',
                rn: '902'
            },
            'attendant': {
                id:3,
                name: 'A. Attendant',
                rn: '903'
            },
            'observer': {
                id:4,
                name: 'O. Observer',
                rn: '904'
            },
            'dutysup': {
                id:5,
                name: 'D. Supervisor',
                rn: '910'
            },
        };
        return crew;
    }
    try {
        const date = buildDate();
        const crew = { success: true };

        const positions = ['cc', 'driver', 'attendant', 'observer', 'dutysup'];

        for (const p of positions) {
            let result = await execQuery(
                pool,
                getQuery(p),
                date,
                cleanQueryResult,
                process.env.CREWS_DB_NAME
            );
            crew[p] = cleanName(result);
        }

        return crew;
    } catch (err) {
        console.error(err);
        return { success: false };
    }
};
