import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme as useAppTheme} from '../context/ThemeContext';
import {Switch} from './ui/Switch';
import {useTheme} from '../context/ThemeContext';
import {Text} from './ui/Text';

const PRICE_COLOR = '#2E7D32';

interface PriceItemProps {
  coin: string;
  pair: string;
  price: string;
  isFilled?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
}

export const PriceItem = ({
  coin,
  pair,
  price,
  isFilled,
  switchValue,
  onSwitchChange,
}: PriceItemProps) => {
  const theme = useTheme();
  const colors = theme.theme.colors;
  const {theme: appTheme} = useAppTheme();

  const containerStyle = {
    borderRadius: appTheme.ui.radius,
    borderWidth: isFilled ?? appTheme.ui.isFilled ? 0 : appTheme.ui.borderWidth,
    backgroundColor:
      isFilled ?? appTheme.ui.isFilled ? colors.surface : 'transparent',
    borderColor: colors.outline,
    padding: appTheme.ui.spacing,
    elevation: isFilled ?? appTheme.ui.isFilled ? appTheme.ui.elevation : 0,
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.contentContainer}>
        <View style={styles.symbolContainer}>
          <Text
            style={[
              styles.coinText,
              {
                color: colors.onSurface,
              },
            ]}>
            {coin}
          </Text>
          <Text
            style={[
              styles.pairText,
              {
                color: colors.onSurfaceVariant,
                marginLeft: appTheme.ui.spacing / 2,
              },
            ]}>
            {pair}
          </Text>
        </View>
        <Text
          style={[
            styles.price,
            {
              color: PRICE_COLOR,
              fontWeight: '900',
            },
          ]}>
          {parseFloat(price).toFixed(2)}
        </Text>
      </View>
      {switchValue !== undefined && onSwitchChange && (
        <Switch value={switchValue} onValueChange={onSwitchChange} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
  },
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinText: {
    fontWeight: '700',
  },
  pairText: {
    fontWeight: '400',
  },
  price: {
    marginTop: 4,
  },
});
