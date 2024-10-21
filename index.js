import { DB } from "./connect.js";

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

// CORS configuration
const allowedOrigins = [
  "https://er-character-planner-teal.vercel.app",
  "http://localhost:3000",
];
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200);
  res.send("SQL characters table online");
});

app.get("/classes", (req, res) => {
  res.json({
    hero: {
      initLvl: 7,
      vig: 14,
      mind: 9,
      end: 12,
      str: 16,
      dex: 9,
      int: 7,
      faith: 8,
      arc: 11,
    },
    bandit: {
      initLvl: 5,
      vig: 10,
      mind: 11,
      end: 10,
      str: 9,
      dex: 13,
      int: 9,
      faith: 8,
      arc: 14,
    },
    astrologer: {
      initLvl: 6,
      vig: 9,
      mind: 15,
      end: 9,
      str: 8,
      dex: 12,
      int: 16,
      faith: 7,
      arc: 9,
    },
  });
});

app.get("/characters/:id", (req, res) => {
  res.set("content-type", "application/json");

  const id = req.params.id; // Get the ID from the request URL
  const sql = `SELECT * FROM characters WHERE id = ?`;

  let data;

  try {
    DB.get(sql, [id], (err, row) => {
      if (err) {
        throw err;
      }
      if (row) {
        data = {
          id: row.id,
          name: row.name,
          initLvl: row.initLvl,
          startClass: row.startClass,
          vig: row.vig,
          mind: row.mind,
          end: row.end,
          str: row.str,
          dex: row.dex,
          int: row.int,
          faith: row.faith,
          arc: row.arc,
        };
      } else {
        return res
          .status(404)
          .send({ code: 404, status: "Character not found" });
      }
      let content = JSON.stringify(data);
      res.send(content);
    });
  } catch (err) {
    console.log(err.message);
    res.status(467).send({ code: 467, status: err.message });
  }
});

app.get("/characters", (req, res) => {
  res.set("content-type", "application/json");

  const sql = `SELECT * FROM characters`;

  let data = { characters: [] };

  try {
    DB.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }
      rows.forEach(row => {
        data.characters.push({
          id: row.id,
          name: row.name,
          initLvl: row.initLvl,
          startClass: row.startClass,
          vig: row.vig,
          mind: row.mind,
          end: row.end,
          str: row.str,
          dex: row.dex,
          int: row.int,
          faith: row.faith,
          arc: row.arc,
        });
      });
      let content = JSON.stringify(data);
      res.send(content);
    });
  } catch (err) {
    console.log(err.message);
    res.status(467);
    res.send(`{"code": 467, "status" : "${err.message}"}`);
  }
});

app.post("/characters", (req, res) => {
  res.set("content-type", "application/json");

  const sql = `INSERT INTO characters(name, initLvl, startClass, vig, mind, end, str, dex, int, faith, arc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = {
    name: req.body.name,
    initLvl: req.body.initLvl,
    startClass: req.body.startClass,
    vig: req.body.vig,
    mind: req.body.mind,
    end: req.body.end,
    str: req.body.str,
    dex: req.body.dex,
    int: req.body.int,
    faith: req.body.faith,
    arc: req.body.arc,
  };

  try {
    DB.run(sql, Object.values(values), function (err) {
      if (err) {
        res.status(468);
        res.json({ code: 468, status: err.message });
        return;
      }
      const newId = this.lastID; // Provides the auto-increment integer id
      res.status(201);
      res.json({ status: 201, message: `Character ${newId} saved` });
    });
  } catch (err) {
    console.log(err.message);
    res.status(500);
    res.json({ code: 500, status: err.message });
  }
});

app.delete("/characters/:id", (req, res) => {
  res.set("content-type", "application/json");

  const charId = req.params.id; // Get the ID from the request parameters
  const sql = `DELETE FROM characters WHERE id = ?`;

  try {
    DB.run(sql, [charId], function (err) {
      // Use DB.run for delete operations
      if (err) {
        console.log(err.message);
        return res.status(500).send({
          code: 500,
          status: "Error deleting character: " + err.message,
        });
      }
      // Check if a row was affected (deleted)
      if (this.changes === 0) {
        return res.status(404).send({
          code: 404,
          status: "Character not found",
        });
      }
      res.send({
        code: 200,
        status: "Character deleted successfully",
      });
    });
  } catch (err) {
    console.log(err.message);
    res.status(467).send({
      code: 467,
      status: err.message,
    });
  }
});

app.listen(8000, err => {
  if (err) {
    console.log("ERROR", err.message);
    return;
  }
  console.log("Server running on port: 8000");
});

export default app;
