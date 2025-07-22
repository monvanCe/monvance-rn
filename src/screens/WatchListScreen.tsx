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
  const styles = style(appTheme);

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
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{t('watchlist') || 'Watchlist'}</Text>
        <NotificationIcon />
      </View>

      <ExpandableFilter />

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

const style = (appTheme: ReturnType<typeof useAppTheme>['theme']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appTheme.colors.background,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: appTheme.ui.spacing * 3,
      paddingTop: appTheme.ui.spacing * 3,
      paddingBottom: appTheme.ui.spacing * 2,
    },
    headerTitle: {
      fontSize: appTheme.ui.spacing * 3.5,
      fontWeight: '700',
    },
  });

export default WatchListScreen;
