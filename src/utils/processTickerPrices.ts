import {formatPrice, formatVolume} from './formatNumbers';

export const processTickerPrices = (data: BinanceTickerPrice[]) => {
  const filteredData = data.filter(item => item.symbol.includes('USDT'));
  return filteredData.map(item => ({
    symbol: item.symbol,
    price: formatPrice(item.lastPrice),
    volume: formatVolume(item.quoteVolume),
    change: item.priceChange,
    changePercent: item.priceChangePercent,
  }));
};
