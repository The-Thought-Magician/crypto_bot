import WebSocket from 'ws';
import { updateDataStore } from './dataStore.js';
import { notifyClients } from './routes/notifications.js';
import { logInfo, logError } from './utils/logger.js';

const WS_URL = 'wss://pumpportal.fun/api/data';
let ws;

const subscriptions = {
  newTokens: false,
  tokenTrades: new Set(),
  accountTrades: new Set(),
};

function connectWebSocket() {
  ws = new WebSocket(WS_URL);

  ws.on('open', () => {
    logInfo('WebSocket connection established.');
  });

  ws.on('message', async (data) => {
    try {
      const parsed = JSON.parse(data.toString());
      logInfo('Received WebSocket message:', parsed);

      await updateDataStore(parsed); // Update in-memory store
      notifyClients(parsed); // Notify frontend
    } catch (error) {
      logError('Error parsing WebSocket message:', error);
    }
  });

  ws.on('error', (error) => logError('WebSocket error:', error));

  ws.on('close', (code, reason) => {
    logError(`WebSocket closed. Code: ${code}, Reason: ${reason}`);
    setTimeout(connectWebSocket, 5000); // Reconnect after delay
  });
}

function subscribe(method, keys = []) {
  const payload = { method, keys };
  ws.send(JSON.stringify(payload));
  logInfo(`Subscribed to ${method} with keys: ${keys}`);
  trackSubscription(method, keys);
}

function unsubscribe(method, keys = []) {
  const payload = { method: `unsubscribe${method.slice(9)}`, keys };
  ws.send(JSON.stringify(payload));
  logInfo(`Unsubscribed from ${method} with keys: ${keys}`);
  removeSubscription(method, keys);
}

function trackSubscription(method, keys) {
  if (method === 'subscribeNewToken') subscriptions.newTokens = true;
  if (method === 'subscribeTokenTrade') keys.forEach((key) => subscriptions.tokenTrades.add(key));
  if (method === 'subscribeAccountTrade') keys.forEach((key) => subscriptions.accountTrades.add(key));
}

function removeSubscription(method, keys) {
  if (method === 'unsubscribeTokenTrade') keys.forEach((key) => subscriptions.tokenTrades.delete(key));
  if (method === 'unsubscribeAccountTrade') keys.forEach((key) => subscriptions.accountTrades.delete(key));
}

export function listSubscriptions() {
  return {
    newTokens: subscriptions.newTokens,
    tokenTrades: Array.from(subscriptions.tokenTrades),
    accountTrades: Array.from(subscriptions.accountTrades),
  };
}

export function subscribeNewTokens() {
  if (!subscriptions.newTokens) subscribe('subscribeNewToken');
}

export function subscribeTokenTrades(tokenKeys) {
  subscribe('subscribeTokenTrade', tokenKeys);
}

export function unsubscribeTokenTrades(tokenKeys) {
  unsubscribe('subscribeTokenTrade', tokenKeys);
}

export function subscribeAccountTrades(accountKeys) {
  subscribe('subscribeAccountTrade', accountKeys);
}

export function unsubscribeAccountTrades(accountKeys) {
  unsubscribe('subscribeAccountTrade', accountKeys);
}

connectWebSocket();
