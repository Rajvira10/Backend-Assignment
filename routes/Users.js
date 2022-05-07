const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middlewares/AuthMiddleware");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "backend",
});

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const sqlSelect = "SELECT * from users where username=? and password=?";

  await db.query(sqlSelect, [username, password], (err, result) => {
    if (result.length > 0) {
      const accessToken = sign(
        { username: result[0].username, id: result[0].idusers },
        "hello"
      );

      res.json({
        token: accessToken,
        username: result[0].username,
        id: result[0].idusers,
      });
      console.log(result[0].username, result[0].idusers);
    } else {
      res.json({ error: "User Doesnt Exist" });
    }
  });
});

router.post("/", async (req, res) => {
  const { username, password, role } = req.body;
  const verified = false;
  const sqlCheck = "SELECT * FROM users where username=?";
  await db.query(sqlCheck, [username], async (err, result) => {
    if (result.length > 0) {
      res.json("Username taken");
    } else {
      const sqlInsert =
        "INSERT INTO users (username, password, role, verified) VALUES(?,?,?,?)";
      await db.query(
        sqlInsert,
        [username, password, role, verified],
        (err, result) => {
          if (result) {
            res.json("Success");
          }
          if (err) {
            console.log(err);
          }
        }
      );
    }
  });
});

router.delete("/", async (req, res) => {
  const { idusers } = req.body;
  const sqlDelete = "DELETE FROM users where idusers = ?";
  await db.query(sqlDelete, [idusers], (err, result) => {
    if (result) {
      res.json("Success");
    }
    if (err) {
      console.log(err);
    }
  });
});

router.put("/verify", async (req, res) => {
  const { username } = req.body;
  const verified = true;
  const sqlVerify = "UPDATE users SET verified=? where username=?";
  await db.query(sqlVerify, [verified, username], (err, result) => {
    if (result) {
      res.json("Success");
    }
    if (err) {
      console.log(err);
    }
  });
});

module.exports = router;
