const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const { validateToken } = require("../middlewares/AuthMiddleware");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "backend",
});

const getTime = () => {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();

  return (
    year +
    "-" +
    month +
    "-" +
    date +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds
  );
};

router.post("/", validateToken, async (req, res) => {
  const { title, description, mentor, deadline } = req.body;
  let createdAt = getTime();
  const { id } = req.user;
  const sqlCheckRole = "SELECT role from users where idusers = ?";
  await db.query(sqlCheckRole, [id], async (err, result) => {
    if (result[0].role !== "student") {
      const sqlInsert =
        "INSERT INTO assessment (title, description, mentor, deadline, createdAt) VALUES(?,?,?,?,?)";
      await db.query(
        sqlInsert,
        [title, description, mentor, deadline, createdAt],
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

router.get("/", validateToken, async (req, res) => {
  const sqlGetAllSubmissions = "SELECT * from assessment";
  await db.query(sqlGetAllSubmissions, (err, result) => {
    if (result) {
      res.json(result);
    }
    if (err) {
      console.log(err);
    }
  });
});

router.post("/byMentor", validateToken, async (req, res) => {
  const { mentor } = req.body;
  const sqlGetSubmissionsByMentor = "SELECT * from assessment where mentor=?";
  await db.query(sqlGetSubmissionsByMentor, [mentor], (err, result) => {
    if (result.length > 0) {
      res.json(result);
    } else {
      res.send("No assignments under this mentor");
    }
    if (err) {
      console.log(err);
    }
  });
});

router.delete("/", validateToken, async (req, res) => {
  const { idassessment } = req.body;
  const sqlDelete = "DELETE FROM submissions where idassessment = ?";
  await db.query(sqlDelete, [idassessment], (err, result) => {
    if (result) {
      res.json("Success");
    }
    if (err) {
      console.log(err);
    }
  });
});

module.exports = router;
