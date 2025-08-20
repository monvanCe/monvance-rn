import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';

interface PriceTagProps {
  price?: string;
  originalPrice?: string;
  periodText?: string;
  containerStyle?: ViewStyle;
}

const PriceTag: React.FC<PriceTagProps> = ({
  price,
  originalPrice,
  periodText,
  containerStyle,
}) => {
  const hasDiscount = Boolean(originalPrice && price);

  return (
    <View style={[styles.priceContainer, containerStyle]}>
      {hasDiscount && <Text style={styles.originalPrice}>{originalPrice}</Text>}
      <Text style={hasDiscount ? styles.discountedPrice : styles.price}>
        {price}
      </Text>
      {!!periodText && <Text style={styles.periodText}>{periodText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  priceContainer: {
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
  price: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  originalPrice: {
    color: '#999',
    fontSize: 14,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  discountedPrice: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  periodText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '400',
  },
});

export default PriceTag;
