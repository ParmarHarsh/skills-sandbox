const crypto = require("node:crypto");

const SESSION_SECRET = process.env.SESSION_SECRET || "pebble-dev-secret";

function sign(value) {
  return crypto.createHmac("sha256", SESSION_SECRET).update(value).digest("hex");
}

function readSession(req) {
  const cookie = (req.headers.cookie || "").split("; ").find((c) => c.startsWith("sid="));
  if (!cookie) return null;
  const [userId, sig] = cookie.slice(4).split(".");
  const expected = Buffer.from(sign(userId));
  const given = Buffer.from(sig || "");
  if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) return null;
  return { id: Number(userId) };
}

module.exports = { readSession, sign };
