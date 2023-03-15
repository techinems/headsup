const express = require('express');
const app = express();
const path = require('path');
const mariadb = require('mariadb');
const bodyParser = require('body-parser');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const notes = require('./src/notes.js');
const mishap = require('./src/mishap.js');
const crews = require('./src/crews.js');
const calls = require('./src/calls.js');

require('dotenv').config();

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionLimit: 10,
    charset: 'utf8mb4',
});

// Initialize express app
const PORT = process.env.PORT || 8080;
const WEBSITE_ACCESS_TOKEN = process.env.WEBSITE_ACCESS_TOKEN;
const HERALD_TOKEN = process.env.HERALD_TOKEN;

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/suncalc.js', (_, res) => {
    res.sendFile(path.join(__dirname, 'node_modules', 'suncalc', 'suncalc.js'));
});

app.get('/', (req, res) => {
    if (WEBSITE_ACCESS_TOKEN !== req.query.token) {
        res.sendStatus(403);
    } else {
        res.sendFile(path.join(__dirname, 'public/index.html'));
    }
});

app.get('/admin', (req, res) => {
    if (WEBSITE_ACCESS_TOKEN !== req.query.token) {
        res.sendStatus(403);
    } else {
        res.sendFile(path.join(__dirname, 'public/admin.html'));
    }
});

app.get('/crew', async (_, res) => {
    const response_data = await crews.getCrew(pool);
    res.send(response_data);
});

app.get('/notes', async (_, res) => {
    const response_data = await notes.getNotes(pool);
    io.emit('notes', response_data);
    res.send(response_data);
});

app.post('/call/create', async (req, res) => {
    await calls.createCall(pool, req.body);
    const response_data = await calls.getTotalCalls(pool);
    io.emit('calls', response_data);
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

app.post('/mishap/create', async (req, res) => {
    await mishap.createMishap(pool, req.body.mishap);
    const response_data = await mishap.getTotalMishaps(pool);
    io.emit('mishaps', response_data);
    res.send(response_data);
});

app.get('/mishap', async (_, res) => {
    const response_data = await mishap.getTotalMishaps(pool);
    res.send(response_data);
});

app.post('/chores', (req, res) => {
    io.emit('chores', req.body);
    res.send({ success: true });
});

app.post('/dispatch', (req, res) => {
    if (HERALD_TOKEN !== req.query.token) {
        res.sendStatus(403);
    } else {
        console.log('recieved herald dispatch');
        io.emit('dispatch', req.body);
        res.send({ success: true });
    }
});

io.on('connection', async () => {
    io.emit('notes', await notes.getNotes(pool));
    io.emit('crews', await crews.getCrew(pool));
    io.emit('calls', await calls.getTotalCalls(pool));
    io.emit('mishaps', await mishap.getTotalMishaps(pool));
});

setInterval(async () => {
    io.emit('crews', await crews.getCrew(pool));
}, 60000);

server.listen(PORT, () => {
    console.log('Headsup is up!');
    io.emit('refresh');
});
