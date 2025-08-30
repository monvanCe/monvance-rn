import React from 'react';
import {View, StyleSheet} from 'react-native';

const PackageSkeleton = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.checkIcon} />
        <View style={styles.savingsBadge} />
        <View style={styles.planHeader}>
          <View style={styles.planBadge} />
          <View style={styles.priceContainer}>
            <View style={styles.price} />
            <View style={styles.period} />
          </View>
        </View>
        <View style={styles.description} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 18,
    padding: 12,
    position: 'relative',
  },
  checkIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 32,
    height: 32,
    backgroundColor: '#333',
    borderRadius: 16,
  },
  savingsBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 80,
    height: 24,
    backgroundColor: '#333',
    borderRadius: 20,
  },
  planHeader: {
    marginTop: 50,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  planBadge: {
    width: 100,
    height: 32,
    backgroundColor: '#333',
    borderRadius: 8,
    marginBottom: 16,
  },
  priceContainer: {
    alignItems: 'flex-end',
    gap: 8,
  },
  price: {
    width: 80,
    height: 20,
    backgroundColor: '#333',
    borderRadius: 4,
  },
  period: {
    width: 60,
    height: 16,
    backgroundColor: '#333',
    borderRadius: 4,
  },
  description: {
    width: '100%',
    height: 16,
    backgroundColor: '#333',
    borderRadius: 4,
  },
});

export default PackageSkeleton;
