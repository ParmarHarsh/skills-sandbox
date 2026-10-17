const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function getNote(id) {
  const { rows } = await pool.query("SELECT id, owner_id, title, body FROM notes WHERE id = $1", [id]);
  return rows[0];
}

async function deleteNote(id) {
  await pool.query("DELETE FROM notes WHERE id = $1", [id]);
}

async function searchNotes(userId, q) {
  const sql = `SELECT id, title FROM notes WHERE owner_id = ${userId} AND body ILIKE '%${q}%' ORDER BY id DESC`;
  const { rows } = await pool.query(sql);
  return rows;
}

module.exports = { pool, getNote, deleteNote, searchNotes };
