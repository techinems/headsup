async function execQuery(pool, q, args = null, responseFunc = null) {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query(`USE ${process.env.DB_NAME};`);
        const results = await (args != null ? conn.query(q, args) : conn.query(q));
        const response = { success: true };
        if (responseFunc != null) {
            response.data = responseFunc(results);
        }
        return response;
    } catch (err) {
        console.error(err);
        return { success: false };
    } finally {
        if (conn) {
            conn.release();
        }
    }
}

module.exports = { execQuery };