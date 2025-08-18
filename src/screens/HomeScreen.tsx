import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {FlashList} from '@shopify/flash-list';

import {MarketItem} from '../components/MarketItem';
import MarketItemSkeleton from '../components/MarketItemSkeleton';
import {TextInput} from '../components/ui/TextInput';

import {useAppSelector} from '../store/store';

import {useTheme as useAppTheme} from '../context/ThemeContext';
import {t} from '../localization';

import ExpandableFilter from '../components/ExpandableFilter';
import ScreenHeader from '../components/ui/ScreenHeader';
import WatchAll from '../components/WatchAll';
import FavoriteSortButton from '../components/ui/FavoriteSortButton';

const HomeScreen = () => {
  const {theme: appTheme} = useAppTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const {prices, loading} = useAppSelector(state => state.home);
  const favoriteSymbols = useAppSelector(state => state.favorites.favorites);

  const [filteredPrices, setFilteredPrices] = useState(prices);

  useEffect(() => {
    let filtered = prices;
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    setFilteredPrices(filtered);
  }, [searchQuery, prices]);

  const sortByFavorites = () => {
    setFilteredPrices(prev => {
      if (!favoriteSymbols.length) return prev;
      return [...prev].sort((a, b) => {
        const aFav = favoriteSymbols.includes(a.symbol);
        const bFav = favoriteSymbols.includes(b.symbol);
        if (aFav === bFav) return 0;
        return aFav ? -1 : 1;
      });
    });
  };

  const renderItem = ({item}: {item: ProcessedPrice}) => {
    if (loading) {
      return (
        <View
          style={{
            marginHorizontal: appTheme.ui.spacing,
            marginTop: appTheme.ui.spacing,
          }}>
          <MarketItemSkeleton />
        </View>
      );
    }

    return (
      <MarketItem
        symbol={item.symbol}
        price={item.price}
        volume={item.volume}
        change={item.change}
        changePercent={item.changePercent}
      />
    );
  };

  return (
    <View
      style={[styles.container, {backgroundColor: appTheme.colors.background}]}>
      <ScreenHeader title={t('markets') || 'Markets'} />

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

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: appTheme.ui.spacing * 2,
          marginTop: appTheme.ui.spacing,
          marginBottom: appTheme.ui.spacing,
        }}>
        <FavoriteSortButton onPress={sortByFavorites} />
        <WatchAll />
      </View>

      <FlashList
        data={loading ? Array(10).fill({}) : filteredPrices}
        renderItem={renderItem}
        estimatedItemSize={60}
        keyExtractor={(item, index) =>
          loading ? `skeleton-${index}` : item.symbol
        }
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
