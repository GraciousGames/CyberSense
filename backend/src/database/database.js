import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = dirname(currentFilePath);

const databaseDirectory = resolve(
  currentDirectory,
  "../../database"
);

mkdirSync(databaseDirectory, {
  recursive: true
});

const databasePath = resolve(
  databaseDirectory,
  "cybersense.sqlite"
);

const database = new DatabaseSync(databasePath);

database.exec("PRAGMA foreign_keys = ON");

export default database;