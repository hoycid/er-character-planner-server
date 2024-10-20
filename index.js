import { DB } from "./connect.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8000;

const corsOptions = {
  origin: ["https://er-character-planner-teal.vercel.app/"],
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).send("SQL characters table online");
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
  const id = req.params.id;
  const sql = `SELECT * FROM characters WHERE id = ?`;

  DB.get(sql, [id], (err, row) => {
    if (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ code: 500, status: "Internal Server Error" });
    }
    if (!row) {
      return res.status(404).json({ code: 404, status: "Character not found" });
    }
    res.json({
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
});

app.get("/characters", (req, res) => {
  const sql = `SELECT * FROM characters`;

  DB.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ code: 500, status: "Internal Server Error" });
    }
    const characters = rows.map(row => ({
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
    }));
    res.json({ characters });
  });
});

app.post("/characters", (req, res) => {
  const sql = `INSERT INTO characters(name, initLvl, startClass, vig, mind, end, str, dex, int, faith, arc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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

  DB.run(sql, values, function (err) {
    if (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ code: 500, status: "Internal Server Error" });
    }
    res
      .status(201)
      .json({ status: 201, message: `Character ${this.lastID} saved` });
  });
});

app.delete("/characters/:id", (req, res) => {
  const charId = req.params.id;
  const sql = `DELETE FROM characters WHERE id = ?`;

  DB.run(sql, [charId], function (err) {
    if (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ code: 500, status: "Error deleting character" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ code: 404, status: "Character not found" });
    }
    res.json({ code: 200, status: "Character deleted successfully" });
  });
});

app.listen(PORT, err => {
  if (err) {
    console.log("ERROR", err.message);
    return;
  }
  console.log(`Server running on port: ${PORT}`);
});

export default app;
