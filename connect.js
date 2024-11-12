import sqlite3 from "sqlite3";

const sql3 = sqlite3.verbose();

const connected = err => {
  if (err) {
    console.log(err.message);
    return;
  }
};

let createCharactersTable = `CREATE TABLE IF NOT EXISTS characters(
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

let createArmorsTable = `CREATE TABLE IF NOT EXISTS armors(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  negation TEXT NOT NULL,
  resistance TEXT NOT NULL,
  weight FLOAT NOT NULL,
  effect TEXT NOT NULL,
  acquisition TEXT NOT NULL,
  ingame INTEGER NOT NULL,
  dlc TEXT NOT NULL
)`;

let createTalismansTable = `CREATE TABLE IF NOT EXISTS talismans(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  effect TEXT NOT NULL,
  weight FLOAT NOT NULL,
  value INTEGER NOT NULL,
  description TEXT NOT NULL,
  dlc TEXT NOT NULL,
  image TEXT NOT NULL
)`;

const DB = new sqlite3.Database(
  "./mydata.db",
  sqlite3.OPEN_READWRITE,
  connected
);

const createTables = () => {
  DB.run(createCharactersTable, [], err => {
    if (err) {
      console.log("Error creating characters table");
      return;
    }
  });

  DB.run(createArmorsTable, [], err => {
    if (err) {
      console.log("Error creating armors table");
      return;
    }
  });

  DB.run(createTalismansTable, [], err => {
    if (err) {
      console.log("Error creating talismans table");
      return;
    }
  });
};

export { DB };
