const express = require('express');
const app = express();
const path = require('path');
const mariadb = require('mariadb');
const bodyParser = require('body-parser');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const notes = require('./notes.js');
const crews = require('./crews.js');

require('dotenv').config();

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionLimit: 10
});

// Initialize express app
const PORT = process.env.PORT || 8080;

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin.html'));
});

app.get('/crew', async (req, res) => {
    const response_data = await crews.getCrew(pool);
    res.send(response_data);
});

app.get('/notes', async (req, res) => {
    const response_data = await notes.getNotes(pool);
    io.emit('notes', await notes.getNotes(pool));
    res.send(response_data);
});

app.post('/note/create', async (req, res) => {
    const response_data = await notes.createNote(pool, req.body.note);
    io.emit('notes', await notes.getNotes(pool));
    res.send(response_data);
});

app.post('/note/delete', async (req, res) => {
    const response_data = await notes.deleteNote(pool, req.body.note);
    io.emit('notes', await notes.getNotes(pool));
    res.send(response_data);
});

io.on('connection', async () => {
    console.log('Connected');
    io.emit('notes', await notes.getNotes(pool));
    io.emit('crews', await crews.getCrew(pool));
});

// setInterval(async () => {
//     io.emit('crews', await crews.getCrew(pool));
// }, 60000);

server.listen(PORT, () => console.log('Headsup is up!'));
