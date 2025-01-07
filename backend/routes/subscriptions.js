import express from 'express';
import {
  subscribeNewTokens,
  unsubscribeTokenTrades,
  subscribeTokenTrades,
  subscribeAccountTrades,
  unsubscribeAccountTrades,
} from '../wsManager.js';

const router = express.Router();

router.post('/', (req, res) => {
  const { type, keys } = req.body;

  try {
    if (type === 'newTokens') {
      subscribeNewTokens();
    } else if (type === 'tokenTrades') {
      subscribeTokenTrades(keys);
    } else if (type === 'accountTrades') {
      subscribeAccountTrades(keys);
    } else {
      return res.status(400).json({ error: 'Invalid subscription type' });
    }

    res.status(200).json({ message: 'Subscription added', type, keys });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/', (req, res) => {
  const { type, keys } = req.body;

  try {
    if (type === 'tokenTrades') {
      unsubscribeTokenTrades(keys);
    } else if (type === 'accountTrades') {
      unsubscribeAccountTrades(keys);
    } else {
      return res.status(400).json({ error: 'Invalid unsubscription type' });
    }

    res.status(200).json({ message: 'Unsubscription successful', type, keys });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
