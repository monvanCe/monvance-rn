import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../context/ThemeContext';

const MarketItemSkeleton = () => {
  const theme = useTheme();
  const colors = theme.theme.colors;

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: 60,
      backgroundColor: colors.surface,
      borderRadius: theme.theme.ui.radius,
    },
  });
  return <View style={styles.container} />;
};

export default MarketItemSkeleton;
