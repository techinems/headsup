const express = require("express");
const path = require('path');
const bodyParser = require("body-parser");
require('dotenv').config();

// Initialize express app
const PORT = process.env.PORT || 8080;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => console.log('Headsup is up!'));