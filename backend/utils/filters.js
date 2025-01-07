export function filterTradesByVolume(trades, minVolume) {
  return trades.filter((trade) => trade.volume >= minVolume);
}

export function filterTokensByCreationDate(tokens, sinceDate) {
  return tokens.filter((token) => new Date(token.creationDate) >= new Date(sinceDate));
}
