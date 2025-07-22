import React from 'react';
import {
  View,
  ViewStyle,
  FlexAlignType,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

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
  isFavorite?: boolean;
  onStarPress?: () => void;
}

export const MarketItem = ({
  symbol,
  price = '0',
  volume = '0',
  change = '0',
  changePercent = '0',
  variant,
  isFavorite = false,
  onStarPress = () => {},
}: MarketItemProps) => {
  const theme = useTheme();
  const colors = theme.theme.colors;
  const {watchAll, coins, period, percent, loading} = useAppSelector(
    state => state.watchlist,
  );
  const switchValue = watchAll
    ? !coins.includes(symbol)
    : coins.includes(symbol);

  const onSwitchChange = (symbol: string) => {
    eventBus.emit('coinSwitched', symbol);
  };

  const resolvedVariant = variant || theme.theme.ui.defaultVariant;

  const containerStyle: ViewStyle = {
    borderRadius: 0,
    borderWidth: 0,
    backgroundColor: colors.background,
    paddingVertical: theme.theme.ui.spacing * 1.5,
    paddingHorizontal: 0,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center' as FlexAlignType,
    justifyContent: 'space-between' as ViewStyle['justifyContent'],
    minHeight: 64,
  };

  const changeColor =
    parseFloat(changePercent) >= 0 ? colors.green : colors.error;

  return (
    <View style={[containerStyle]}>
      <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
        <TouchableOpacity
          onPress={onStarPress}
          style={{marginLeft: 16, marginRight: 14}}>
          <Icon
            name={isFavorite ? 'star' : 'star-border'}
            size={22}
            color={isFavorite ? colors.premium : colors.onSurfaceVariant}
          />
        </TouchableOpacity>
        <View>
          <Text
            style={{
              fontWeight: '700',
              color: colors.text,
              fontSize: 18,
              letterSpacing: 0.2,
            }}>
            {symbol}
          </Text>
          <Text
            style={{
              color: colors.onSurfaceVariant,
              fontSize: 13,
              marginTop: 2,
              fontWeight: '400',
            }}>
            {t('volume', {volume})}
          </Text>
        </View>
      </View>
      <View
        style={{
          alignItems: 'flex-end',
          justifyContent: 'center',
          minWidth: 100,
          marginRight: 12,
        }}>
        <Text
          style={{
            fontWeight: '700',
            color: colors.text,
            fontSize: 20,
            letterSpacing: 0.2,
          }}>
          {parseFloat(price).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
        <Text
          style={{
            color: changeColor,
            fontWeight: '700',
            fontSize: 15,
            marginTop: 2,
          }}>
          {parseFloat(changePercent) >= 0 ? '+' : ''}
          {changePercent}%
        </Text>
      </View>
      <View
        style={{
          marginRight: 16,
          marginLeft: 8,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {loading ? (
          <View
            style={{
              width: 50,
              height: 28,
              backgroundColor: colors.surface,
              borderRadius: 999,
            }}
          />
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
