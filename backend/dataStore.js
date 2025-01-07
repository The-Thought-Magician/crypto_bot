import Trade from './models/trade.js';

const dataStore = {
  newTokens: [],
  tokenTrades: {},
  accountTrades: {},
};

export async function updateDataStore(message) {
  const { type, data } = message;

  switch (type) {
    case 'newToken':
      dataStore.newTokens.push(data);
      await saveTradeData(data); // Persist new tokens
      break;

    case 'tokenTrade':
      const token = data.tokenId;
      if (!dataStore.tokenTrades[token]) {
        dataStore.tokenTrades[token] = [];
      }
      dataStore.tokenTrades[token].push(data);
      await saveTradeData(data); // Persist token trades
      break;

    case 'accountTrade':
      const account = data.accountId;
      if (!dataStore.accountTrades[account]) {
        dataStore.accountTrades[account] = [];
      }
      dataStore.accountTrades[account].push(data);
      await saveTradeData(data); // Persist account trades
      break;

    default:
      console.warn('Unhandled message type:', type);
  }
}

export function getDataStore() {
  return dataStore;
}

export function queryTradesByToken(tokenId) {
  return dataStore.tokenTrades[tokenId] || [];
}

export function queryAccountTrades(accountId) {
  return dataStore.accountTrades[accountId] || [];
}

export function cleanupStaleData(maxAgeMinutes = 60) {
  const now = Date.now();
  const cutoffTime = now - maxAgeMinutes * 60 * 1000;

  dataStore.newTokens = dataStore.newTokens.filter((token) => new Date(token.timestamp).getTime() >= cutoffTime);

  for (const token in dataStore.tokenTrades) {
    dataStore.tokenTrades[token] = dataStore.tokenTrades[token].filter(
      (trade) => new Date(trade.timestamp).getTime() >= cutoffTime
    );
  }

  for (const account in dataStore.accountTrades) {
    dataStore.accountTrades[account] = dataStore.accountTrades[account].filter(
      (trade) => new Date(trade.timestamp).getTime() >= cutoffTime
    );
  }
}

export async function saveTradeData(trade) {
  try {
    const savedTrade = await Trade.create(trade);
    console.log('Trade data saved:', savedTrade);
  } catch (error) {
    console.error('Error saving trade data:', error);
  }
}
