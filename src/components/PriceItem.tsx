import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface PriceItemProps {
  coin: string;
  pair: string;
  price: string;
}

export const PriceItem = ({coin, pair, price}: PriceItemProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.symbolContainer}>
        <Text style={styles.coinText}>{coin}</Text>
        <Text style={styles.pairText}>{pair}</Text>
      </View>
      <Text style={styles.price}>{parseFloat(price).toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  pairText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  price: {
    fontSize: 16,
    color: '#666',
  },
});
