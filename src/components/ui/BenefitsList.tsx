import React, {useEffect, useMemo, useRef} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
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

  // Sparkle animations like PromoScreen
  const sparkles = useMemo(
    () =>
      [...Array(6)].map(() => ({
        x: Math.random() * 200 + 20,
        delay: Math.floor(Math.random() * 1000),
        translateY: new Animated.Value(0),
        opacity: new Animated.Value(0),
        scale: new Animated.Value(0.6),
      })),
    [],
  );

  useEffect(() => {
    const loops = sparkles.map(({translateY, opacity, scale, delay}) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: -20,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(opacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(opacity, {
                toValue: 0,
                duration: 1600,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(scale, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(scale, {
                toValue: 0.6,
                duration: 1600,
                useNativeDriver: true,
              }),
            ]),
          ]),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ),
    );
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, [sparkles]);

  // Glow pulse animation
  const glow = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [glow]);

  const glowOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.5],
  });

  if (!benefits || benefits.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      {/* Animated Glow Effect */}
      <Animated.View style={[styles.glowEffect, {opacity: glowOpacity}]} />
      
      {/* Sparkle Particles */}
      <View style={styles.sparklesLayer} pointerEvents="none">
        {sparkles.map((sparkle, i) => (
          <Animated.View
            key={i}
            style={[
              styles.sparkle,
              {left: sparkle.x},
              {transform: [{translateY: sparkle.translateY}, {scale: sparkle.scale}]},
              {opacity: sparkle.opacity},
            ]}
          />
        ))}
      </View>

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
          <Animated.View
            key={index}
            style={[
              styles.benefitItem,
              {
                transform: [{scale: glow.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.02],
                })}]
              }
            ]}>
            <View style={styles.checkIcon}>
              <Icon name="check" size={12} color="#16C784" />
            </View>
            <Text style={styles.benefitText}>{benefit}</Text>
          </Animated.View>
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
    glowEffect: {
      position: 'absolute',
      top: -8,
      left: -8,
      right: -8,
      bottom: -8,
      borderRadius: 22,
      backgroundColor: 'rgba(22, 199, 132, 0.15)',
      zIndex: -1,
    },
    sparklesLayer: {
      position: 'absolute',
      top: -8,
      left: 0,
      right: 0,
      height: 16,
      zIndex: 1,
    },
    sparkle: {
      position: 'absolute',
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: '#16C784',
    },
  });

export default BenefitsList; 