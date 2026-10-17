const http = require("node:http");
const { getNote, searchNotes, deleteNote } = require("./db");
const { readSession } = require("./session");
const { sendDigest } = require("./mailer");

const PORT = Number(process.env.PORT || 3000);
const MAX_NOTE_BYTES = Number(process.env.NOTES_MAX_BYTES || 65536);

function send(res, status, body) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}

const server = http.createServer(async (req, res) => {
  const user = readSession(req);
  if (!user) return send(res, 401, { error: "sign in" });
  const url = new URL(req.url, "http://localhost");

  const noteMatch = url.pathname.match(/^\/api\/notes\/(\d+)$/);
  if (noteMatch && req.method === "GET") {
    const note = await getNote(noteMatch[1]);
    return note ? send(res, 200, note) : send(res, 404, { error: "not found" });
  }
  if (noteMatch && req.method === "DELETE") {
    await deleteNote(noteMatch[1]);
    return send(res, 204, {});
  }
  if (url.pathname === "/api/search") {
    const q = url.searchParams.get("q") || "";
    return send(res, 200, await searchNotes(user.id, q));
  }
  if (url.pathname === "/api/digest" && req.method === "POST") {
    await sendDigest(user);
    return send(res, 202, { queued: true });
  }
  send(res, 404, { error: "no route" });
});

server.listen(PORT, () => console.log(`pebble-notes on ${PORT}, max note ${MAX_NOTE_BYTES} bytes`));
