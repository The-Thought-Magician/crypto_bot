import mongoose from 'mongoose';

const tradeSchema = new mongoose.Schema({
  name: String,
  symbol: String,
  uri: String,
  mint: String,
  marketCapSol: Number,
  initialBuy: Number,
  pool: String,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Trade', tradeSchema);
