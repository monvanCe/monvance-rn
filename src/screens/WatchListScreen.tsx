import React, {useCallback, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTheme as useAppTheme} from '../context/ThemeContext';
import {Text} from '../components/ui/Text';
import {t} from '../localization';
import ExpandableFilter from '../components/ExpandableFilter';
import {MarketItem} from '../components/MarketItem';
import {useAppSelector} from '../store/store';
import {useFocusEffect} from '@react-navigation/native';
import NotificationIcon from '../components/NotificationIcon';

const WatchListScreen = () => {
  const {theme: appTheme} = useAppTheme();
  const {prices} = useAppSelector(state => state.home);
  const {watchAll, coins} = useAppSelector(state => state.watchlist);
  const [filteredPrices, setFilteredPrices] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      setFilteredPrices(
        prices.filter(item =>
          watchAll ? !coins.includes(item.symbol) : coins.includes(item.symbol),
        ),
      );
    }, []),
  );

  const renderItem = ({item}: {item: any}) => (
    <MarketItem
      symbol={item.symbol}
      price={item.price}
      volume={item.volume}
      change={item.change}
      changePercent={item.changePercent}
      isFavorite={item.isFavorite}
      onStarPress={() => {}}
    />
  );

  return (
    <View
      style={[styles.container, {backgroundColor: appTheme.colors.background}]}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{t('watchlist') || 'Watchlist'}</Text>
        <NotificationIcon />
      </View>
      {/* ExpandableFilter */}
      <ExpandableFilter />
      {/* MarketItems List */}
      <FlashList
        data={filteredPrices}
        renderItem={renderItem}
        estimatedItemSize={60}
        keyExtractor={item => item.symbol}
        contentContainerStyle={{paddingBottom: 60}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  notificationButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 100,
    padding: 10,
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FF5252',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    paddingHorizontal: 3,
  },
  unreadText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 11,
  },
});

export default WatchListScreen;
