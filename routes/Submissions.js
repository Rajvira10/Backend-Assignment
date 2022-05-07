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

router.post("/", validateToken, async (req, res) => {
  const { id } = req.user;
  const { idassessment, mentor, link, dateofsubmission } = req.body;
  const mark = 0;
  const remarks = "";
  const sqlCheckRole = "SELECT role from users where idusers = ?";
  await db.query(sqlCheckRole, [id], async (err, result) => {
    if (result[0].role !== "mentor") {
      const sqlSubmit =
        "INSERT INTO submissions (idassessment, idusers, mentor, link, dateofsubmission,mark, remarks) VALUES(?,?,?,?,?,?,?)";
      await db.query(
        sqlSubmit,
        [idassessment, id, mentor, link, dateofsubmission, mark, remarks],
        (err, result) => {
          if (result) {
            res.json("Success");
          }
          if (err) {
            res.json(err);
          }
        }
      );
    } else {
      res.json("Not a student");
    }
  });
});

router.post("/grade", validateToken, async (req, res) => {
  const { username, id } = req.user;
  const { idsubmissions, mark, remarks } = req.body;
  const sqlCheckRole = "SELECT role from users where idusers = ?";
  await db.query(sqlCheckRole, [id], async (err, result) => {
    if (result[0].role !== "student") {
      const sqlcheckMentor =
        "SELECT mentor from submissions where idsubmissions = ?";
      await db.query(sqlcheckMentor, [idsubmissions], async (error, re) => {
        if (re[0].mentor === username) {
          const sqlGrade =
            "UPDATE submissions SET mark = ?, remarks = ? WHERE idsubmissions = ?";
          await db.query(sqlGrade, [mark, remarks], (e, r) => {
            if (r) {
              res.json("SUCCESS");
            }
            if (e) {
              res.json(e);
            }
          });
        }
      });
    }
  });
});

router.post("/byAssessment", validateToken, async (req, res) => {
  const { id } = req.user;
  const { idassessment } = req.body;
  const sqlCheckRole = "SELECT role from users where idusers = ?";
  await db.query(sqlCheckRole, [id], async (err, result) => {
    if (result[0].role !== "student") {
      const sqlSubmissions = "SELECT * from submissions where idassessment = ?";
      await db.query(sqlSubmissions, [idassessment], (error, result) => {
        if (result) {
          res.json(result);
        }
        if (err) {
          res.json(err);
        }
      });
    } else {
      const sqlSubmissions =
        "SELECT * from submissions where idassessment = ? and idusers = ?";
      await db.query(sqlSubmissions, [idassessment, id], (error, result) => {
        if (result) {
          res.json(result);
        }
        if (err) {
          res.json(err);
        }
      });
    }
  });
});

router.delete("/", validateToken, async (req, res) => {
  const { idsubmissions } = req.body;
  const sqlDelete = "DELETE FROM submissions where idsubmissions = ?";
  await db.query(sqlDelete, [idsubmissions], (err, result) => {
    if (result) {
      res.json("Success");
    }
    if (err) {
      console.log(err);
    }
  });
});

router.put("/grade", validateToken, async (req, res) => {
  const { username, id } = req.user;
  const { idsubmissions } = req.body;
  const mark = 0;
  const remarks = "";
  const sqlCheckRole = "SELECT role from users where idusers = ?";
  await db.query(sqlCheckRole, [id], async (err, result) => {
    if (result[0].role === "admin") {
      const sqlGrade =
        "UPDATE submissions SET mark = ?, remarks = ? WHERE idsubmissions = ?";
      await db.query(sqlGrade, [mark, remarks], (err, result) => {
        if (result) {
          res.json("SUCCESS");
        }
        if (err) {
          res.json(e);
        }
      });
    }
  });
});

module.exports = router;
