import React from 'react';
import {View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Text} from './Text';
import {useTheme} from '../../context/ThemeContext';

interface BenefitsListProps {
  benefits: string[];
  title?: string;
  showIcon?: boolean;
  compact?: boolean;
  style?: any;
}

const BenefitsList: React.FC<BenefitsListProps> = ({
  benefits,
  title,
  showIcon = true,
  compact = false,
  style,
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme, compact);

  if (!benefits || benefits.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      {title && (
        <View style={styles.header}>
          {showIcon && (
            <View style={styles.headerIconContainer}>
              <Icon name="star" size={compact ? 16 : 20} color="#FFD700" />
            </View>
          )}
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
      <View style={styles.benefitsList}>
        {benefits.map((benefit, index) => (
          <View key={index} style={styles.benefitItem}>
            <View style={styles.benefitIconWrapper}>
              <View style={styles.benefitIconContainer}>
                <Icon 
                  name="check-circle" 
                  size={compact ? 14 : 18} 
                  color="#16C784" 
                />
              </View>
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>['theme'], compact: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: compact 
        ? 'rgba(255, 255, 255, 0.03)' 
        : 'rgba(255, 255, 255, 0.05)',
      borderRadius: compact ? 12 : 16,
      padding: compact ? 12 : 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: compact ? 10 : 16,
    },
    headerIconContainer: {
      width: compact ? 24 : 32,
      height: compact ? 24 : 32,
      borderRadius: compact ? 12 : 16,
      backgroundColor: 'rgba(255, 215, 0, 0.15)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: compact ? 6 : 8,
    },
    title: {
      color: '#fff',
      fontSize: compact ? 16 : 18,
      fontWeight: '600',
      textAlign: 'center',
    },
    benefitsList: {
      gap: compact ? 4 : 8,
    },
    benefitItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: compact ? 'transparent' : 'rgba(255, 255, 255, 0.06)',
      borderRadius: compact ? 8 : 12,
      padding: compact ? 6 : 12,
      ...(compact ? {} : {
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
      }),
    },
    benefitIconWrapper: {
      marginRight: compact ? 8 : 12,
    },
    benefitIconContainer: {
      width: compact ? 20 : 28,
      height: compact ? 20 : 28,
      borderRadius: compact ? 10 : 14,
      backgroundColor: 'rgba(22, 199, 132, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    benefitContent: {
      flex: 1,
      justifyContent: 'center',
    },
    benefitText: {
      color: '#fff',
      fontSize: compact ? 13 : 14,
      fontWeight: compact ? '400' : '500',
      lineHeight: compact ? 16 : 18,
    },
  });

export default BenefitsList; 