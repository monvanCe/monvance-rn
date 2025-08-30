import React from 'react';
import {View, StyleSheet} from 'react-native';

const BenefitsSkeleton = () => {
  return (
    <View style={[styles.container, {opacity: 0.2}]}>
      <View style={styles.titleSkeleton} />
      <View style={styles.benefitsContainer}>
        {[1, 2, 3, 4].map(item => (
          <View key={item} style={styles.benefitItem}>
            <View style={styles.benefitIcon} />
            <View style={styles.benefitText} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 12,
  },
  titleSkeleton: {
    width: 200,
    height: 24,
    backgroundColor: '#16C784',
    borderRadius: 4,
    marginBottom: 16,
  },
  benefitsContainer: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#16C784',
    borderRadius: 12,
  },
  benefitText: {
    flex: 1,
    height: 16,
    backgroundColor: '#16C784',
    borderRadius: 4,
  },
});

export default BenefitsSkeleton;
