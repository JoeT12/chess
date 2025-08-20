import { Pool } from "pg";
import {
  databaseHost,
  databaseName,
  databasePassword,
  databaseUser,
  numDatabaseThreads,
} from "../config/env.js";
import { DatabaseError } from "../utils/apiError.js";

const pool = new Pool({
  host: databaseHost,
  database: databaseName,
  user: databaseUser,
  password: databasePassword,
  max: numDatabaseThreads,
});

pool.on("connect", () => {
  console.log("Postgres Connection Established.");
});

pool.on("error", (error) => {
  console.log(`Error connecting to Postgres... ${error}`);
});

export const query = async (text, params) => {
  try {
    return await pool.query(text, params);
  } catch (err) {
    if (err.code === "ECONNREFUSED") {
      throw new DatabaseError("Cannot connect to database");
    }
    throw err;
  }
};
