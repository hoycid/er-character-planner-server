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

  let data = [];

  try {
    DB.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }
      rows.forEach(row => {
        data.push({
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

  const requiredFields = [
    "name",
    "initLvl",
    "startClass",
    "vig",
    "mind",
    "end",
    "str",
    "dex",
    "int",
    "faith",
    "arc",
  ];

  const missingFields = requiredFields.filter(field => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      status: 400,
      message: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  const sql = `INSERT INTO characters(name, initLvl, startClass, vig, mind, end, str, dex, int, faith, arc) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    req.body.name,
    req.body.initLvl,
    req.body.startClass,
    req.body.vig,
    req.body.mind,
    req.body.end,
    req.body.str,
    req.body.dex,
    req.body.int,
    req.body.faith,
    req.body.arc,
  ];

  try {
    DB.run(sql, values, function (err) {
      if (err) {
        res.status(468);
        res.json({ code: 468, status: err.message });
        return;
      }
      const newId = this.lastID;
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

// Helper function to map row to desired data format
const mapArmorData = row => ({
  id: row.id,
  name: row.name,
  description: row.description,
  type: row.type,
  negation: row.negation,
  resistance: row.resistance,
  weight: row.weight,
  effect: row.effect,
  acquisition: row.acquisition,
  ingame: row.ingame,
  dlc: row.dlc,
});

// Helper function to handle errors and send responses
const handleError = (err, res) => {
  console.log(err.message);
  res.status(467).send({
    code: 467,
    status: err.message,
  });
};

// Get all talismans
app.get("/talismans/", (req, res) => {
  const sql = `SELECT * FROM talismans`;

  let data = [];

  DB.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach(row => {
      data.push({
        id: row.id,
        name: row.name,
        effect: row.effect,
        value: row.value,
        description: row.description,
        dlc: row.dlc,
        image: row.image,
      });
    });
    let content = JSON.stringify(data);
    res.send(content);
  });
});

// Get all armors
app.get("/armors/", (req, res) => {
  const sql = `SELECT * FROM armors`;

  DB.all(sql, [], (err, rows) => {
    if (err) return handleError(err, res);

    const data = rows.map(mapArmorData);
    res.json(data);
  });
});

// Get specific armor by type and id
app.get("/armors/:type/:id", (req, res) => {
  const { type, id } = req.params;

  if (!type || !id) {
    return res.status(400).send({
      code: 400,
      status: "Type and ID are required.",
    });
  }

  const sql = `SELECT * FROM armors WHERE type = ? AND id = ?`;

  DB.get(sql, [type, id], (err, row) => {
    if (err) return handleError(err, res);

    if (row) {
      const data = mapArmorData(row);
      res.json(data);
    } else {
      res.status(404).send({
        code: 404,
        status: "Armor not found.",
      });
    }
  });
});

// Get armors by type
app.get("/armors/:type", (req, res) => {
  const { type } = req.params;

  const sql = `SELECT * FROM armors WHERE type = ?`;

  DB.all(sql, [type], (err, rows) => {
    if (err) return handleError(err, res);

    if (rows.length) {
      const data = rows.map(mapArmorData);
      res.json(data);
    } else {
      res.status(404).send({
        code: 404,
        status: "No armors found for this type.",
      });
    }
  });
});

app.listen(8000, err => {
  if (err) {
    console.log("ERROR", err.message);
    return;
  }
  console.log("Server running on port: 8000");
});

export default app;
