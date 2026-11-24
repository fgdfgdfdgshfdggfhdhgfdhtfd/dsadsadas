export default function handler(req, res) {
  const { type, platform } = req.query;
  // Questo messaggio apparirà finalmente nella dashboard LOGS di Vercel
  console.log(`[USER_EVENT] Tipo: ${type} | Piattaforma: ${platform}`);
  res.status(200).json({ success: true });
}