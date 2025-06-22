import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTheme, Surface, IconButton} from 'react-native-paper';
import {binanceService, BinanceTickerPrice} from '../service/externalServices';
import {PriceItem} from '../components/PriceItem';
import {TextInput} from '../components/ui/TextInput';
import {Dropdown} from '../components/ui/Dropdown';
import {useAppDispatch, useAppSelector} from '../store/store';

import {useTheme as useAppTheme} from '../context/ThemeContext';
import {setHasNewMessages} from '../store/slices/chatSlice';

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

interface HomeScreenProps {
  onNavigateToChat: () => void;
}

const HomeScreen = ({onNavigateToChat}: HomeScreenProps) => {
  const theme = useTheme();
  const {theme: appTheme} = useAppTheme();
  const [prices, setPrices] = useState<ProcessedPrice[]>([]);
  const [filteredPrices, setFilteredPrices] = useState<ProcessedPrice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPair, setSelectedPair] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const hasNewMessages = useAppSelector(state => state.chat.hasNewMessages);

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
    <View style={{marginBottom: appTheme.ui.spacing}}>
      <PriceItem
        coin={item.coin}
        pair={item.pair}
        price={item.price}
        switchValue={true}
        onSwitchChange={() => {}}
      />
    </View>
  );

  if (loading) {
    return (
      <Surface
        style={[
          styles.loadingContainer,
          {backgroundColor: appTheme.colors.background},
        ]}>
        <ActivityIndicator size="large" color={appTheme.colors.primary} />
      </Surface>
    );
  }

  return (
    <Surface
      style={[styles.container, {backgroundColor: appTheme.colors.background}]}>
      <View
        style={[
          styles.headerContainer,
          {
            padding: appTheme.ui.spacing,
            borderBottomWidth: appTheme.ui.borderWidth,
            borderBottomColor: appTheme.colors.outline,
          },
        ]}>
        <View style={{position: 'relative'}}>
          <IconButton
            icon="chat-outline"
            size={24}
            onPress={onNavigateToChat}
            iconColor={appTheme.colors.primary}
            style={styles.chatButton}
          />
          {hasNewMessages && (
            <View
              style={{
                position: 'absolute',
                top: 7,
                right: 7,
                backgroundColor: 'red',
                width: 10,
                height: 10,
                borderRadius: 100,
              }}
            />
          )}
        </View>
      </View>
      <View
        style={[
          styles.filterContainer,
          {padding: appTheme.ui.spacing * 2, gap: appTheme.ui.spacing * 2},
        ]}>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by symbol..."
          leftIcon="magnify"
          rightIcon={searchQuery ? 'close' : undefined}
          onRightIconPress={() => setSearchQuery('')}
        />
        <Dropdown
          selectedValue={selectedPair}
          onSelect={setSelectedPair}
          items={pairItems}
          placeholder="Select Pair"
          label="Pair"
        />
      </View>
      <FlashList
        data={filteredPrices}
        renderItem={renderItem}
        estimatedItemSize={60}
        keyExtractor={item => item.symbol}
        contentContainerStyle={{
          paddingTop: 5,
          paddingHorizontal: appTheme.ui.spacing * 2,
        }}
      />
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 60,
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  chatButton: {
    margin: 0,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    gap: 16,
  },
});

export default HomeScreen;
