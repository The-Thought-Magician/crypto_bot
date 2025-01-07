import express from 'express';
import { getDataStore } from '../dataStore.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(getDataStore().accountTrades);
});

export default router;
