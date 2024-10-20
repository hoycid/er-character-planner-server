import sqlite3 from "sqlite3";

const sql3 = sqlite3.verbose();

const connected = err => {
  if (err) {
    console.log(err.message);
    return;
  }
};

let sql = `CREATE TABLE IF NOT EXISTS characters(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  initLvl INTEGER NOT NULL,
  startClass TEXT NOT NULL,
  vig INTEGER NOT NULL,
  mind INTEGER NOT NULL,
  end INTEGER NOT NULL,
  str INTEGER NOT NULL,
  dex INTEGER NOT NULL,
  int INTEGER NOT NULL,
  faith INTEGER NOT NULL,
  arc INTEGER NOT NULL
)`;

const DB = new sqlite3.Database("./mydata.db", sqlite3.OPEN_READWRITE, connected);

DB.run(sql, [], err => {
  if (err) {
    console.log("Error creating characters table");
    return;
  }
});

export { DB };
