import express from 'express';
import { getDataStore } from '../dataStore.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(getDataStore().newTokens);
});

router.post('/unsubscribe', (req, res) => {
  const { tokenKeys } = req.body;
  unsubscribeTokenTrades(tokenKeys);
  res.json({ message: 'Unsubscribed from tokens', tokenKeys });
});

export default router;
