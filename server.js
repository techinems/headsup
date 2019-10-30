const express = require("express");
const path = require("path");
const mariadb = require("mariadb");
const bodyParser = require("body-parser");
const queries = require("./queries.js");

require("dotenv").config();

const pool = mariadb.createPool({ host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, connectionLimit: 10 })

// Initialize express app
const PORT = process.env.PORT || 8080;
const app = express();

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/public", express.static(path.join(__dirname, "public")))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "public/admin.html"));
});

app.get("/crew", async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query("USE ambulanc_web;")
        const today_crew = await conn.query(queries.constructCrewQuery());
        // Metadata isn"t super important to us
        delete today_crew["meta"];
        res.send({ success: true, data: today_crew });
    } catch (err) {
        console.error(err);
        res.send({ success: false });
    } finally {
        if (conn) {
            conn.release();
        }
    }
});

app.get("/notes", async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query("USE headsup;")
        const notes = await conn.query("SELECT * from notes;");
        // Metadata isn"t super important to us
        delete notes["meta"];
        res.send({ success: true, data: notes });
    } catch (err) {
        console.error(err);
        res.send({ success: false });
    } finally {
        if (conn) {
            conn.release();
        }
    }
});

app.post("/note/create", async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query("USE headsup;")
        const notes = await conn.query("INSERT INTO notes (note) VALUES (?)", [req.body.note]);
        // Metadata isn"t super important to us
        delete notes["meta"];
        res.send({ success: true });
    } catch (err) {
        console.error(err);
        res.send({ success: false });
    } finally {
        if (conn) {
            conn.release();
        }
    }
});

app.post("/note/delete", async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query("USE headsup;")
        const notes = await conn.query("DELETE FROM notes where id = ?", [req.body.note]);
        // Metadata isn"t super important to us
        delete notes["meta"];
        res.send({ success: true });
    } catch (err) {
        console.error(err);
        res.send({ success: false });
    } finally {
        if (conn) {
            conn.release();
        }
    }
});

app.listen(PORT, () => console.log("Headsup is up!"));