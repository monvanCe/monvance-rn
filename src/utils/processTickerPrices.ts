export const processTickerPrices = (data: BinanceTickerPrice[]) => {
  const filteredData = data.filter(item => item.symbol.includes('USDT'));
  return filteredData.map(item => ({
    symbol: item.symbol,
    price: item.price,
    volume: (Math.random() * 1000).toFixed(2),
    change: (Math.random() * 100).toFixed(2),
    changePercent: (Math.random() * 5).toFixed(2),
    isFavorite: Math.random() > 0.5,
    switchValue: Math.random() > 0.5,
  }));
};
