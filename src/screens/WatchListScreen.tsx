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
import ScreenHeader, {HeaderAction} from '../components/ui/ScreenHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
    }, [prices, coins, watchAll]),
  );

  const renderItem = ({item}: {item: any}) => (
    <MarketItem
      symbol={item.symbol}
      price={item.price}
      volume={item.volume}
      change={item.change}
      changePercent={item.changePercent}
    />
  );

  const headerActions: HeaderAction[] = [
    /*
    {
      iconName: 'filter-list',
      onPress: () => {
        // Add filter action here
        console.log('Filter pressed');
      },
    },
    */
  ];

  return (
    <View style={styles.container}>
      <ScreenHeader 
        title={t('watchlist') || 'Watchlist'} 
        actions={headerActions}
      />

      <ExpandableFilter />

      {filteredPrices.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon
            name="visibility-off"
            size={appTheme.ui.spacing * 8}
            color={appTheme.colors.onSurfaceDisabled}
          />
          <Text
            style={[
              styles.emptyText,
              {color: appTheme.colors.onSurfaceDisabled},
            ]}>
            {t('no_coins_active') || 'Hiçbir coin aktif değil.'}
          </Text>
        </View>
      ) : (
        <FlashList
          data={filteredPrices}
          renderItem={renderItem}
          estimatedItemSize={60}
          keyExtractor={item => item.symbol}
          contentContainerStyle={{paddingBottom: 60}}
        />
      )}
    </View>
  );
};

const style = (appTheme: ReturnType<typeof useAppTheme>['theme']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appTheme.colors.background,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
    },
    emptyText: {
      fontSize: 16,
      marginTop: 16,
      textAlign: 'center',
    },
  });

export default WatchListScreen;
