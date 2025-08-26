import React from 'react';
import {View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Text} from './Text';
import {useTheme} from '../../context/ThemeContext';

interface BenefitsListProps {
  benefits: string[];
  title?: string;
  showIcon?: boolean;
  style?: any;
}

const BenefitsList: React.FC<BenefitsListProps> = ({
  benefits,
  title,
  showIcon = true,
  style,
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  if (!benefits || benefits.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      {title && (
        <View style={styles.header}>
          {showIcon && (
            <View style={styles.headerIcon}>
              <Icon name="star" size={14} color="#16C784" />
            </View>
          )}
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
      <View style={styles.benefitsList}>
        {benefits.map((benefit, index) => (
          <View key={index} style={styles.benefitItem}>
            <View style={styles.checkIcon}>
              <Icon name="check" size={12} color="#16C784" />
            </View>
            <Text style={styles.benefitText}>{benefit}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const createStyles = (_theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      backgroundColor: 'rgba(0, 0, 0, 0.25)',
      borderRadius: 14,
      padding: 12,
      borderWidth: 1,
      borderColor: 'rgba(22, 199, 132, 0.2)',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
      paddingBottom: 6,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(22, 199, 132, 0.1)',
    },
    headerIcon: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: 'rgba(22, 199, 132, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    title: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
    benefitsList: {
      gap: 6,
    },
    benefitItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 10,
      backgroundColor: 'rgba(22, 199, 132, 0.08)',
      borderRadius: 8,
      borderLeftWidth: 3,
      borderLeftColor: '#16C784',
    },
    checkIcon: {
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: 'rgba(22, 199, 132, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    benefitText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 18,
      flex: 1,
    },
  });

export default BenefitsList; 