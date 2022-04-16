require('dotenv').config()

const express = require('express');
const app = require('express')()
const http = require('http').createServer(app)
const mysql = require("mysql2");
const PORT = 3000;

app.use(express.json());

const HOST = process.env.HOST;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DATABASE;

/* Create Database connection. */
const db = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
});

/* Connect to MySQL. */
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("MySQL Connected.");
});

/* Welcome page. */
app.get("/", (req, res) => {
    res.send("Database tool connected.");
});

/* Insert a new employee. */
app.post("/employee/add", (req, res) => {
    let post = { name: req.body.name, designation: req.body.designation };
    let sql = "INSERT INTO employee SET ?";
    db.query(sql, post, (err) => {
        if (err) {
            return res.status(400).send(err);
        }
        return res.status(200).send("Employee added.");
    });
});

/* Get all employees. */
app.get("/employees", (req, res) => {
    let sql = "SELECT * FROM employee";
    db.query(sql, function (err, result) {
        if (err) {
            return res.status(400).send(err);
        }
        return res.status(200).json(result);
    });
});

/* Get an employee. */
app.get("/employee/:id", (req, res) => {
    let sql = `SELECT * FROM employee WHERE id = ${req.params.id}`;
    db.query(sql, function (err, result) {
        if (err) {
            return res.status(400).send(err);
        }
        return res.status(200).json(result);
    });
});

/* Update an employee. */
app.put("/employee/update/:id", (req, res) => {
    let post = { name: req.body.name, designation: req.body.designation };
    let sql = `UPDATE employee SET name = '${post.name}', designation = '${post.designation}' WHERE id = ${req.params.id}`;
    db.query(sql, (err) => {
        if (err) {
            return res.status(400).send(err);
        }
        return res.status(200).send("Employee updated.");
    });
});

/* Delete an employee. */
app.delete("/employee/delete/:id", (req, res) => {
    let sql = `DELETE FROM employee WHERE id = ${req.params.id}`;
    db.query(sql, (err) => {
        if (err) {
            return res.status(400).send(err);
        }
        return res.send("Employee deleted.");
    });
});

/* Start the Express server. */
http.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

module.exports = app;
