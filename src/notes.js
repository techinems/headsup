const { execQuery } = require('./db');

const NOTES_GET = 'SELECT * from notes';
const NOTE_CREATE = 'INSERT INTO notes (note) VALUES (?)';
const NOTE_DELETE = 'DELETE FROM notes where id = ?';

exports.getNotes = pool => execQuery(pool, NOTES_GET, null, results => {
    delete results['meta'];
    return results;
});

exports.deleteNote = (pool, note_id) => execQuery(pool, NOTE_DELETE, [note_id]);

exports.createNote = (pool, note) => execQuery(pool, NOTE_CREATE, [note]);