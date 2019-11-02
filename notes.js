async function getNotes(pool) {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query('USE headsup;');
        const notes = await conn.query('SELECT * from notes;');
        // Metadata isn"t super important to us
        delete notes['meta'];
        return { success: true, data: notes };
    } catch (err) {
        console.error(err);
        return { success: false };
    } finally {
        if (conn) {
            conn.release();
        }
    }
}

async function deleteNote(pool, note_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query('USE headsup;');
        const notes = await conn.query('DELETE FROM notes where id = ?', [note_id]);
        // Metadata isn"t super important to us
        delete notes['meta'];
        return { success: true };
    } catch (err) {
        console.error(err);
        return { success: false };
    } finally {
        if (conn) {
            conn.release();
        }
    }
}

async function createNote(pool, note) {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query('USE headsup;');
        const notes = await conn.query(
            'INSERT INTO notes (note) VALUES (?)',
            [note]
        );
        // Metadata isn"t super important to us
        delete notes['meta'];
        return { success: true };
    } catch (err) {
        console.error(err);
        return { success: false };
    } finally {
        if (conn) {
            conn.release();
        }
    }
}

exports.getNotes = getNotes;
exports.deleteNote = deleteNote;
exports.createNote = createNote;