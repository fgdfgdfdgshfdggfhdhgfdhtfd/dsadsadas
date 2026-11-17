// Funzione Vercel: /api/log?type=...&platform=...
// Il messaggio appare nella dashboard LOGS di Vercel.
module.exports = function handler(req, res) {
  const { type, platform } = req.query;
  console.log(`[USER_EVENT] Tipo: ${type} | Piattaforma: ${platform}`);
  res.status(200).json({ success: true });
};
