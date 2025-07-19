import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {FlashList} from '@shopify/flash-list';

import {binanceService, BinanceTickerPrice} from '../service/externalServices';
import {MarketItem} from '../components/MarketItem';
import {TextInput} from '../components/ui/TextInput';

import {useAppSelector} from '../store/store';

import {useTheme as useAppTheme} from '../context/ThemeContext';
import {t} from '../localization';

import ExpandableFilter from '../components/ExpandableFilter';
import HomeHeader from '../components/HomeHeader';

interface ProcessedPrice {
  symbol: string;
  price: string;
  volume: string;
  change: string;
  changePercent: string;
  isFavorite: boolean;
  switchValue: boolean;
}

interface HomeScreenProps {
  onNavigateToChat: () => void;
}

const HomeScreen = ({onNavigateToChat}: HomeScreenProps) => {
  const {theme: appTheme} = useAppTheme();
  const [prices, setPrices] = useState<ProcessedPrice[]>([]);
  const [filteredPrices, setFilteredPrices] = useState<ProcessedPrice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

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

    setFilteredPrices(filtered);
  }, [searchQuery, prices]);

  const processPriceData = (data: BinanceTickerPrice[]): ProcessedPrice[] => {
    return data.map(item => ({
      symbol: item.symbol,
      price: item.price,
      volume: (Math.random() * 1000).toFixed(2),
      change: (Math.random() * 100).toFixed(2),
      changePercent: (Math.random() * 5).toFixed(2),
      isFavorite: Math.random() > 0.5,
      switchValue: Math.random() > 0.5,
    }));
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
    <MarketItem
      symbol={item.symbol}
      price={item.price}
      volume={item.volume}
      change={item.change}
      changePercent={item.changePercent}
      isFavorite={item.isFavorite}
      onStarPress={() => {}}
      switchValue={item.switchValue}
      onSwitchChange={() => {}}
    />
  );

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {backgroundColor: appTheme.colors.background},
        ]}>
        <ActivityIndicator size="large" color={appTheme.colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, {backgroundColor: appTheme.colors.background}]}>
      <HomeHeader
        onNavigateToChat={onNavigateToChat}
        hasNewMessages={hasNewMessages}
        appTheme={appTheme}
      />

      <View style={{paddingHorizontal: appTheme.ui.spacing * 2}}>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('search_by_symbol')}
          leftIcon="magnify"
          rightIcon={searchQuery ? 'close' : undefined}
          onRightIconPress={() => setSearchQuery('')}
        />
      </View>

      <ExpandableFilter />

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 60,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    gap: 16,
  },
  expandableContainer: {
    borderBottomWidth: 1,
  },
});

export default HomeScreen;
