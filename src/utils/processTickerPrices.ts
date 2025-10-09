export const processTickerPrices = (data: BinanceTickerPrice[]) => {
  const filteredData = data.filter(item => item.symbol.includes('USDT'));
  return filteredData.map(item => ({
    symbol: item.symbol,
    price: item.lastPrice,
    volume: item.quoteVolume,
    change: item.priceChange,
    changePercent: item.priceChangePercent,
  }));
};
