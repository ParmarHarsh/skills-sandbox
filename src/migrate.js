const fs = require("node:fs");
const path = require("node:path");
const { pool } = require("./db");

(async () => {
  const dir = path.join(__dirname, "..", "migrations");
  for (const file of fs.readdirSync(dir).sort()) {
    await pool.query(fs.readFileSync(path.join(dir, file), "utf8"));
    console.log("applied", file);
  }
  await pool.end();
})();
