import express from 'express';
import { getDataStore } from '../dataStore.js';
import { filterTradesByVolume } from '../utils/filters.js';

const router = express.Router();

router.get('/', (req, res) => {
  const { minVolume } = req.query;
  const trades = Object.values(getDataStore().tokenTrades).flat();

  const filteredTrades = minVolume ? filterTradesByVolume(trades, Number(minVolume)) : trades;
  res.json(filteredTrades);
});

export default router;
