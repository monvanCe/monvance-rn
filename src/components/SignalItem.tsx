import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../context/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {useAppSelector} from '../store/store';
import {ROUTE_NAMES} from '../const/routeNames';

interface SignalItemProps {
  signal: ISignal;
}

const SignalItem: React.FC<SignalItemProps> = ({signal}) => {
  const {theme} = useTheme();
  const navigation = useNavigation<any>();
  const appLang = useAppSelector(state => state.appConfig.appLanguage);

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const formatChangePercent = (percent: number) => {
    return `${signal.isIncrease ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(appLang, {
      month: 'short',
      day: '2-digit',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={() =>
        navigation.navigate(ROUTE_NAMES.COIN_DETAILS, {coin: signal.coin})
      }>
      <View style={styles.header}>
        <Text style={[styles.coinName, {color: theme.colors.text}]}>
          {signal.coin}
        </Text>
        <View
          style={[
            styles.changeContainer,
            {
              backgroundColor: signal.isIncrease
                ? theme.colors.ascent
                : theme.colors.descent,
            },
          ]}>
          <Icon
            name={signal.isIncrease ? 'trending-up' : 'trending-down'}
            size={12}
            color={theme.colors.text}
          />
          <Text style={[styles.changeText, {color: theme.colors.text}]}>
            {formatChangePercent(signal.changePercent)}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.priceContainer}>
          <Text
            style={[styles.priceLabel, {color: theme.colors.textSecondary}]}>
            Current Price
          </Text>
          <Text style={[styles.priceValue, {color: theme.colors.text}]}>
            ${formatPrice(signal.currentPrice)}
          </Text>
        </View>

        <View style={styles.priceContainer}>
          <Text
            style={[styles.priceLabel, {color: theme.colors.textSecondary}]}>
            Previous Price
          </Text>
          <Text style={[styles.priceValue, {color: theme.colors.text}]}>
            ${formatPrice(signal.previousPrice)}
          </Text>
        </View>
        <View style={{justifyContent: 'flex-end'}}>
          <Text style={[styles.timeText, {color: theme.colors.textSecondary}]}>
            {formatTime(signal.periodStartTime)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  coinName: {
    fontSize: 18,
    fontWeight: '600',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  periodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  periodText: {
    fontSize: 12,
  },
  timeText: {
    fontSize: 12,
  },
});

export default SignalItem;
