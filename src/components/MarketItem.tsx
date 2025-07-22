import React from 'react';
import {View, TouchableOpacity} from 'react-native';

import {Switch} from './ui/Switch';
import {useTheme} from '../context/ThemeContext';
import {Text} from './ui/Text';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {t} from '../localization';

import {useAppSelector} from '../store/store';
import {eventBus} from '../middleware/eventMiddleware';

interface MarketItemProps {
  symbol: string;
  price: string;
  volume: string;
  change: string;
  changePercent: string;
  variant?: 'text' | 'contained' | 'outlined';
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
}

export const MarketItem = ({
  symbol,
  price = '0',
  volume = '0',
  change = '0',
  changePercent = '0',
  variant,
}: MarketItemProps) => {
  const theme = useTheme();
  const styles = style(theme.theme);
  const colors = theme.theme.colors;
  const {watchAll, coins, period, percent, loading} = useAppSelector(
    state => state.watchlist,
  );
  const favorites = useAppSelector(state => state.favorites.favorites);
  const isFav = favorites.includes(symbol);
  const switchValue = watchAll
    ? !coins.includes(symbol)
    : coins.includes(symbol);

  const onSwitchChange = (symbol: string) => {
    eventBus.emit('coinSwitched', symbol);
  };

  const onHeartPress = () => {
    if (isFav) {
      eventBus.emit('removeFavorite', symbol);
    } else {
      eventBus.emit('addFavorite', symbol);
    }
  };

  const resolvedVariant = variant || theme.theme.ui.defaultVariant;

  const changeColor =
    parseFloat(changePercent) >= 0 ? colors.green : colors.error;

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        <TouchableOpacity onPress={onHeartPress} style={styles.starButton}>
          <Icon
            name={isFav ? 'favorite' : 'favorite-border'}
            size={22}
            color={isFav ? colors.error : colors.onSurfaceVariant}
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.symbol}>{symbol}</Text>
          <Text style={styles.volume}>{t('volume', {volume})}</Text>
        </View>
      </View>
      <View style={styles.priceCol}>
        <Text style={styles.price}>
          {parseFloat(price).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
        <Text style={[styles.change, {color: changeColor}]}>
          {parseFloat(changePercent) >= 0 ? '+' : ''}
          {changePercent}%
        </Text>
      </View>
      <View style={styles.switchCol}>
        {loading ? (
          <View style={styles.switchSkeleton} />
        ) : (
          <Switch
            value={switchValue}
            onValueChange={() => onSwitchChange(symbol)}
            variant={resolvedVariant}
          />
        )}
      </View>
    </View>
  );
};

const style = (theme: ReturnType<typeof useTheme>['theme']) => ({
  container: {
    backgroundColor: theme.colors.background,
    paddingVertical: theme.ui.spacing * 1.5,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  leftRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
  },
  starButton: {
    marginLeft: theme.ui.spacing * 2,
    marginRight: theme.ui.spacing * 1.75,
  },
  symbol: {
    fontWeight: '700' as const,
    color: theme.colors.text,
    fontSize: theme.ui.fontSize * 1.125,
    letterSpacing: 0.2,
  },
  volume: {
    color: theme.colors.onSurfaceVariant,
    fontSize: theme.ui.fontSize * 0.8125,
    marginTop: 2,
    fontWeight: '400' as const,
  },
  priceCol: {
    alignItems: 'flex-end' as const,
    justifyContent: 'center' as const,
    minWidth: 100,
    marginRight: theme.ui.spacing * 1.5,
  },
  price: {
    fontWeight: '700' as const,
    color: theme.colors.text,
    fontSize: theme.ui.fontSize * 1.25,
    letterSpacing: 0.2,
  },
  change: {
    fontWeight: '700' as const,
    fontSize: theme.ui.fontSize,
    marginTop: 2,
  },
  switchCol: {
    marginRight: theme.ui.spacing * 2,
    marginLeft: theme.ui.spacing,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  switchSkeleton: {
    width: 50,
    height: 28,
    backgroundColor: theme.colors.surface,
    borderRadius: 999,
  },
});
