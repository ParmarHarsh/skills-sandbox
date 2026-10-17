const MAIL_API_KEY = process.env.MAIL_API_KEY;
const MAIL_FROM = process.env.MAIL_FROM || "digest@pebble.example";

async function sendDigest(user) {
  const res = await fetch("https://api.mail.example/v1/send", {
    method: "POST",
    headers: { authorization: `Bearer ${MAIL_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({ from: MAIL_FROM, to: user.id, template: "weekly-digest" }),
  });
  if (!res.ok) throw new Error(`mail failed: ${res.status}`);
}

module.exports = { sendDigest };
