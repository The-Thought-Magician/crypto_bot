export function calculateVolumeTrends(trades) {
  const volumes = trades.map((trade) => trade.volume);
  const totalVolume = volumes.reduce((acc, vol) => acc + vol, 0);
  const averageVolume = totalVolume / trades.length;

  return {
    totalVolume,
    averageVolume,
  };
}

export function identifyTopPerformers(trades, topN = 5) {
  return trades
    .sort((a, b) => b.volume - a.volume)
    .slice(0, topN);
}
