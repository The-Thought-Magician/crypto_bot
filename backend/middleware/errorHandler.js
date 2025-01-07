export function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${new Date().toISOString()}:`, err.stack);
  res.status(500).json({ error: err.message });
}
