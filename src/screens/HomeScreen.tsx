import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {binanceService, BinanceTickerPrice} from '../service/externalServices';
import {TextInput} from '../components/ui/TextInput';
import {Dropdown} from '../components/ui/Dropdown';
import {PriceItem} from '../components/PriceItem';

const pairs = [
  'USDC',
  'USDT',
  'FDUSDT',
  'BNB',
  'BTC',
  'ETH',
  'TUSD',
  'DAI',
  'XRP',
  'TRX',
  'DOGE',
  'EURI',
  'SOL',
  'TRY',
  'EUR',
  'BRL',
  'ARS',
  'COP',
  'CZK',
  'JPY',
  'MXN',
  'PLN',
  'RON',
  'UAH',
  'ZAR',
];

const pairItems = [
  {label: 'All', value: ''},
  ...pairs.map(pair => ({
    label: pair,
    value: pair,
  })),
];

interface ProcessedPrice {
  symbol: string;
  coin: string;
  pair: string;
  price: string;
}

const HomeScreen = () => {
  const [prices, setPrices] = useState<ProcessedPrice[]>([]);
  const [filteredPrices, setFilteredPrices] = useState<ProcessedPrice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPair, setSelectedPair] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrices();
  }, []);

  useEffect(() => {
    let filtered = prices;

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedPair) {
      filtered = filtered.filter(item => item.pair === selectedPair);
    }

    setFilteredPrices(filtered);
  }, [searchQuery, prices, selectedPair]);

  const processPriceData = (data: BinanceTickerPrice[]): ProcessedPrice[] => {
    return data.map(item => {
      const pair = pairs.find(p => item.symbol.endsWith(p)) || '';
      const coin = item.symbol.replace(pair, '');
      return {
        symbol: item.symbol,
        coin,
        pair,
        price: item.price,
      };
    });
  };

  const fetchPrices = async () => {
    try {
      const data = await binanceService.getTickerPrices();
      const processedData = processPriceData(data);
      setPrices(processedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching prices:', error);
      setLoading(false);
    }
  };

  const renderItem = ({item}: {item: ProcessedPrice}) => (
    <PriceItem coin={item.coin} pair={item.pair} price={item.price} />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by symbol..."
          leftIcon={{name: 'search'}}
        />
        <Dropdown
          selectedValue={selectedPair}
          onSelect={setSelectedPair}
          items={pairItems}
          placeholder="Select Pair"
        />
      </View>
      <FlashList
        data={filteredPrices}
        renderItem={renderItem}
        estimatedItemSize={60}
        keyExtractor={item => item.symbol}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    padding: 16,
    gap: 8,
  },
  listContainer: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
});

export default HomeScreen;
