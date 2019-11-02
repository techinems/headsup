const queries = require('./queries.js');
async function getCrew(pool) {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query('USE ambulanc_web;');
        const today_crew = await conn.query(queries.constructCrewQuery());
        // Metadata isn"t super important to us
        delete today_crew['meta'];
        return { success: true, data: today_crew };
    } catch (err) {
        console.error(err);
        return { success: false };
    } finally {
        if (conn) {
            conn.release();
        }
    }
}

exports.getCrew = getCrew;